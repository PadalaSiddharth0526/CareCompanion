# CareCompanion — Continuous Care Experience

A React + Vite **portfolio prototype** that connects a doctor's workflow with a patient-facing after-visit experience. Deployed on Vercel without paid APIs.

**Live demo:** https://carecompanion-delta.vercel.app/

## Product focus

**Problem:** A prescription alone is not the full care journey. Patients can forget instructions and follow-ups, while doctors need an organized view of what happened after the consultation.

**Experience:** Patient record → Appointment → Consultation & vitals → Prescription Studio → Explicit prescription import → Patient care handout → Follow-up / adherence check-in → Care Journey & analytics.

## Features

- Responsive doctor dashboard and **guided six-step walkthrough** with live workflow progress for fictional patients
- **Doctor Profile**: full name, qualification, specialization, optional medical registration number, clinic identity, hours, location and contact, with an unverified demo-only profile preview
- **Expanded patient directory and record**: date of birth, age, sex, blood group, preferred language, contact, city/address, emergency contact, current medicines, allergies, chronic conditions, surgical and family history, lifestyle and communication needs
- Appointment booking, status changes, and duplicate time-slot protection (single-demo-doctor assumption)
- Consultation notes, vitals, and care-task management
- Original **seven-tab Prescription Studio**, unchanged as the core clinical authoring experience
- **Prescription bridge**: prefill Studio patient identity, reported allergies, latest recorded BP/weight and doctor name; confirm in Studio; explicitly import into the matching patient record, with a snapshot of the self-entered doctor and clinic information. Both patient and doctor names are checked when the doctor profile contains a name
- **Care Journey**: timeline of appointments, consultations, vitals, follow-ups, and linked confirmed Studio records
- **Patient View (Demo)**: prescription medicine schedule, selected diet/precaution guidance, care tasks, manual check-ins and printable/downloadable *demo-only* care handout
- **Care clarity feedback loop:** patient self-reports whether medicine, care, and follow-up instructions are clear. An 'Need explanation' selection appears on the demo doctor dashboard as a clarification request, which can be marked reviewed. This is not a comprehension assessment or a real message to a clinician.
- Analytics for recorded patient conditions, appointment dates, and vitals
- Clinician documentation checklist; **Voice Diagnostics has been removed** from the React navigation. Existing optional voice reminders within the standalone Prescription Studio remain available where supported
- Local JSON export and reset of fictional demo records

## How to try the complete flow

1. Open the live website. The dashboard shows fictional starter patients.
2. Choose a patient in the guided walkthrough. Open **Care Journey** to review the timeline.
3. Open **Doctor Profile** and enter fictional clinician and clinic details. Go to **Prescription Studio**, choose the same patient and select **Prefill patient & doctor**.
4. In the embedded Studio, complete the clinician-entered example fields, medicines (if any), food guidance, and precautions. Select **Confirm demo prescription** in its Review tab.
5. Above the Studio, select **Import confirmation**. This explicit step checks that the Studio patient name matches the selected record, prevents duplicate imports and links a snapshot to the record.
6. Open **Care Journey** to see the prescription event, then **Patient View (Demo)** to read the medication plan, selected guidance and follow-ups.
7. Mark a reminder complete or download the fictional care handout. In **Patient View**, select **Need explanation** for a clarity topic; return to the doctor dashboard to see the clarification queue, and optionally mark the request reviewed.

## Local development

```bash
npm install
npm run dev
npm run build
```

Vercel: Framework `vite`, build `npm run build`, output `dist`. The `main` branch deploys automatically.

## Prototype boundaries — read before use

**Not for clinical use.** All starter patients are fictional. Doctor identity and qualifications are self-entered and NOT credential-verified; no signature is provided. Do not enter real clinician registration or contact information into the public demo. There is **no authentication, role isolation, encrypted backend database, cloud synchronization, delivery of background notifications, regulatory compliance assurance, or clinical decision-support validation**. User-entered records are saved in browser `localStorage`, which is not an appropriate storage layer for real patient health information. **Do not enter real patient data or sensitive health information.**

Prescription Studio is still a standalone HTML module embedded in the React UI. The only cross-module link is the **explicit import of confirmed Studio data into the demo patient record**. That is not equivalent to a unified EHR; exported handouts are not signed or valid prescriptions. The app does not verify medication appropriateness, interactions, contraindications, diagnoses or dose accuracy. Browser voice playback varies by installed device voices.

A real launch requires clinician review, verified medical source content, secure authentication/authorization, encrypted audited data storage, retention/deletion controls, verified clinical workflows, patient consent, and privacy/legal assessment.
