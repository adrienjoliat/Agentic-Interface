export type PlayerId = "curry" | "jordan" | "kobe" | "lebron";

export type LiveAgent = {
  player: PlayerId;
  agentId: string | null;
  name: string;
  number: string;
  role: string;
  emoji: string;
  configured: boolean;
  working: boolean;
  status: "working" | "idle" | "inactive";
  model: string;
  currentWork: string;
  load: number;
  taskCount: number;
  sessionCount: number;
  contextPercent: number;
  heartbeat: string;
  lastSeenAt: number | null;
};

export type LiveTask = {
  id: string;
  title: string;
  owner: string;
  agentId: string | null;
  status: "backlog" | "running" | "review" | "complete" | "failed";
  progress: number;
  priority: "High" | "Medium" | "Low";
  updatedAt: number | null;
};

export type LiveSignal = {
  id: string;
  actor: string;
  action: string;
  detail: string;
  tone: "green" | "blue" | "gray";
  timestamp: number;
};

export type OpenClawSnapshot = {
  generatedAt: number;
  connected: boolean;
  runtimeVersion: string;
  gateway: {
    reachable: boolean;
    latencyMs: number | null;
  };
  agents: LiveAgent[];
  tasks: LiveTask[];
  signals: LiveSignal[];
  summary: {
    configuredAgents: number;
    workingAgents: number;
    rosterSize: number;
    openTasks: number;
    totalTokens: number;
  };
  error?: string;
};
