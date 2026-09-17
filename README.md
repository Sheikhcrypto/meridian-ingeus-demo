# Meridian

Interactive demo of an employment-support platform for the **Ingeus / Restart** opportunity. It shows how advisors, participants, and operations work from one caseload — with a lived-experience overlay and an AI layer that proposes, never auto-acts.

This is a **demo with synthetic data**. No real participant records.

## What you can open

| View | Path | Who it is for |
|---|---|---|
| Landing | `/` | Role picker and product pitch |
| Advisor | `/advisor` | Today’s caseload, lived-experience flags, AI briefing |
| Participant file | `/advisor/participants/:id` | Plan, notes, jobs, AI suggestions with Accept / Edit / Reject |
| Workflow | `/advisor/workflow` | Referrals, job applications, appointments, safeguarding |
| Participant | `/participant` | Jobs, action plan, coach |
| Operations | `/ops` | Outcomes, integrations, AI-assisted briefing |

## Stack

- Vite + TanStack Start (React)
- Tailwind CSS
- Client-side demo store (synthetic caseload)

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL. For a production build:

```bash
npm run build
```

## Notes for reviewers

- Lived-experience flags (veteran, carer, neurodivergent, long-term sick, ESA, homelessness) sit on the caseload and participant file — they never auto-trigger a decision.
- AI actions require an advisor to Accept, Edit, or Reject. Rejections feed the audit trail.
- Suggested integrations: Salesforce, Unit4, SmartSheet, Plus, PlusMe.

Built as a Grok Build demo for an RFP conversation — not a live production system.
