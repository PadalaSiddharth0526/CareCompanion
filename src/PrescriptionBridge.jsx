import React,{useEffect,useRef,useState} from 'react';
import {calculatedAge} from './PatientEditor.jsx';

const KEY='carecompanion_integrated_demo';
const labelDate=value=>{if(!value)return 'Unknown';const d=new Date(value);return Number.isNaN(d.getTime())?value:d.toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})};
function getConfirmed(){
 try{
  const x=JSON.parse(localStorage.getItem(KEY)||'null');
  return x&&typeof x==='object'&&typeof x.patient==='string'&&Array.isArray(x.meds)&&x.created?x:null;
 }catch{return null}
}
export default function PrescriptionBridge({data,doctor,setData,patientId,setPatientId,setTab}){
 const frame=useRef(null);
 const [draft,setDraft]=useState(getConfirmed);
 const [message,setMessage]=useState('');
 const patient=data.patients.find(p=>p.id===patientId);
 const prescriptions=data.prescriptions||[];
 const imports=prescriptions.filter(x=>x.patientId===patientId).sort((a,b)=>b.created.localeCompare(a.created));
 useEffect(()=>{
   const refresh=()=>{setDraft(getConfirmed());setMessage('Studio confirmation received. Review the patient details, then choose Import confirmation.');};
   const handle=event=>{if(event.key===KEY)refresh()};
   const handleMessage=event=>{
     if(event.origin!==window.location.origin||event.source!==frame.current?.contentWindow)return;
     if(event.data?.type==='carecompanion:studio-confirmed')refresh();
   };
   window.addEventListener('storage',handle);
   window.addEventListener('message',handleMessage);
   return()=>{window.removeEventListener('storage',handle);window.removeEventListener('message',handleMessage)};
 },[]);
 function fillPatient(){
  if(!patient)return;
  const doc=frame.current?.contentDocument;
  if(!doc){setMessage('Studio is not ready. Open this tab again and retry.');return}
  const recentVitals=[...(data.vitals||[])].filter(x=>x.patientId===patientId).sort((a,b)=>b.date.localeCompare(a.date))[0];
  const values={patient:patient.name,age:calculatedAge(patient.dob)??patient.age,sex:patient.sex,allergies:patient.allergies,doctor:doctor?.fullName,weightKg:recentVitals?.weight,bp:recentVitals?.systolic&&recentVitals?.diastolic?recentVitals.systolic+'/'+recentVitals.diastolic:''};
  let filled=0;
  Object.entries(values).forEach(([id,value])=>{
   const el=doc.getElementById(id);
   if(el&&value!==undefined&&value!==null){
    el.value=String(value);
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
    filled++;
   }
  });
  setMessage(filled?'Patient details prefilled. Complete the Studio and confirm the draft there, then import it here.':'Could not find patient fields in the Studio.');
 }
 function importDraft(){
  const confirmed=getConfirmed();
  setDraft(confirmed);
  if(!confirmed){setMessage('No confirmed Studio prescription found. Confirm one in the Studio first.');return}
  if(!patient){setMessage('Select a patient record first.');return}
  if(confirmed.patient.trim().toLocaleLowerCase()!==patient.name.trim().toLocaleLowerCase()){
   setMessage('Patient mismatch: Studio shows “'+confirmed.patient+'”, but selected record is “'+patient.name+'”. Select the correct patient or confirm a new Studio prescription.');
   return;
  }
  if(doctor?.fullName?.trim()&&confirmed.doctor.trim().toLowerCase()!==doctor.fullName.trim().toLowerCase()){
    setMessage('Clinician mismatch: Studio shows “'+confirmed.doctor+'”, but Doctor Profile shows “'+doctor.fullName+'”. Prefill the doctor name and reconfirm in Studio before importing.');return;
  }
  if(prescriptions.some(r=>r.patientId===patientId&&r.sourceCreated===confirmed.created)){
   setMessage('This Studio confirmation is already linked to this patient.');return
  }
  const captured=confirmed.doctorProfile&&Object.values(confirmed.doctorProfile).some(Boolean)?confirmed.doctorProfile:(doctor||{});
  const item={
   id:crypto.randomUUID?.()||'rx-'+Date.now(),patientId,sourceCreated:confirmed.created,
   created:confirmed.created,doctor:String(confirmed.doctor||''),doctorProfile:{fullName:String(captured?.fullName||confirmed.doctor||''),qualification:String(captured?.qualification||''),specialty:String(captured?.specialty||''),registrationNumber:String(captured?.registrationNumber||''),clinicName:String(captured?.clinicName||''),clinicCity:String(captured?.clinicCity||''),clinicAddress:String(captured?.clinicAddress||''),clinicPhone:String(captured?.clinicPhone||''),email:String(captured?.email||''),consultationHours:String(captured?.consultationHours||'')},condition:String(confirmed.condition||''),
   specialty:String(confirmed.specialty||''),allergies:String(confirmed.allergies||''),
   meds:confirmed.meds.map(m=>({
    name:String(m.name||''),dose:String(m.dose||''),route:String(m.route||''),
    meal:String(m.meal||''),time:String(m.time||''),duration:String(m.duration||''),
    directions:String(m.directions||''),period:String(m.period||'')
   })),
   guidance:Object.fromEntries(['take','avoid','care'].map(k=>[k,Array.isArray(confirmed.guidance?.[k])?confirmed.guidance[k].map(x=>String(x)).slice(0,100):[]])),
   status:'Imported from confirmed demo Studio'
  };
  setData(old=>({...old,prescriptions:[item,...(old.prescriptions||[])]}));
  setMessage('Prescription linked to '+patient.name+' with a snapshot of doctor and clinic information. It is visible in Care Journey and Patient View. Demo only, not a signed clinical prescription.');
 }
 function prefillAndFocus(){fillPatient();frame.current?.scrollIntoView?.({behavior:'smooth',block:'start'});}
 return <div className="page bridgepage">
 <div className="handoffhero"><div><span className="eyebrow">PRESCRIPTION · CONNECTED WORKFLOW</span><h2>From consultation to continuing care.</h2><p>Complete a clinician-entered prescription in Studio, then explicitly link the confirmed demo to the selected patient record.</p></div><button onClick={()=>setTab('journey')}>Open Care Journey →</button></div>
 <section className="panel"><div className="panelhead"><h2>Patient handoff</h2><span className="demochip">Demo-only workflow</span></div>
 <div className="handoffcontrols">
 <label className="field">Patient record<select value={patientId} onChange={e=>{setPatientId(e.target.value);setMessage('')}}>{data.patients.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
 <button onClick={prefillAndFocus}>① Prefill patient & doctor</button>
 <button className="ghost" onClick={()=>{setDraft(getConfirmed());setMessage('Latest confirmed Studio data refreshed.')}}>② Refresh confirmation</button>
 <button onClick={importDraft}>③ Import confirmation</button>
 </div>
 {message&&<p className="handoffmessage" role="status">{message}</p>}
 <div className="handoffsummary"><div><small>Selected patient</small><strong>{patient?.name||'None selected'}</strong><span>{patient?.allergies?'Reported allergies: '+patient.allergies:'Allergies not recorded'}</span></div>
 <div><small>Latest Studio confirmation</small><strong>{draft?.patient||'None'}</strong><span>{draft?'Confirmed '+labelDate(draft.created)+' · '+draft.meds.length+' scheduled medicine entries':'Use the Studio confirm button first'}</span></div>
 <div><small>Clinician / clinic</small><strong>{doctor?.fullName||'Not configured'}</strong><span>{[doctor?.qualification,doctor?.specialty,doctor?.clinicName].filter(Boolean).join(' · ')||'Complete Doctor Profile to include professional details'}</span></div><div><small>Linked prescriptions</small><strong>{imports.length}</strong><span>For this patient in the demo workspace</span></div></div>
 <p className="muted">Confirming inside the original Studio does not automatically add a record to this workspace. Import is an explicit action; exact patient-name matching prevents accidental cross-linking.</p>
 </section>
 <section className="panel"><div className="panelhead"><h2>Prescription history · {patient?.name||''}</h2><button className="ghost" onClick={()=>setTab('patientview')}>Patient view</button></div>{imports.length?imports.map(rx=><div className="rxhistory" key={rx.id}><div><strong>{rx.condition||'Condition not recorded'}</strong><span>{labelDate(rx.created)} · {rx.doctor||'Clinician not recorded'}</span></div><div><strong>{rx.meds.length}</strong><span>scheduled entries</span></div><button className="ghost" onClick={()=>setTab('journey')}>Timeline</button></div>):<div className="handoffempty">No prescriptions linked to this patient yet. Confirm and import one to populate their care timeline.</div>}</section>
 <div className="info"><strong>Legacy Prescription Studio</strong><span>All original prescription tabs are preserved below. This module uses its own browser storage and requires manual confirmation and import.</span></div>
 <iframe ref={frame} title="CareCompanion Prescription Studio" src="/prescription-studio.html" className="studioframe" allow="microphone"/>
 </div>;
}
