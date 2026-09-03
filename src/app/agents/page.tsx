import { AgentAvatar, Badge, PageHeader, ProgressBar } from "@/components/ui";

const roster = [
  { player: "curry", name: "Stephen Curry", number: "30", role: "Orchestrator", status: "online", model: "GPT-5.6 Sol", load: 72, missions: 12 },
  { player: "jordan", name: "Michael Jordan", number: "23", role: "Research", status: "online", model: "GPT-5.6 Sol", load: 48, missions: 8 },
  { player: "kobe", name: "Kobe Bryant", number: "24", role: "Builder", status: "busy", model: "GPT-5.6 Terra", load: 86, missions: 17 },
  { player: "lebron", name: "LeBron James", number: "06", role: "QA & Review", status: "offline", model: "GPT-5.6 Sol", load: 0, missions: 5 },
] as const;

export default function AgentsPage() { return <><PageHeader eyebrow="ROSTER / 004" title="Agent roster" description="Configure your lineup, roles, and runtime assignments." action="+ Draft agent" /><div className="roster-grid">{roster.map(agent => <article className="roster-card" key={agent.name}><div className="player-number">#{agent.number}</div><AgentAvatar player={agent.player} status={agent.status} size="large" /><div className="roster-title"><div><h2>{agent.name}</h2><p>{agent.role}</p></div><Badge tone={agent.status === "online" ? "green" : agent.status === "busy" ? "blue" : "gray"}>{agent.status}</Badge></div><div className="roster-stats"><div><span>MODEL</span><strong>{agent.model}</strong></div><div><span>MISSIONS</span><strong>{agent.missions}</strong></div></div><div className="roster-load"><div><span>Current load</span><strong>{agent.load}%</strong></div><ProgressBar value={agent.load} /></div><button className="secondary-button full">Open player card <span>→</span></button></article>)}</div></>; }
