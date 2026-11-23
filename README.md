# CareCompanion

React + Vite Doctor Workspace. The existing seven-tab Prescription Studio is served at `/prescription-studio.html` inside the React UI. Includes an optional clinician safety checklist and browser voice diagnostics. No paid APIs.

## Local development

```sh
npm install
npm run dev
```

## Deploy on Vercel

Framework: Vite. Build command: `npm run build`. Output: `dist`. Import this GitHub repository into Vercel to deploy automatically on main updates.

**Clinical and data security:** Prototype only. Do not enter real patient data until proper authentication, encrypted server storage, access controls, privacy review, and clinical validation are implemented. Browser voice availability depends on the operating system.
