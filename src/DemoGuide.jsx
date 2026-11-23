import React from 'react';
export default function DemoGuide({data,patientId,setPatientId,setTab}){
 const patient=data.patients.find(x=>x.id===patientId);
 const appointments=data.appointments.some(x=>x.patientId===patientId);
 const consultations=data.consultations.some(x=>x.patientId===patientId);
 const prescriptions=(data.prescriptions||[]).some(x=>x.patientId===patientId);
 const care=data.care.some(x=>x.patientId===patientId);
 const steps=[
  {label:'Create or select patient',detail:'Start with a fictional patient profile',done:!!patient,tab:'patients'},
  {label:'Schedule consultation',detail:'Add an appointment to the care journey',done:appointments,tab:'appointments'},
  {label:'Record the consultation',detail:'Document history, assessment and next steps',done:consultations,tab:'journey'},
  {label:'Confirm and link a prescription',detail:'Use Studio, then import the clinician-entered confirmation',done:prescriptions,tab:'prescription'},
  {label:'Plan follow-up care',detail:'Create a task or monitoring reminder',done:care,tab:'care'},
  {label:'Review patient handout',detail:'See how care instructions appear to a patient',done:false,tab:'patientview'}
 ];
 const done=steps.slice(0,5).filter(x=>x.done).length;
 return <section className="panel demoguide">
  <div className="panelhead"><div><span className="demoguide-eyebrow">INTERACTIVE PRODUCT WALKTHROUGH</span><h2>A complete care journey in six steps</h2><p>Explore the connected workflow with fictional records—no account or payment required.</p></div><span className="demoguideprogress">{done}/5</span></div>
  <div className="demochooser"><label>Demo patient <select value={patientId} onChange={e=>setPatientId(e.target.value)}>{data.patients.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select></label><div className="demotrack"><div style={{width:(done/5*100)+'%'}}/></div><span>{Math.round(done/5*100)}% workflow records present</span></div>
  <div className="demosteps">{steps.map((step,i)=><button className="demostep" key={i} onClick={()=>setTab(step.tab)}><span className={step.done?'demostepnum done':'demostepnum'}>{step.done?'✓':i+1}</span><span className="demostepcopy"><strong>{step.label}</strong><small>{step.detail}</small></span><span className="demostepchevron">›</span></button>)}</div>
  <p className="demoguidefoot">Completion means that a demo record exists—not that the content is medically complete, correct or validated. The handout is a preview, not a recorded completion milestone.</p>
 </section>;
}
