import React,{useMemo,useState} from 'react';
import UnderstandingCheck from './UnderstandingCheck.jsx';
const fmt=x=>{if(!x)return 'Not scheduled';const d=new Date(String(x).slice(0,10)+'T12:00:00');return Number.isNaN(d.getTime())?String(x):d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})};
const dl=(name,text)=>{const blob=new Blob([text],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),100)};
export default function PatientView({data,setData,patientId,setPatientId,setTab,patch}){
 const [showHistory,setShowHistory]=useState(false);
 const patient=data.patients.find(p=>p.id===patientId);
 const appointments=data.appointments.filter(x=>x.patientId===patientId&&x.status!=='Cancelled').sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 const tasks=data.care.filter(x=>x.patientId===patientId).sort((a,b)=>a.due.localeCompare(b.due));
 const reminders=data.reminders.filter(x=>x.patientId===patientId).sort((a,b)=>a.time.localeCompare(b.time));
 const rx=useMemo(()=>(data.prescriptions||[]).filter(x=>x.patientId===patientId).sort((a,b)=>b.created.localeCompare(a.created)),[data.prescriptions,patientId]);
 const latest=rx[0];
 const pending=tasks.filter(x=>x.status!=='Completed');
 const today=new Date().toLocaleDateString('en-CA');
 const next=appointments.find(x=>x.date>=today);
 const medicationRows=latest?.meds||[];
 function exportHandout(){
  if(!patient)return;
  const lines=['CARECOMPANION — FICTIONAL PATIENT CARE HANDOUT','FOR DEMONSTRATION ONLY · NOT A VALID PRESCRIPTION','',
   'Patient: '+patient.name,'Reported allergies: '+(patient.allergies||'Not recorded'),
   'Next appointment: '+(next?fmt(next.date)+' at '+next.time+' ('+next.type+')':'None scheduled'),'',
   'LATEST IMPORTED STUDIO RECORD',
   latest?'Condition: '+(latest.condition||'Not recorded'):'No Studio record linked',
   latest?'Clinician (entered): '+(latest.doctor||'Not recorded'):'',
   ...medicationRows.map(m=>[m.name,m.dose,m.route,m.time,m.meal,m.duration,m.directions].filter(Boolean).join(' | ')),'',
   'FOODS TO TAKE',...(latest?.guidance?.take||[]),
   'FOODS TO AVOID / LIMIT',...(latest?.guidance?.avoid||[]),
   'SELECTED PRECAUTIONS',...(latest?.guidance?.care||[]),'',
   'CARE TASKS',...tasks.map(x=>x.title+' | due '+x.due+' | '+x.status),'',
   'A qualified clinician must review all contents before patient use.',
   'This handout is not signed, clinically verified or valid for dispensing.'];
  dl('carecompanion-demo-care-handout.txt',lines.filter(x=>x!==null&&x!==undefined).join('\n'));
 }
 return <div className="page patientpreview">
 <div className="patienthero"><div><span className="eyebrow">CARECOMPANION FOR PATIENTS</span><h2>Your care, clearly explained.</h2><p>A simple preview of the after-visit experience patients could receive.</p></div><span className="demochip">Demo preview · no login</span></div>
 <div className="patientbar"><label>Preview patient <select value={patientId} onChange={e=>setPatientId(e.target.value)}>{data.patients.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><div><button onClick={exportHandout} disabled={!patient}>Download demo handout ↓</button><button className="ghost" onClick={()=>window.print()}>Print view</button></div></div>
 <div className="patient-sheet">
 <div className="patientwelcomecard"><div><span className="eyebrow">AFTER-VISIT CARE SUMMARY</span><h2>Hello, {patient?.name.split(' ')[0]||'there'}.</h2><p>Your visit notes, follow-ups, and care instructions in one place.</p></div><div className="patientwelcomeicon">♡</div></div>
 <div className="patientmetrics"><div><small>Next appointment</small><strong>{next?fmt(next.date):'Not scheduled'}</strong><span>{next?next.time+' · '+next.type:'Check with your care team'}</span></div><div><small>Open care tasks</small><strong>{pending.length}</strong><span>{pending.length?'To review or complete':'No pending tasks'}</span></div><div><small>Reported allergies</small><strong>{patient?.allergies||'Not recorded'}</strong><span>Verify with a qualified clinician</span></div></div>
 <section className="patientpanel"><div className="patientpanelhead"><h3>Medication plan</h3><span>{latest?'Most recently linked Studio confirmation':'No linked prescription'}</span></div>
 {latest?<><p className="patientcondition">Recorded condition: <strong>{latest.condition||'Not recorded'}</strong> · {fmt(latest.created)}</p>{medicationRows.length?<div className="medgrid">{medicationRows.map((m,i)=><div className="medcard" key={i}><div className="mednum">{String(i+1).padStart(2,'0')}</div><div><strong>{m.name||'Unnamed medicine'}</strong><p>{[m.dose,m.route,m.duration].filter(Boolean).join(' · ')}</p><div className="medpill">{[m.time,m.period,m.meal].filter(Boolean).join(' · ')||'Time not specified'}</div>{m.directions&&<small>{m.directions}</small>}</div></div>)}</div>:<p className="muted">No medicines in this confirmation. It may contain selected care guidance only.</p>}</>:<div className="handoffempty">No prescription imported yet. A clinician can confirm one in Prescription Studio, then explicitly import it for this patient.</div>}
 </section>
 <div className="two"><section className="patientpanel"><h3>Food & daily care</h3>{[['Recommended foods',latest?.guidance?.take],['Foods to avoid or limit',latest?.guidance?.avoid],['Selected precautions',latest?.guidance?.care]].map(([title,entries])=><div className="careguidance" key={title}><strong>{title}</strong>{entries?.length?<ul>{entries.map((txt,i)=><li key={i}>{txt}</li>)}</ul>:<p>No instructions linked</p>}</div>)}</section><section className="patientpanel"><h3>Follow-ups & reminders</h3>{tasks.length?tasks.map(x=><div className="patienttask" key={x.id}><div><strong>{x.title}</strong><small>Due {fmt(x.due)}</small><p>{x.instructions}</p></div><span className={'pill '+(x.status==='Pending'?'warn':'')}>{x.status}</span></div>):<p className="muted">No follow-up tasks currently linked.</p>}
 <h4>Daily check-ins</h4>{reminders.length?reminders.map(x=><label className="patientreminder" key={x.id}><input type="checkbox" checked={x.status==='Done'} onChange={e=>patch('reminders',x.id,{status:e.target.checked?'Done':'Pending'})}/><span><strong>{x.title}</strong><small>{x.time} · {x.frequency}</small></span></label>):<p className="muted">No reminders set.</p>}</section></div>
 <UnderstandingCheck data={data} setData={setData} patientId={patientId} prescriptionId={latest?.id}/><div className="patientdisclaimer"><strong>Demo notice:</strong> The data here is fictional and stored only in this browser. This is not a signed prescription, medical advice, a patient-authenticated portal, or an actual reminder delivery system. A clinician must verify all instructions before patient use.</div>
 </div>
 <section className="panel"><div className="panelhead"><h2>Care history</h2><button className="ghost" onClick={()=>setShowHistory(x=>!x)}>{showHistory?'Hide':'Show'} previous imported records</button></div>{showHistory?rx.length?rx.map(x=><div className="rxhistory" key={x.id}><div><strong>{x.condition||'Condition not recorded'}</strong><span>{fmt(x.created)} · {x.meds.length} entries</span></div><button className="ghost" onClick={()=>setTab('journey')}>Full timeline</button></div>):<p className="muted">No imported records yet.</p>:<p className="muted">Select “Show” to view the full imported prescription history.</p>}</section>
 </div>;
}
