"use client";

import Link from "next/link";
import { AgentAvatar, Badge, PageHeader, ProgressBar, StatCard } from "@/components/ui";
import { compactNumber, relativeTime, statusTone } from "@/components/live-utils";
import { useOpenClaw } from "@/components/openclaw-provider";

export function LiveOverview() {
  const { snapshot, loading, stale } = useOpenClaw();
  const agents = snapshot?.agents || [];
  const tasks = snapshot?.tasks || [];
  const signals = snapshot?.signals || [];
  const connected = Boolean(snapshot?.connected) && !stale;
  const working = snapshot?.summary.workingAgents || 0;
  const configured = snapshot?.summary.configuredAgents || 0;

  return <>
    <PageHeader
      eyebrow="CONTROL ROOM / LIVE"
      title="Good evening, Adrien."
      description={loading ? "Connecting to the OpenClaw runtime…" : stale ? "Runtime telemetry is temporarily unavailable." : `${working} agent${working === 1 ? " is" : "s are"} working across ${configured} configured roster slot${configured === 1 ? "" : "s"}.`}
      action="+ New mission"
    />
    <section className="stats-grid" aria-label="System metrics">
      <StatCard label="Working agents" value={String(working).padStart(2, "0")} delta={`/ ${configured} configured`} icon="◉" />
      <StatCard label="Open tasks" value={String(snapshot?.summary.openTasks || 0).padStart(2, "0")} delta="OpenClaw task registry" icon="◆" />
      <StatCard label="Runtime" value={connected ? "LIVE" : "OFF"} delta={snapshot?.runtimeVersion || "Connecting"} icon="↗" />
      <StatCard label="Session tokens" value={compactNumber(snapshot?.summary.totalTokens || 0)} delta="Across recent sessions" icon="◇" />
    </section>
    <div className="dashboard-grid">
      <section className="panel span-2">
        <div className="panel-heading pixel-grid"><div><p className="kicker">LIVE ROSTER</p><h2>Agent lineup</h2></div><Link href="/agents" className="text-link">View court <span>→</span></Link></div>
        <div className="agent-list">
          {agents.map((agent) => <div className={`agent-row ${agent.configured ? "" : "agent-row-inactive"}`} key={agent.player}>
            <AgentAvatar player={agent.player} status={agent.working ? "busy" : agent.configured ? "online" : "offline"} />
            <div className="agent-meta"><strong>{agent.name}</strong><span>{agent.role} · {agent.model}</span></div>
            <div className="agent-task"><span>{agent.working ? "NOW WORKING" : agent.configured ? "IDLE" : "NOT CONFIGURED"}</span><strong>{agent.currentWork}</strong></div>
            <div className="agent-load"><span>{agent.contextPercent}% context</span><ProgressBar value={agent.load} /></div>
            <Badge tone={statusTone(agent)}>{agent.status}</Badge>
          </div>)}
        </div>
      </section>
      <section className="panel">
        <div className="panel-heading pixel-grid"><div><p className="kicker">OPENCLAW</p><h2>Runtime health</h2></div><Badge tone={connected ? "green" : "gray"}>{connected ? "Connected" : "Offline"}</Badge></div>
        <div className="health-stack">
          <div className="health-score"><span className="score-ring">{connected ? "OK" : "--"}</span><div><strong>{connected ? "Runtime reachable" : "Waiting for runtime"}</strong><p>Local telemetry only</p></div></div>
          <div className="health-row"><span><i />Gateway</span><strong>{snapshot?.gateway.reachable ? "Reachable" : "Unavailable"}</strong></div>
          <div className="health-row"><span><i />Latency</span><strong>{snapshot?.gateway.latencyMs ? `${snapshot.gateway.latencyMs} ms` : "—"}</strong></div>
          <div className="health-row"><span><i />Configured agents</span><strong>{configured}</strong></div>
          <div className="health-row"><span><i />Refresh cadence</span><strong>5 s</strong></div>
        </div>
      </section>
      <section className="panel span-2">
        <div className="panel-heading pixel-grid"><div><p className="kicker">TASK QUEUE</p><h2>Active plays</h2></div><Link href="/missions" className="text-link">Open board <span>→</span></Link></div>
        <div className="mission-table">
          <div className="table-head"><span>Task</span><span>Owner</span><span>Progress</span><span>Priority</span></div>
          {tasks.length === 0 && <div className="live-empty">No registered OpenClaw tasks.</div>}
          {tasks.slice(0, 4).map((task) => <div className="table-row" key={task.id}><strong>{task.title}</strong><span>{task.owner}</span><div className="table-progress"><ProgressBar value={task.progress} /><small>{task.progress}%</small></div><Badge tone={task.priority === "High" ? "blue" : "gray"}>{task.priority}</Badge></div>)}
        </div>
      </section>
      <section className="panel">
        <div className="panel-heading pixel-grid"><div><p className="kicker">ACTIVITY</p><h2>Latest signals</h2></div></div>
        <div className="timeline">
          {signals.length === 0 && <div className="live-empty">No recent signals.</div>}
          {signals.slice(0, 4).map((signal, index) => <div className="timeline-item" key={signal.id}><span className={`timeline-dot dot-${index}`} /><div><strong>{signal.detail}</strong><p>{signal.actor}</p></div><time>{relativeTime(signal.timestamp)}</time></div>)}
        </div>
      </section>
    </div>
  </>;
}
