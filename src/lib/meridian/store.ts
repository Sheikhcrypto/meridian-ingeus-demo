import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ADVISORS,
  DEMO_ADVISOR_ID,
  DEMO_PARTICIPANT_ID,
  INTERVENTIONS,
  PARTICIPANTS,
  WORKFLOW,
} from "./seed";
import type {
  Assessment,
  ChatTurn,
  Intervention,
  Participant,
  Role,
  WorkflowTask,
} from "./types";

type MeridianState = {
  role: Role;
  advisorId: string;
  selfId: string;
  participants: Participant[];
  interventions: Intervention[];
  workflow: WorkflowTask[];
  interviews: Record<string, ChatTurn[]>;
  setRole: (role: Role) => void;
  setAdvisorId: (id: string) => void;
  updateParticipant: (id: string, patch: Partial<Participant>) => void;
  setAssessment: (id: string, assessment: Assessment) => void;
  toggleAction: (participantId: string, actionId: string) => void;
  addNote: (participantId: string, body: string, source: "advisor" | "ai") => void;
  setPlan: (participantId: string, plan: string) => void;
  setCv: (participantId: string, cvSummary: string) => void;
  addInterviewTurn: (participantId: string, turn: ChatTurn) => void;
  resetInterview: (participantId: string) => void;
  moveTask: (taskId: string, column: WorkflowTask["column"]) => void;
  acceptReferral: (input: {
    firstName: string;
    lastName: string;
    centre: string;
    goal: string;
    source: string;
  }) => void;
};

function advisorName(id: string) {
  return ADVISORS.find((a) => a.id === id)?.name ?? "Advisor";
}

export const useMeridian = create<MeridianState>()(
  persist(
    (set) => ({
      role: "advisor",
      advisorId: DEMO_ADVISOR_ID,
      selfId: DEMO_PARTICIPANT_ID,
      participants: PARTICIPANTS,
      interventions: INTERVENTIONS,
      workflow: WORKFLOW,
      interviews: {},
      setRole: (role) => set({ role }),
      setAdvisorId: (advisorId) => set({ advisorId }),
      updateParticipant: (id, patch) =>
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          ),
        })),
      setAssessment: (id, assessment) =>
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === id ? { ...p, assessment } : p,
          ),
        })),
      toggleAction: (participantId, actionId) =>
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === participantId
              ? {
                  ...p,
                  actions: p.actions.map((a) =>
                    a.id === actionId ? { ...a, done: !a.done } : a,
                  ),
                }
              : p,
          ),
        })),
      addNote: (participantId, body, source) =>
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === participantId
              ? {
                  ...p,
                  notes: [
                    {
                      id: `note-${Date.now()}`,
                      at: new Date().toISOString().slice(0, 10),
                      author: source === "ai" ? "Meridian AI" : advisorName(s.advisorId),
                      body,
                      source,
                    },
                    ...p.notes,
                  ],
                }
              : p,
          ),
        })),
      setPlan: (participantId, plan) =>
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === participantId ? { ...p, plan } : p,
          ),
        })),
      setCv: (participantId, cvSummary) =>
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === participantId ? { ...p, cvSummary } : p,
          ),
        })),
      addInterviewTurn: (participantId, turn) =>
        set((s) => ({
          interviews: {
            ...s.interviews,
            [participantId]: [...(s.interviews[participantId] ?? []), turn],
          },
        })),
      resetInterview: (participantId) =>
        set((s) => ({
          interviews: { ...s.interviews, [participantId]: [] },
        })),
      moveTask: (taskId, column) =>
        set((s) => ({
          workflow: s.workflow.map((t) =>
            t.id === taskId ? { ...t, column } : t,
          ),
        })),
      acceptReferral: (input) =>
        set((s) => {
          const id = `p-${Date.now()}`;
          const participant: Participant = {
            id,
            firstName: input.firstName,
            lastName: input.lastName,
            preferredName: input.firstName,
            age: 0,
            pronouns: "",
            centre: input.centre,
            localAuthority: input.centre,
            advisorId: s.advisorId,
            programme: "Future Employment Support",
            ucStatus: "Universal Credit",
            referralSource: input.source,
            referralDate: new Date().toISOString().slice(0, 10),
            stage: "referral",
            risk: "medium",
            barriers: [],
            assessment: { life: 0, skills: 0, work: 0, aspirations: 0 },
            goal: input.goal,
            availability: "To confirm",
            lastContact: new Date().toISOString().slice(0, 10),
            nextAction: "Book first appointment",
            daysOnProgramme: 0,
            jobsApplied: 0,
            interviews: 0,
            engagement: 0,
            phone: "",
            email: "",
            plan: "",
            cvSummary: "",
            notes: [
              {
                id: `note-${id}`,
                at: new Date().toISOString().slice(0, 10),
                author: advisorName(s.advisorId),
                body: `Referral accepted from ${input.source}. Goal noted: ${input.goal}.`,
                source: "advisor",
              },
            ],
            actions: [
              {
                id: `act-${id}`,
                title: "Book first appointment",
                due: new Date().toISOString().slice(0, 10),
                done: false,
                owner: "advisor",
              },
            ],
          };
          const task: WorkflowTask = {
            id: `w-${id}`,
            participantId: id,
            title: `First appointment — ${input.firstName} ${input.lastName}`,
            column: "referrals",
            priority: "now",
            due: new Date().toISOString().slice(0, 10),
          };
          return {
            participants: [participant, ...s.participants],
            workflow: [task, ...s.workflow],
          };
        }),
    }),
    { name: "meridian-fes-v1", skipHydration: true },
  ),
);

export function displayName(p: Participant) {
  return `${p.preferredName} ${p.lastName}`;
}

export function advisorById(id: string) {
  return ADVISORS.find((a) => a.id === id);
}
