# CareCompanion — Doctor–Patient Care Management (Demo)

A React + Vite portfolio prototype for end-to-end doctor workflows, deployed on Vercel without paid APIs.

## Features

- Doctor dashboard with today's appointments, patients, follow-up queue, and quick actions
- Patient directory, profile, medical history, reported allergies, and consultation notes
- Appointment scheduling and status changes (scheduled, checked in, completed, cancelled)
- Original seven-tab Prescription Studio embedded at /prescription-studio.html, including PDF review and multilingual guidance
- Care tasks, follow-ups, manual daily reminder completion, and adherence summary
- Health analytics for appointment counts, condition distribution, and per-patient vitals history
- Clinician safety checklist and six-language browser voice diagnostics
- Fictional starter data, local JSON export, and reset

## Local development

```bash
npm install
npm run dev
npm run build
```

## Deploy

Vercel is connected to this repository's `main` branch. Framework **Vite**, build **npm run build**, output **dist**.

## Important limitations

**Portfolio/demo only.** Fictional data is preloaded. Added records are stored in browser localStorage and are **not encrypted or synchronized between devices**. Do not enter real patient information. There is no user authentication, clinician role management, encrypted backend, clinical validation, or audit trail. The original Prescription Studio is embedded as a standalone module and **does not automatically synchronize** its data with the new patient dashboard. Reminder completion is manual and does not send background push notifications. Voice playback requires installed browser/OS voices.

Before clinical use, implement an authenticated, access-controlled, encrypted backend, patient consent, audit logs, validated medical content, data retention and deletion workflows, and relevant privacy/security reviews.
