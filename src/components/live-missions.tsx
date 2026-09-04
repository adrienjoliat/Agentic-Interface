"use client";

import { AgentAvatar, Badge, PageHeader, ProgressBar } from "@/components/ui";
import { useOpenClaw } from "@/components/openclaw-provider";
import type { LiveTask } from "@/lib/openclaw-types";

const COLUMNS: Array<{ name: string; states: LiveTask["status"][] }> = [
  { name: "BACKLOG", states: ["backlog"] },
  { name: "IN PLAY", states: ["running"] },
  { name: "REVIEW", states: ["review"] },
  { name: "COMPLETE", states: ["complete", "failed"] },
];

export function LiveMissions() {
  const { snapshot, loading, stale } = useOpenClaw();
  const tasks = snapshot?.tasks || [];
  return <>
    <PageHeader eyebrow="PLAYBOOK / LIVE" title="Mission board" description={loading ? "Connecting to OpenClaw…" : stale ? "Task registry unavailable." : `${tasks.length} real task${tasks.length === 1 ? "" : "s"} in the OpenClaw registry.`} action="+ New mission" />
    <div className="board">{COLUMNS.map((column) => {
      const cards = tasks.filter((task) => column.states.includes(task.status));
      return <section className="board-column" key={column.name}><div className="column-head"><span>{column.name}</span><b>{cards.length}</b><button>+</button></div><div className="column-cards">
        {cards.length === 0 && <div className="board-empty">No tasks</div>}
        {cards.map((task) => {
          const owner = snapshot?.agents.find((agent) => agent.agentId === task.agentId);
          return <article className="mission-card" key={task.id}><div className="mission-card-top"><Badge tone={task.status === "failed" ? "gray" : task.priority === "High" ? "blue" : "gray"}>{task.status === "failed" ? "Failed" : task.priority}</Badge><span>•••</span></div><h3>{task.title}</h3><p>{task.owner} · live OpenClaw task</p><ProgressBar value={task.progress} /><div className="mission-card-foot">{owner ? <AgentAvatar player={owner.player} status={owner.working ? "busy" : "online"} /> : <span />}<span>{task.progress}%</span></div></article>;
        })}
      </div></section>;
    })}</div>
  </>;
}
