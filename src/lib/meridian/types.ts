export type Role = "advisor" | "participant" | "ops";

export type JourneyStage =
  | "referral"
  | "onboarding"
  | "assessment"
  | "support"
  | "intervention"
  | "job-search"
  | "employed"
  | "sustainment"
  | "completed";

export type RiskLevel = "low" | "medium" | "high";

export type Assessment = {
  life: number;
  skills: number;
  work: number;
  aspirations: number;
};

export type Barrier = {
  id: string;
  label: string;
  kind: "vocational" | "non-vocational";
};

export type InterventionStatus = "planned" | "in-progress" | "completed" | "dna";

export type Intervention = {
  id: string;
  participantId: string;
  title: string;
  kind: string;
  status: InterventionStatus;
  scheduled: string;
  owner: string;
  notes: string;
};

export type Outcome = {
  employer: string;
  role: string;
  startDate: string;
  hours: number;
  wage: string;
  sustainmentWeek: number;
};

export type Note = {
  id: string;
  at: string;
  author: string;
  body: string;
  source: "advisor" | "ai";
};

export type ActionItem = {
  id: string;
  title: string;
  due: string;
  done: boolean;
  owner: "participant" | "advisor";
};

export type Participant = {
  id: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  age: number;
  pronouns: string;
  centre: string;
  localAuthority: string;
  advisorId: string;
  programme: string;
  ucStatus: string;
  referralSource: string;
  referralDate: string;
  stage: JourneyStage;
  risk: RiskLevel;
  barriers: Barrier[];
  assessment: Assessment;
  goal: string;
  availability: string;
  lastContact: string;
  nextAction: string;
  daysOnProgramme: number;
  jobsApplied: number;
  interviews: number;
  engagement: number;
  phone: string;
  email: string;
  outcome?: Outcome;
  plan: string;
  cvSummary: string;
  notes: Note[];
  actions: ActionItem[];
};

export type Advisor = {
  id: string;
  name: string;
  role: string;
  centre: string;
  caseloadTarget: number;
};

export type JobVacancy = {
  id: string;
  title: string;
  employer: string;
  location: string;
  salary: string;
  hours: string;
  posted: string;
  skills: string[];
  inclusive: string[];
  summary: string;
};

export type WorkflowTask = {
  id: string;
  participantId: string;
  title: string;
  column: "referrals" | "contact" | "assessments" | "interventions" | "outcomes";
  priority: "now" | "soon" | "watch";
  due: string;
};

export type Integration = {
  id: string;
  name: string;
  category: string;
  status: "connected" | "ready" | "migrating";
  detail: string;
};

export type ChatTurn = {
  role: "coach" | "you";
  text: string;
};

export type ProgrammeKpis = {
  activeCaseload: number;
  referrals30d: number;
  jobStarts30d: number;
  sustainment13: number;
  sustainment26: number;
  dnaRate: number;
  avgDaysToJob: number;
  selfServiceWeekly: number;
  atRisk: number;
  overdueContacts: number;
};

export const STAGES: { id: JourneyStage; label: string; short: string }[] = [
  { id: "referral", label: "Referral", short: "Ref" },
  { id: "onboarding", label: "Onboarding", short: "Onb" },
  { id: "assessment", label: "Assessment", short: "Ass" },
  { id: "support", label: "Personalised support", short: "Sup" },
  { id: "intervention", label: "Interventions", short: "Int" },
  { id: "job-search", label: "Job search", short: "Jobs" },
  { id: "employed", label: "Employment", short: "Job" },
  { id: "sustainment", label: "Sustainment", short: "Sus" },
  { id: "completed", label: "Completer", short: "Done" },
];

export const PILLARS: {
  key: keyof Assessment;
  label: string;
  prompt: string;
}[] = [
  {
    key: "life",
    label: "My Life",
    prompt: "Health, housing, money, caring, stability around work.",
  },
  {
    key: "skills",
    label: "My Skills",
    prompt: "Qualifications, digital skills, and things you can already do.",
  },
  {
    key: "work",
    label: "My Work",
    prompt: "Experience, routine, job-search confidence, workplace readiness.",
  },
  {
    key: "aspirations",
    label: "My Aspirations",
    prompt: "The work you want, and how clearly you can see a path to it.",
  },
];
