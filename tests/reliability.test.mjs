import test from 'node:test';
import assert from 'node:assert/strict';
import { loadApp, project, tick } from './helpers.mjs';

test('app initializes and retains fixed equal/just frequency and explicit-rest timing', () => {
  const app = loadApp();
  try {
    assert.equal(app.errors.length, 0);
    assert.equal(app.api.tuningEngine.frequency('A4','equal'), 440);
    assert.ok(Math.abs(app.api.tuningEngine.frequency('E4','just',{referenceNote:'C4',referenceFrequency:264,tonic:'C'})-330)<1e-9);
    app.api.scoreState.tempo=120;
    app.api.scoreState.events=[{id:1,start:0,duration:1,rest:false,notes:[{note:'A4'}]},{id:2,start:4,duration:1,rest:true,notes:[]},{id:3,start:8,duration:1,rest:false,notes:[{note:'A4'}]}];
    const seq=app.api.scoreSequenceForSide('a');
    assert.deepEqual(Array.from(seq,e=>e.startSeconds),[0,.5,1]);
    assert.deepEqual(Array.from(seq,e=>e.frequencies.length),[1,0,1]);
  } finally { app.close(); }
});

test('rejects malformed score and oversized project without changing the current project', async () => {
  const app=loadApp();
  try {
    app.window.AppConfirm={ask:async()=>true};
    const original=JSON.stringify(app.api.currentSettings());
    const bad=project(app); bad.project.score.events=[{id:1,start:0,duration:1,rest:false,notes:[{note:'<invalid>'}]}];
    assert.equal(app.api.validateProjectDocument(bad).ok,false);
    await app.api.importProjectFile(new File([JSON.stringify(bad)],'bad.json'));
    assert.equal(JSON.stringify(app.api.currentSettings()),original);
    let reads=0; const oversized=new File([' '.repeat(1048577)],'large.json'); oversized.text=async()=>{reads++;return '{}';};
    await app.api.importProjectFile(oversized); assert.equal(reads,0);
    assert.equal(JSON.stringify(app.api.currentSettings()),original);
  } finally { app.close(); }
});

test('legacy missing measureCount opens as four measures; malformed fields never partially apply', () => {
  const app=loadApp(); try {
    const old=project(app); delete old.project.score.measureCount; assert.equal(app.api.validateProjectDocument(old).ok,true);
    for(const corrupt of [p=>p.score.events.push({id:1,start:-1,duration:1,rest:false,notes:[{note:'A4'}]}),p=>p.score.events.push({id:1,start:0,duration:1,rest:false,notes:[]}),p=>p.referenceFrequency='oops',p=>p.abCompare.a.customFrequencies.C4=-1,p=>p.score.events=Array(1025).fill({id:1,start:0,duration:1,rest:true,notes:[]})]) {
      const bad=project(app); corrupt(bad.project); assert.equal(app.api.validateProjectDocument(bad).ok,false);
    }
  } finally { app.close(); }
});

test('slow earlier import cannot overwrite a newer selected project', async()=>{
  const app=loadApp(); try {
    app.window.AppConfirm={ask:async()=>true};
    const a=project(app), b=project(app); a.project.customTuning.name='stale A'; b.project.customTuning.name='latest B';
    let resolveA; const fa=new File(['a'],'a.json'); fa.text=()=>new Promise(resolve=>{resolveA=resolve;});
    const first=app.api.importProjectFile(fa);
    await app.api.importProjectFile(new File([JSON.stringify(b)],'b.json'));
    resolveA(JSON.stringify(a)); await first;
    assert.equal(app.document.querySelector('#customTuningName').value,'latest B');
  } finally { app.close(); }
});

test('JSON filename is editable, persisted, Unicode-safe and preserves extension at the length limit',()=>{
  const app=loadApp(); try {
    const field=app.document.querySelector('#projectFilename'); assert.ok(field);
    field.value='練習/比較'; app.api.exportProjectJson();
    assert.equal(app.downloads[0].filename,'練習-比較.json');
    assert.equal(app.api.currentSettings().projectFilename,'練習/比較');
    assert.match(app.api.sanitizeJsonFilename('音'.repeat(200)),/\.json$/);
    assert.match(app.api.sanitizeWavFilename('音'.repeat(200)),/\.wav$/);
  } finally { app.close(); }
});

test('language button uses EN and JA with current-language destination labels and titles',()=>{
  const app=loadApp();try{
    const button=app.document.querySelector('#languageButton');
    assert.equal(button.textContent,'JA'); assert.equal(button.title,'Switch to Japanese'); assert.equal(button.getAttribute('aria-label'),'Switch to Japanese');
    button.click();assert.equal(button.textContent,'EN');assert.equal(button.title,'英語に切り替え');assert.equal(button.getAttribute('aria-label'),'英語に切り替え');
  }finally{app.close();}
});

