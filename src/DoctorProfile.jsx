import React,{useEffect,useState} from 'react';

export const emptyDoctor={
 fullName:'',qualification:'',specialty:'',registrationNumber:'',clinicName:'',
 clinicCity:'',clinicAddress:'',clinicPhone:'',email:'',consultationHours:'',
 about:''
};

const config=[
 {title:'Professional identity',hint:'The information in this demo is self-entered and has not been verified.',fields:[
  ['fullName','Doctor full name','text','e.g. Dr. A. Kumar'],
  ['qualification','Qualification','text','e.g. MBBS, MD (demo only)'],
  ['specialty','Specialization','text','e.g. General Medicine'],
  ['registrationNumber','Medical registration number','text','Leave blank unless you have authorization to use it']
 ]},
 {title:'Clinic information',hint:'Use fictional clinic details for public portfolio demonstrations.',fields:[
  ['clinicName','Clinic or hospital name','text','e.g. Sample Care Clinic'],
  ['clinicCity','City','text','e.g. Hyderabad'],
  ['clinicAddress','Clinic address','text','Demo location only'],
  ['consultationHours','Consultation hours','text','e.g. Mon–Fri, 10 AM–5 PM'],
  ['clinicPhone','Clinic contact phone','tel','Demo number only'],
  ['email','Professional email','email','Demo contact only']
 ]},
 {title:'About the doctor',hint:'Briefly describe the services and approach. Do not claim credentials that have not been verified.',fields:[
  ['about','Professional introduction','textarea','Clinical interests, consultation approach, or services']
 ]}
];

export default function DoctorProfile({doctor,onSave}){
 const [draft,setDraft]=useState(()=>({...emptyDoctor,...doctor}));
 const [status,setStatus]=useState('');
 useEffect(()=>{setDraft({...emptyDoctor,...doctor})},[doctor]);
 const set=(key,value)=>{setDraft(old=>({...old,[key]:value}));setStatus('')};
 const save=e=>{e.preventDefault();onSave(Object.fromEntries(Object.entries(draft).map(([k,v])=>[k,typeof v==='string'?v.trim():v])));setStatus('Doctor profile saved in this browser (demo only).')};
 const fieldsCompleted=['fullName','qualification','specialty','clinicName','consultationHours'].filter(k=>draft[k]?.trim()).length;
 return <div className="page doctorpage">
  <div className="doctorbanner">
   <div><span className="eyebrow">DOCTOR WORKSPACE · PROFESSIONAL PROFILE</span><h2>The clinician behind the care.</h2><p>Manage identity, qualifications, clinic details, and consultation availability, then reuse those details in the patient-care handoff.</p></div>
   <div className="doctorbannerbadge"><span>Profile essentials</span><strong>{fieldsCompleted}/5</strong><small>Completed</small></div>
  </div>
  <div className="doctortwocol">
   <form className="panel doctorform" onSubmit={save}>
    <p className="doctorformnotice">Portfolio demonstration: information is stored only in this browser. It is not verified against any medical registration authority. Do not enter real professional or patient contact information.</p>
    {config.map(section=><section className="doctorsection" key={section.title}>
      <div><h3>{section.title}</h3><p>{section.hint}</p></div>
      <div className="doctorfields">{section.fields.map(([key,label,type,placeholder])=><label className="field" key={key}><span>{label}</span>{type==='textarea'?<textarea rows={4} value={draft[key]||''} placeholder={placeholder} onChange={e=>set(key,e.target.value)}/>:<input type={type} value={draft[key]||''} placeholder={placeholder} onChange={e=>set(key,e.target.value)} maxLength={key==='about'?500:150}/>}</label>)}</div>
     </section>)}
    <div className="actions"><button type="submit">Save doctor profile</button><button type="button" className="ghost" onClick={()=>{setDraft({...emptyDoctor,...doctor});setStatus('Unsaved edits discarded.')}}>Discard edits</button></div>
    {status&&<p role="status" className="handoffmessage">{status}</p>}
   </form>
   <div className="doctorside">
    <section className="panel doctorcard">
      <span className="demochip">Unverified demo profile</span>
      <div className="doctorportrait">✚</div>
      <h3>{draft.fullName||'Doctor name not added'}</h3>
      <p className="doctorqualification">{[draft.qualification,draft.specialty].filter(Boolean).join(' · ')||'Add qualification and specialization'}</p>
      <div className="doctorline"><span>Registration</span><strong>{draft.registrationNumber||'Not provided'}</strong></div>
      <div className="doctorline"><span>Clinic</span><strong>{draft.clinicName||'Not provided'}</strong></div>
      <div className="doctorline"><span>Location</span><strong>{draft.clinicCity||'Not provided'}</strong></div>
      <div className="doctorline"><span>Hours</span><strong>{draft.consultationHours||'Not provided'}</strong></div>
      <div className="doctorline"><span>Contact</span><strong>{draft.clinicPhone||draft.email||'Not provided'}</strong></div>
      {draft.about&&<p className="doctorabout">{draft.about}</p>}
    </section>
    <section className="panel"><h3>Used across CareCompanion</h3><p className="muted">The saved doctor name can prefill Prescription Studio. Linked prescriptions capture a demo snapshot of the clinician and clinic, so patient handouts show who entered the record.</p><p className="muted">This is not credential verification, a legal signature, or proof that a clinician issued a prescription.</p></section>
   </div>
  </div>
 </div>;
}
