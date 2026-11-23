import React from 'react';
const prompts=[
 {id:'medicine',title:'My medicine schedule is clear',detail:'I know when to follow the clinician-entered medicine instructions.'},
 {id:'care',title:'My care instructions are clear',detail:'I understand the diet guidance and precautions selected by the clinician.'},
 {id:'followup',title:'I know what happens next',detail:'I understand the follow-up tasks or appointments recorded here.'}
];
const options=[['unreviewed','Not reviewed'],['clear','Clear to me'],['help','Need explanation']];
export default function UnderstandingCheck({data,setData,patientId,prescriptionId}){
 const id=patientId+':'+(prescriptionId||'no-prescription');
 const record=(data.understanding||[]).find(x=>x.id===id);
 const answers=record?.answers||{};
 function update(prompt,value){
   const now=new Date().toISOString();
   const next={id,patientId,prescriptionId:prescriptionId||null,answers:{...answers,[prompt]:value},updatedAt:now,reviewedAt:null};
   setData(old=>({...old,understanding:[...(old.understanding||[]).filter(x=>x.id!==id),next]}));
 }
 const flagged=Object.values(answers).filter(x=>x==='help').length;
 return <section className="patientpanel teachback">
  <div className="patientpanelhead"><h3>Was everything explained clearly?</h3><span>Optional self-report check-in</span></div>
  <p className="muted">A patient or caregiver can flag anything that needs another explanation. This is not a comprehension test or medical assessment.</p>
  <div className="understandingrows">{prompts.map(p=><div className="understandingrow" key={p.id}><div><strong>{p.title}</strong><small>{p.detail}</small></div><div className="understandingoptions">{options.map(([value,label])=><button type="button" key={value} className={answers[p.id]===value?'picked':''} onClick={()=>update(p.id,value)} aria-pressed={answers[p.id]===value}>{label}</button>)}</div></div>)}</div>
  {flagged>0&&<div className="clarificationnote">You marked {flagged} topic{flagged===1?'':'s'} as needing clarification. This request is visible in the demo doctor dashboard in this browser. It does not send a message or contact a real clinician.</div>}
  {record?.reviewedAt&&<p className="muted">A demo clinician marked this feedback as reviewed. Ask your actual care team directly for medical questions.</p>}
 </section>;
}