test('PCM WAV keeps exact mono 16-bit headers, sample rates and A/B gap',()=>{
 const app=loadApp(); try {
  for(const rate of [44100,48000]) {
   const samples=app.api.buildExportSamples('ab',new Float32Array([.5]),new Float32Array([-.5]),rate,1);
   assert.equal(samples.length,2+Math.round(rate*.6));
   assert.equal(samples[0],.5);assert.equal(samples.at(-1),-.5);
   const bytes=app.api.encodePcm16Wav(samples,rate), view=new DataView(bytes);
   assert.equal(view.getUint16(22,true),1);assert.equal(view.getUint16(34,true),16);assert.equal(view.getUint32(24,true),rate);assert.equal(view.getUint32(40,true),samples.length*2);
  }
 }finally{app.close();}
});

test('WAV export captures both tunings and audio settings before asynchronous rendering; repeated export stays blocked',async()=>{
 const app=loadApp();try{
  const renders=[], scheduled=[];
  class OfflineContext {
   constructor(channels,frames,rate){this.frames=frames;this.rate=rate;this.destination={};}
   createGain(){return {connect(){},gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}}};}
   createOscillator(){const record={};scheduled.push(record);return {frequency:{setValueAtTime(v){record.frequency=v;}},connect(){},start(){},stop(){},setPeriodicWave(){}};}
   createPeriodicWave(){return {};}
   startRendering(){return new Promise(resolve=>renders.push(()=>resolve({getChannelData:()=>new Float32Array(this.frames)})));}
  }
  app.window.OfflineAudioContext=OfflineContext;
  app.api.scoreState.events=[{id:1,start:0,duration:1,rest:false,notes:[{note:'A4'}]}];
  app.document.querySelector('#wavTarget').value='ab';
  app.document.querySelector('#abBType').value='equal'; app.document.querySelector('#abBReferenceFrequency').value='432';
  const pending=app.api.exportScoreWav(); await tick();
  app.document.querySelector('#abBReferenceFrequency').value='444'; app.api.renderScore();
  assert.equal(app.document.querySelector('#exportWavButton').disabled,true);
  await app.api.exportScoreWav(); assert.equal(renders.length,1);
  renders.shift()();await tick();assert.equal(renders.length,1);renders.shift()();await pending;
  assert.deepEqual(scheduled.map(r=>r.frequency),[440,432]);assert.equal(app.downloads.length,1);
 }finally{app.close();}
});

test('cancel leaves project and JSON filename untouched, then the same file can be imported',async()=>{
 const app=loadApp();try{
  const incoming=project(app);incoming.project.projectFilename='保存名';incoming.project.customTuning.name='Imported';
  const file=new File([JSON.stringify(incoming)],'project.json'),original=JSON.stringify(app.api.currentSettings());
  app.window.AppConfirm={ask:async()=>false}; await app.api.importProjectFile(file);assert.equal(JSON.stringify(app.api.currentSettings()),original);
  app.window.AppConfirm={ask:async()=>true};await app.api.importProjectFile(file);assert.equal(app.document.querySelector('#projectFilename').value,'保存名');
  const roundTrip=project(app);assert.equal(app.api.validateProjectDocument(roundTrip).ok,true);
  assert.equal(JSON.parse(app.window.localStorage.getItem('tuning-compare:settings')).projectFilename,'保存名');
 }finally{app.close();}
});

test('legacy omissions reset to clean defaults, not previous custom values',async()=>{
 const app=loadApp();try{
  const incoming=project(app); delete incoming.project.projectFilename;delete incoming.project.score.measureCount;delete incoming.project.abCompare;delete incoming.project.customFrequencies;
  app.document.querySelector('#projectFilename').value='old';app.api.tuningEngine.custom.C4=500;app.document.querySelector('#abBReferenceFrequency').value='444';app.api.scoreState.measureCount=16;
  app.window.AppConfirm={ask:async()=>true};await app.api.importProjectFile(new File([JSON.stringify(incoming)],'legacy.json'));
  assert.equal(app.document.querySelector('#projectFilename').value,'tuning-compare-project');assert.equal(app.api.scoreState.measureCount,4);
  assert.equal(app.document.querySelector('#abBReferenceFrequency').value,'440');assert.ok(app.api.tuningEngine.custom.C4<300);
 }finally{app.close();}
});

test('older confirmation cannot apply after a newer selection or overwrite its status',async()=>{
 const app=loadApp();try{
  const a=project(app),b=project(app);a.project.customTuning.name='old';b.project.customTuning.name='new';let finishFirst;
  app.window.AppConfirm={ask:()=>new Promise(resolve=>{finishFirst=resolve;})};
  const first=app.api.importProjectFile(new File([JSON.stringify(a)],'a.json'));await tick();
  app.window.AppConfirm={ask:async()=>true};await app.api.importProjectFile(new File([JSON.stringify(b)],'b.json'));
  finishFirst(true);await first;assert.equal(app.document.querySelector('#customTuningName').value,'new');
 }finally{app.close();}
});

