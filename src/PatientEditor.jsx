import React from 'react';

export const patientFields={
 name:'',dob:'',age:'',sex:'',bloodGroup:'',preferredLanguage:'English',
 phone:'',email:'',city:'',address:'',
 emergencyName:'',emergencyRelation:'',emergencyPhone:'',
 condition:'',chronicConditions:'',allergies:'',currentMedications:'',
 history:'',surgeries:'',familyHistory:'',lifestyle:'',careNotes:''
};

export const patientLanguageChoices=['English','Hindi','Telugu','Tamil','Kannada','Malayalam','Other'];
export const bloodGroups=['','A+','A−','B+','B−','AB+','AB−','O+','O−','Unknown'];

export function calculatedAge(dob){
 if(!dob)return null;
 const date=new Date(dob+'T12:00:00');
 if(Number.isNaN(date.getTime())||date>new Date())return null;
 const now=new Date();let n=now.getFullYear()-date.getFullYear();
 if(now.getMonth()<date.getMonth()||(now.getMonth()===date.getMonth()&&now.getDate()<date.getDate()))n--;
 return Math.max(0,n);
}

export default function PatientEditor({value,onChange,onSubmit,editing}){
 const v={...patientFields,...value};
 const set=(key,x)=>onChange(old=>({...old,[key]:x}));
 const field=(key,label,type='text',placeholder='',extra={})=><label className="field" key={key}><span>{label}</span><input type={type} value={v[key]??''} onChange={e=>set(key,e.target.value)} placeholder={placeholder} {...extra}/></label>;
 const area=(key,label,placeholder)=><label className="field" key={key}><span>{label}</span><textarea rows={3} maxLength={1200} value={v[key]||''} onChange={e=>set(key,e.target.value)} placeholder={placeholder}/></label>;
 const select=(key,label,items)=><label className="field" key={key}><span>{label}</span><select value={v[key]||''} onChange={e=>set(key,e.target.value)}>{items.map(x=><option key={x} value={x}>{x||'Not specified'}</option>)}</select></label>;
 const inferred=calculatedAge(v.dob);
 return <form onSubmit={onSubmit} className="patienteditor">
  <p className="doctorformnotice">Use fictional details only. This demo stores records in local browser storage without authentication or encryption. Do not enter real health records.</p>
  <section className="patienteditorsection"><h3>01 · Basic patient information</h3><p>Identity and general details, with an internal patient ID generated on save.</p><div className="formgrid">
   {field('name','Full name','text','Fictional patient name',{required:true,maxLength:120})}
   {field('dob','Date of birth','date','',{max:new Date().toLocaleDateString('en-CA')})}
   {field('age','Age (if DOB unavailable)','number','Years',{min:0,max:120,disabled:!!v.dob})}
   {select('sex','Sex',['','Female','Male','Intersex','Other','Not specified'])}
   {select('bloodGroup','Blood group',bloodGroups)}
   {select('preferredLanguage','Preferred language',patientLanguageChoices)}
   </div>{inferred!==null&&<p className="formhint">Calculated age from date of birth: {inferred} years.</p>}</section>
  <section className="patienteditorsection"><h3>02 · Contact & emergency details</h3><p>Designed for contacting patients and an emergency contact in a future authenticated system.</p><div className="formgrid">
  {field('phone','Patient contact number','tel','Demo number only',{maxLength:35})}
  {field('email','Patient email','email','Demo email only',{maxLength:130})}
  {field('city','City / district','text','City or district',{maxLength:90})}
  {field('address','Address (optional)','text','Demo-only address',{maxLength:200})}
  {field('emergencyName','Emergency contact name','text','Fictional name',{maxLength:120})}
  {field('emergencyRelation','Relationship','text','e.g. Parent / spouse',{maxLength:70})}
  {field('emergencyPhone','Emergency contact number','tel','Demo number only',{maxLength:35})}
  </div></section>
  <section className="patienteditorsection"><h3>03 · Medical background</h3><p>Clinician-entered context only—no automatic diagnoses or medication recommendations.</p><div className="formgrid">
   {field('condition','Primary condition / reason for visit','text','e.g. Routine follow-up',{maxLength:200})}
   {area('chronicConditions','Other chronic conditions','Previously documented conditions')}
   {area('allergies','Reported allergies / reactions','Note substance and reported reaction; mark unknown if needed')}
   {area('currentMedications','Current medicines and supplements','Patient-reported list; confirm with clinician')}
   {area('surgeries','Previous surgeries and hospitalizations','Relevant procedures and dates')}
   {area('familyHistory','Family history','Relevant reported family history')}
   {area('history','General medical history','Past conditions, treatments and other context')}
   {area('lifestyle','Lifestyle and relevant habits (optional)','Only clinically relevant context')}
   </div></section>
  <section className="patienteditorsection"><h3>04 · Additional care notes</h3>{area('careNotes','Accessibility, communication or follow-up notes','e.g. Needs large-print instructions or caregiver assistance')}</section>
  <div className="actions"><button type="submit">{editing?'Update patient details':'Create demo patient'}</button></div>
 </form>;
}
