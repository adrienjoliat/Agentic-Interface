import { Badge, PageHeader } from "@/components/ui";

const events = [
  ["16:51:09", "Stephen Curry", "Completed", "Mission Control UI scaffold", "green"],
  ["16:48:42", "System", "Connected", "Windows Node (ADRIEN)", "green"],
  ["16:42:18", "Kobe Bryant", "Started", "Workflow runtime implementation", "blue"],
  ["16:31:04", "Michael Jordan", "Indexed", "12 research sources", "gray"],
  ["15:59:27", "LeBron James", "Paused", "QA review queue", "gray"],
] as const;

export default function ActivityPage() { return <><PageHeader eyebrow="TELEMETRY / LIVE" title="Activity stream" description="A timestamped audit trail across every agent and mission." /><section className="panel activity-panel"><div className="activity-toolbar"><div className="filter-tabs"><button className="selected">All events</button><button>Agents</button><button>System</button></div><button className="secondary-button">Export log</button></div><div className="log-list">{events.map(([time,actor,action,detail,tone]) => <div className="log-row" key={`${time}-${detail}`}><time>{time}</time><span className="log-pixel" /><strong>{actor}</strong><Badge tone={tone}>{action}</Badge><p>{detail}</p><button>↗</button></div>)}</div></section></>; }