test('invalid fields including unavailable roots and duplicate identifiers are rejected',()=>{
 const app=loadApp();try{
  for(const mutate of [p=>p.abCompare.root='A5',p=>p.score.events=[{id:1,start:0,duration:1,rest:true,notes:[]},{id:1,start:1,duration:1,rest:true,notes:[]}],p=>p.score.events=[{id:1,start:0,duration:1,rest:false,notes:[{note:'A4',display:'C4',accidental:'natural'}]}],p=>p.wavExport.sampleRate=96000]){
   const bad=project(app);mutate(bad.project);assert.equal(app.api.validateProjectDocument(bad).ok,false);
  }
 }finally{app.close();}
});

test('partial legacy chord arrays fill omitted values from defaults instead of current edits',async()=>{
 const app=loadApp();try{
  const incoming=project(app),defaults=JSON.parse(JSON.stringify(incoming.project));incoming.project.chordFrequencies=['220'];incoming.project.chordEnabled=[true];
  app.document.querySelectorAll('.chord-frequency').forEach(input=>input.value='999');app.document.querySelectorAll('.chord-enabled').forEach(input=>input.checked=false);
  app.window.AppConfirm={ask:async()=>true};await app.api.importProjectFile(new File([JSON.stringify(incoming)],'legacy.json'));
  assert.deepEqual(Array.from(app.document.querySelectorAll('.chord-frequency'),input=>input.value),['220',...defaults.chordFrequencies.slice(1)]);
  assert.deepEqual(Array.from(app.document.querySelectorAll('.chord-enabled'),input=>input.checked),[true,...defaults.chordEnabled.slice(1)]);
 }finally{app.close();}
});

test('oversized WAV duration is rejected before allocation without deleting the score and permits retry',async()=>{
 const app=loadApp();try{
  let contexts=0;app.window.OfflineAudioContext=class{constructor(){contexts++;throw new Error('Test refuses allocation');}};
  app.api.scoreState.tempo=30;app.document.querySelector('#scoreTempo').value='30';
  app.api.scoreState.events=Array.from({length:1024},(_,i)=>({id:i+1,start:0,duration:4,rest:false,notes:[{note:'A4'}]}));
  await app.api.exportScoreWav();assert.equal(contexts,0);assert.equal(app.api.scoreState.events.length,1024);
  assert.match(app.document.querySelector('#wavExportStatus').textContent,/5 minutes/);assert.equal(app.document.querySelector('#exportWavButton').hasAttribute('aria-busy'),false);assert.equal(app.document.querySelector('#exportWavButton').disabled,false);
  app.api.scoreState.events.length=1;await app.api.exportScoreWav();assert.equal(contexts,1);assert.equal(app.downloads.length,0);
 }finally{app.close();}
});

test('WAV budget checks duration and combined peak memory at each supported rate without allocating samples',()=>{
 const app=loadApp();try{
  assert.equal(typeof app.api.wavExportBudget,'function');
  const seq=seconds=>[{startSeconds:0,durationSeconds:seconds,frequencies:[440],rest:false}];
  for(const rate of [44100,48000]){
   const under=app.api.wavExportBudget(seq(120),seq(120),'ab',rate);assert.equal(under.ok,true);assert.equal(under.channels,1);
   const frames=Math.ceil(120.08*rate);assert.equal(under.estimatedBytes,(2*frames)*8+(2*frames+Math.round(rate*.6))*8);
   assert.equal(app.api.wavExportBudget(seq(300.01),seq(300.01),'a',rate).reason,'duration');
   assert.equal(app.api.wavExportBudget(seq(299.99),seq(299.99),'ab',rate).reason,'memory');
  }
  const bound=(256*1024*1024/(32*48000))-.23;
  assert.equal(app.api.wavExportBudget(seq(bound-.01),seq(bound-.01),'ab',48000).ok,true);
  assert.equal(app.api.wavExportBudget(seq(bound+.01),seq(bound+.01),'ab',48000).reason,'memory');
  assert.equal(app.api.wavExportBudget(seq(180),seq(180),'a',48000).ok,true);
  assert.equal(app.api.wavExportBudget(seq(180),seq(180),'ab',48000).reason,'memory');
  assert.equal(app.api.wavExportBudget(seq(180),seq(180),'ab',44100).ok,true);
  assert.equal(app.api.wavExportBudget(seq(1),seq(1),'ab',96000).reason,'format');
 }finally{app.close();}
});

test('mixed valid and out-of-range chord pitches never silently disappear from WAV',async()=>{
 const app=loadApp();try{
  let contexts=0;app.window.OfflineAudioContext=class{constructor(){contexts++;throw new Error('Unexpected allocation');}};
  app.document.querySelector('#abAReferenceFrequency').value='10000';
  app.api.scoreState.events=[{id:1,start:0,duration:1,rest:false,notes:[{note:'A4'},{note:'C6'}]}];
  const before=JSON.stringify(app.api.scoreState.events);await app.api.exportScoreWav();
  assert.equal(contexts,0);assert.equal(app.downloads.length,0);assert.equal(JSON.stringify(app.api.scoreState.events),before);
  assert.match(app.document.querySelector('#wavExportStatus').textContent,/A\/B tuning frequency/);
  assert.equal(app.document.querySelector('#exportWavButton').disabled,false);
 }finally{app.close();}
});
