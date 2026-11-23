import React from 'react';
import {calculatedAge} from './PatientEditor.jsx';
const display=x=>String(x??'').trim()||'Not recorded';
const dateStr=x=>{if(!x)return 'Not recorded';const d=new Date(x+'T12:00:00');return Number.isNaN(d.getTime())?x:d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})};

export default function PatientSummary({patient,data,onConsultation,onVitals,onTask,onPrescription,onPatientView}){
 if(!patient)return null;
 const id=patient.id;
 const age=calculatedAge(patient.dob);
 const recentVitals=data.vitals.filter(v=>v.patientId===id).sort((a,b)=>b.date.localeCompare(a.date))[0];
 const consultations=data.consultations.filter(c=>c.patientId===id).sort((a,b)=>b.date.localeCompare(a.date));
 const appointments=data.appointments.filter(a=>a.patientId===id&&a.status!=='Cancelled').sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
 const linked=(data.prescriptions||[]).filter(x=>x.patientId===id);
 const info=(label,val)=><div className="patientinfopair"><span>{label}</span><strong>{display(val)}</strong></div>;
 const read=(label,val)=><div className="patientread"><span>{label}</span><p>{display(val)}</p></div>;
 return <section className="panel patientrecord">
  <div className="patientrecordhead"><div className="patientrecordavatar">{patient.name?.split(' ').filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'P'}</div><div><span className="eyebrow dark">PATIENT FILE · DEMO</span><h2>{patient.name}</h2><p>Patient ID: {patient.id} · {patient.condition||'Condition not recorded'}</p></div><span className="pill">{patient.status||'Active'}</span></div>
  <div className="patientrecordmetrics">
   {info('Age',age??patient.age?String(age??patient.age)+' years':'Not recorded')}
   {info('Date of birth',patient.dob?dateStr(patient.dob):'Not recorded')}
   {info('Sex',patient.sex)}
   {info('Blood group',patient.bloodGroup)}
   {info('Preferred language',patient.preferredLanguage)}
  </div>
  <div className="patientrecordgrid">
   <section><h3>Contact & emergency</h3>{info('Phone',patient.phone)}{info('Email',patient.email)}{info('City / district',patient.city)}{info('Address',patient.address)}{info('Emergency contact',patient.emergencyName)}{info('Relationship',patient.emergencyRelation)}{info('Emergency phone',patient.emergencyPhone)}</section>
   <section><h3>Clinical background</h3>{read('Primary condition',patient.condition)}{read('Reported allergies',patient.allergies)}{read('Current medications / supplements',patient.currentMedications)}{read('Chronic conditions',patient.chronicConditions)}{read('Previous surgery / admissions',patient.surgeries)}{read('General history',patient.history)}{read('Family history',patient.familyHistory)}{read('Lifestyle / relevant habits',patient.lifestyle)}</section>
  </div>
  <section className="patientcarecontext"><h3>Care context</h3>{read('Care and communication notes',patient.careNotes)}<div className="patientrecordmetrics">{info('Visits recorded',consultations.length)}{info('Linked prescriptions',linked.length)}{info('Latest appointment',appointments[0]?dateStr(appointments[0].date)+' · '+appointments[0].status:'None recorded')}{info('Latest blood pressure',recentVitals?.systolic&&recentVitals?.diastolic?recentVitals.systolic+'/'+recentVitals.diastolic+' mmHg':'Not recorded')}</div></section>
  <div className="actions patientrecordactions"><button onClick={onConsultation}>+ Consultation</button><button className="ghost" onClick={onVitals}>Record vitals</button><button className="ghost" onClick={onTask}>Add follow-up</button><button className="ghost" onClick={onPrescription}>Prescription Studio</button><button className="ghost" onClick={onPatientView}>Patient View</button></div>
  <p className="muted">Information is clinician-entered or fictional demo content, not a verified medical record. Entries in this browser are not secure for real patient information.</p>
 </section>;
}
