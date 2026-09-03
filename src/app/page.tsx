import { AgentAvatar, Badge, PageHeader, ProgressBar, StatCard } from "@/components/ui";

const agents = [
  { name: "Stephen Curry", role: "Orchestrator", status: "online", sprite: "curry", task: "Mission Control shell", load: 72 },
  { name: "Michael Jordan", role: "Research", status: "online", sprite: "jordan", task: "Source validation", load: 48 },
  { name: "Kobe Bryant", role: "Builder", status: "busy", sprite: "kobe", task: "Workflow runtime", load: 86 },
  { name: "LeBron James", role: "QA & Review", status: "offline", sprite: "lebron", task: "Waiting for work", load: 0 },
] as const;

export default function OverviewPage() {
  return (
    <>
      <PageHeader eyebrow="CONTROL ROOM / 001" title="Good afternoon, Adrien." description="Your agent roster is stable. Three players are on the court." action="+ New mission" />
      <section className="stats-grid" aria-label="System metrics">
        <StatCard label="Active agents" value="03" delta="/ 04 rostered" icon="◉" />
        <StatCard label="Open missions" value="08" delta="2 high priority" icon="◆" />
        <StatCard label="Success rate" value="96.4%" delta="↑ 2.1 this week" icon="↗" />
        <StatCard label="Tokens today" value="1.28M" delta="68% of budget" icon="◇" />
      </section>
      <div className="dashboard-grid">
        <section className="panel span-2">
          <div className="panel-heading pixel-grid"><div><p className="kicker">LIVE ROSTER</p><h2>Agent lineup</h2></div><a href="/agents" className="text-link">View all <span>→</span></a></div>
          <div className="agent-list">
            {agents.map((agent) => (
              <div className="agent-row" key={agent.name}>
                <AgentAvatar player={agent.sprite} status={agent.status} />
                <div className="agent-meta"><strong>{agent.name}</strong><span>{agent.role}</span></div>
                <div className="agent-task"><span>NOW PLAYING</span><strong>{agent.task}</strong></div>
                <div className="agent-load"><span>{agent.load}%</span><ProgressBar value={agent.load} /></div>
                <Badge tone={agent.status === "online" ? "green" : agent.status === "busy" ? "blue" : "gray"}>{agent.status}</Badge>
              </div>
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading pixel-grid"><div><p className="kicker">SYSTEM</p><h2>Runtime health</h2></div><Badge tone="green">Nominal</Badge></div>
          <div className="health-stack">
            <div className="health-score"><span className="score-ring">98</span><div><strong>All systems go</strong><p>No incidents in 7 days</p></div></div>
            {[["Gateway","12 ms"],["Windows node","Connected"],["Task queue","8 ready"],["Memory","Healthy"]].map(([name,value]) => <div className="health-row" key={name}><span><i />{name}</span><strong>{value}</strong></div>)}
          </div>
        </section>
        <section className="panel span-2">
          <div className="panel-heading pixel-grid"><div><p className="kicker">MISSION QUEUE</p><h2>Active plays</h2></div><a href="/missions" className="text-link">Open board <span>→</span></a></div>
          <div className="mission-table">
            <div className="table-head"><span>Mission</span><span>Owner</span><span>Progress</span><span>Priority</span></div>
            {[["Ship Mission Control base","Stephen Curry",78,"High"],["Map agent memory architecture","Michael Jordan",42,"Medium"],["Automate weekly research digest","Kobe Bryant",18,"Medium"]].map(([mission,owner,progress,priority]) => <div className="table-row" key={String(mission)}><strong>{mission}</strong><span>{owner}</span><div className="table-progress"><ProgressBar value={Number(progress)} /><small>{progress}%</small></div><Badge tone={priority === "High" ? "blue" : "gray"}>{String(priority)}</Badge></div>)}
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading pixel-grid"><div><p className="kicker">ACTIVITY</p><h2>Latest signals</h2></div></div>
          <div className="timeline">
            {[["Stephen Curry","Completed UI scaffold","2m"],["Kobe Bryant","Started workflow runtime","18m"],["Michael Jordan","Added 12 sources","34m"],["System","Windows node reconnected","1h"]].map(([who,event,time], i) => <div className="timeline-item" key={event}><span className={`timeline-dot dot-${i}`} /><div><strong>{event}</strong><p>{who}</p></div><time>{time}</time></div>)}
          </div>
        </section>
      </div>
    </>
  );
}
