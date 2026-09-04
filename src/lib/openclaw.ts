import "server-only";

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type {
  LiveAgent,
  LiveSignal,
  LiveTask,
  OpenClawSnapshot,
  PlayerId,
} from "@/lib/openclaw-types";

const execFileAsync = promisify(execFile);

const ROSTER: Array<{
  player: PlayerId;
  name: string;
  number: string;
  role: string;
  emoji: string;
  aliases: string[];
}> = [
  { player: "curry", name: "Stephen Curry", number: "30", role: "Orchestrator", emoji: "🏀", aliases: ["stephencurry", "curry", "main"] },
  { player: "jordan", name: "Michael Jordan", number: "23", role: "Research", emoji: "🔎", aliases: ["michaeljordan", "jordan"] },
  { player: "kobe", name: "Kobe Bryant", number: "24", role: "Builder", emoji: "🛠️", aliases: ["kobebryant", "kobe"] },
  { player: "lebron", name: "LeBron James", number: "6", role: "QA & Review", emoji: "✓", aliases: ["lebronjames", "lebron"] },
];

type JsonRecord = Record<string, unknown>;

function record(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function number(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clean(value: unknown, fallback: string, max = 100): string {
  const normalized = text(value, fallback).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  return (normalized || fallback).slice(0, max);
}

function normalize(value: unknown): string {
  return text(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function openclawJson(args: string[]): Promise<unknown> {
  const binary = process.env.OPENCLAW_BIN || "openclaw";
  const { stdout } = await execFileAsync(binary, args, {
    timeout: 8_000,
    maxBuffer: 2 * 1024 * 1024,
    env: { ...process.env, NO_COLOR: "1" },
  });
  return JSON.parse(stdout);
}

async function openclawText(args: string[]): Promise<string> {
  const binary = process.env.OPENCLAW_BIN || "openclaw";
  const { stdout } = await execFileAsync(binary, args, {
    timeout: 8_000,
    maxBuffer: 2 * 1024 * 1024,
    env: { ...process.env, NO_COLOR: "1" },
  });
  return stdout;
}

function prettyModel(model: unknown): string {
  const raw = text(model, "Unknown").split("/").pop() || "Unknown";
  const formatted = raw
    .split("-")
    .map((part) => part === "gpt" ? "GPT" : part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return formatted.replace(/^GPT ([0-9])/, "GPT-$1");
}

function liveTrajectory(raw: string, now: number): Map<string, { timestamp: number; channel: string }> {
  const result = new Map<string, { timestamp: number; channel: string }>();
  for (const line of raw.split("\n")) {
    const match = line.match(/^(\d{2}):(\d{2}):(\d{2})\s+\S+\s+agent:([^:]+):([^:…\s]+)/);
    if (!match) continue;
    const timestamp = new Date(now);
    timestamp.setUTCHours(Number(match[1]), Number(match[2]), Number(match[3]), 0);
    if (timestamp.getTime() > now + 60_000) timestamp.setUTCDate(timestamp.getUTCDate() - 1);
    result.set(match[4], { timestamp: timestamp.getTime(), channel: match[5] });
  }
  return result;
}

function sessionChannel(key: unknown): string {
  const raw = text(key);
  if (raw.includes(":telegram:")) return "Telegram";
  if (raw.includes(":discord:")) return "Discord";
  if (raw.includes(":whatsapp:")) return "WhatsApp";
  if (raw.includes(":main")) return "OpenClaw";
  return "direct session";
}

function taskState(value: unknown): LiveTask["status"] {
  const raw = normalize(value);
  if (["complete", "completed", "done", "success", "succeeded"].includes(raw)) return "complete";
  if (["review", "waitingreview", "awaitingreview"].includes(raw)) return "review";
  if (["failed", "error", "blocked", "cancelled", "canceled"].includes(raw)) return "failed";
  if (["running", "active", "inprogress", "working"].includes(raw)) return "running";
  return "backlog";
}

function taskTitle(task: JsonRecord): string {
  return clean(task.title ?? task.name ?? task.objective ?? task.taskName ?? task.task_name, "OpenClaw task", 90);
}

function taskAgentId(task: JsonRecord): string | null {
  const value = text(task.agentId ?? task.agent_id ?? task.ownerId ?? task.owner_id);
  return value || null;
}

function buildTasks(rawTasks: unknown[], agentNames: Map<string, string>): LiveTask[] {
  return rawTasks.map((value, index) => {
    const task = record(value);
    const agentId = taskAgentId(task);
    const status = taskState(task.status ?? task.state);
    const rawPriority = normalize(task.priority);
    const priority: LiveTask["priority"] = rawPriority === "high" || rawPriority === "urgent"
      ? "High"
      : rawPriority === "low"
        ? "Low"
        : "Medium";
    const fallbackProgress = status === "complete" ? 100 : status === "running" ? 50 : 0;
    const stableId = clean(task.id ?? task.taskId ?? task.task_id, `task-${index}`, 80);
    return {
      id: stableId,
      title: taskTitle(task),
      owner: agentId ? agentNames.get(agentId) || "Configured agent" : "OpenClaw",
      agentId,
      status,
      progress: Math.max(0, Math.min(100, number(task.progress ?? task.progressPercent, fallbackProgress))),
      priority,
      updatedAt: number(task.updatedAt ?? task.updated_at, 0) || null,
    };
  });
}

function findSlot(agent: JsonRecord, used: Set<PlayerId>) {
  const identity = normalize(agent.identityName);
  const id = normalize(agent.id);
  return ROSTER.find((slot) => !used.has(slot.player) && slot.aliases.some((alias) => identity.includes(alias) || id === alias))
    || ROSTER.find((slot) => !used.has(slot.player));
}

export async function getOpenClawSnapshot(): Promise<OpenClawSnapshot> {
  const generatedAt = Date.now();
  const [agentsResult, sessionsResult, statusResult, tasksResult, trajectoryResult] = await Promise.allSettled([
    openclawJson(["agents", "list", "--json"]),
    openclawJson(["sessions", "--all-agents", "--json", "--limit", "100"]),
    openclawJson(["status", "--json"]),
    openclawJson(["tasks", "--json", "list"]),
    openclawText(["sessions", "tail", "--all-agents", "--tail", "80"]),
  ]);

  if (agentsResult.status === "rejected") {
    throw new Error("OpenClaw agent registry is unavailable");
  }

  const configured = array(agentsResult.value).map(record);
  const sessionRoot = sessionsResult.status === "fulfilled" ? record(sessionsResult.value) : {};
  const sessions = array(sessionRoot.sessions).map(record);
  const status = statusResult.status === "fulfilled" ? record(statusResult.value) : {};
  const taskRoot = tasksResult.status === "fulfilled" ? record(tasksResult.value) : {};
  const rawTasks = array(taskRoot.tasks).map(record);
  const trajectory = liveTrajectory(trajectoryResult.status === "fulfilled" ? trajectoryResult.value : "", generatedAt);
  const agentNames = new Map(configured.map((agent) => [text(agent.id), clean(agent.identityName, text(agent.id, "Agent"), 50)]));
  const tasks = buildTasks(rawTasks, agentNames);
  const heartbeatAgents = array(record(status.heartbeat).agents).map(record);
  const used = new Set<PlayerId>();
  const mapped = new Map<PlayerId, LiveAgent>();

  for (const agent of configured) {
    const slot = findSlot(agent, used);
    if (!slot) continue;
    used.add(slot.player);
    const agentId = text(agent.id);
    const agentSessions = sessions.filter((session) => text(session.agentId) === agentId);
    const newest = agentSessions.sort((a, b) => number(b.updatedAt) - number(a.updatedAt))[0];
    const lastSeenAt = newest ? number(newest.updatedAt, 0) || null : null;
    const agentTasks = tasks.filter((task) => task.agentId === agentId);
    const runningTask = agentTasks.find((task) => task.status === "running");
    const liveEvent = trajectory.get(agentId);
    const trajectoryActive = Boolean(liveEvent && generatedAt - liveEvent.timestamp < 90_000);
    const working = Boolean(runningTask) || trajectoryActive;
    const contextPercent = newest
      ? Math.max(0, Math.min(100, number(newest.percentUsed, 0)))
      : 0;
    const heartbeat = heartbeatAgents.find((item) => text(item.agentId) === agentId);
    const activeChannel = liveEvent?.channel === "main"
      ? "OpenClaw"
      : liveEvent?.channel
        ? liveEvent.channel.charAt(0).toUpperCase() + liveEvent.channel.slice(1)
        : undefined;
    const currentWork = runningTask?.title
      || (working ? `Handling a ${activeChannel || (newest ? sessionChannel(newest.key) : "direct")} request` : "Waiting for work");

    mapped.set(slot.player, {
      player: slot.player,
      agentId,
      name: clean(agent.identityName, slot.name, 50),
      number: slot.number,
      role: slot.role,
      emoji: clean(agent.identityEmoji, slot.emoji, 8),
      configured: true,
      working,
      status: working ? "working" : "idle",
      model: prettyModel(agent.model),
      currentWork,
      load: working ? Math.max(8, contextPercent) : 0,
      taskCount: agentTasks.length,
      sessionCount: agentSessions.length,
      contextPercent,
      heartbeat: heartbeat && heartbeat.enabled ? clean(heartbeat.every, "Enabled", 20) : "Disabled",
      lastSeenAt,
    });
  }

  const agents = ROSTER.map((slot): LiveAgent => mapped.get(slot.player) || {
    player: slot.player,
    agentId: null,
    name: slot.name,
    number: slot.number,
    role: slot.role,
    emoji: slot.emoji,
    configured: false,
    working: false,
    status: "inactive",
    model: "Not configured",
    currentWork: "Waiting on bench",
    load: 0,
    taskCount: 0,
    sessionCount: 0,
    contextPercent: 0,
    heartbeat: "Disabled",
    lastSeenAt: null,
  });

  const signals: LiveSignal[] = configured.flatMap((agent) => {
    const agentId = text(agent.id);
    const name = agentNames.get(agentId) || "Agent";
    const liveEvent = trajectory.get(agentId);
    const liveChannel = liveEvent?.channel === "main" ? "OpenClaw" : clean(liveEvent?.channel, "direct session", 20);
    const liveSignal: LiveSignal[] = liveEvent && generatedAt - liveEvent.timestamp < 90_000 ? [{
      id: `${agentId}-live`,
      actor: name,
      action: "Working",
      detail: `Active via ${liveChannel}`,
      tone: "green",
      timestamp: liveEvent.timestamp,
    }] : [];
    const sessionSignals: LiveSignal[] = sessions
      .filter((session) => text(session.agentId) === agentId && number(session.updatedAt) > 0)
      .slice(0, 3)
      .map((session, index) => ({
        id: `${agentId}-session-${index}`,
        actor: name,
        action: generatedAt - number(session.updatedAt) < 2 * 60_000 ? "Working" : "Session",
        detail: `Activity via ${sessionChannel(session.key)}`,
        tone: generatedAt - number(session.updatedAt) < 2 * 60_000 ? "green" as const : "gray" as const,
        timestamp: number(session.updatedAt),
      }));
    return [...liveSignal, ...sessionSignals];
  }).sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

  const gateway = record(status.gateway);
  const gatewayReachable = Boolean(gateway.reachable);
  const totalTokens = sessions.reduce((sum, session) => sum + number(session.totalTokens), 0);
  const workingAgents = agents.filter((agent) => agent.working).length;

  return {
    generatedAt,
    connected: gatewayReachable || configured.length > 0,
    runtimeVersion: clean(status.runtimeVersion, "Unknown", 30),
    gateway: {
      reachable: gatewayReachable,
      latencyMs: number(gateway.latencyMs, 0) || null,
    },
    agents,
    tasks,
    signals,
    summary: {
      configuredAgents: configured.length,
      workingAgents,
      rosterSize: ROSTER.length,
      openTasks: tasks.filter((task) => !["complete", "failed"].includes(task.status)).length,
      totalTokens,
    },
  };
}

export function emptySnapshot(error = "OpenClaw is unavailable"): OpenClawSnapshot {
  return {
    generatedAt: Date.now(),
    connected: false,
    runtimeVersion: "Unknown",
    gateway: { reachable: false, latencyMs: null },
    agents: ROSTER.map((slot) => ({
      player: slot.player, agentId: null, name: slot.name, number: slot.number, role: slot.role,
      emoji: slot.emoji, configured: false, working: false, status: "inactive", model: "Not configured",
      currentWork: "Waiting on bench", load: 0, taskCount: 0, sessionCount: 0, contextPercent: 0,
      heartbeat: "Disabled", lastSeenAt: null,
    })),
    tasks: [],
    signals: [],
    summary: { configuredAgents: 0, workingAgents: 0, rosterSize: ROSTER.length, openTasks: 0, totalTokens: 0 },
    error,
  };
}
