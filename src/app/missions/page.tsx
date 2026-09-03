import { AgentAvatar, Badge, PageHeader, ProgressBar } from "@/components/ui";

const columns = [
  { name: "BACKLOG", count: 3, cards: [["Design memory audit","Low","jordan",12],["Index project docs","Medium","curry",5]] },
  { name: "IN PLAY", count: 2, cards: [["Ship Mission Control base","High","curry",78],["Build workflow runtime","High","kobe",46]] },
  { name: "REVIEW", count: 2, cards: [["Research source map","Medium","jordan",92],["Node permission audit","Low","lebron",100]] },
  { name: "COMPLETE", count: 1, cards: [["Connect Telegram route","Medium","curry",100]] },
] as const;

export default function MissionsPage() { return <><PageHeader eyebrow="PLAYBOOK / 008" title="Mission board" description="Work moving through the agent pipeline." action="+ New mission" /><div className="board">{columns.map(column => <section className="board-column" key={column.name}><div className="column-head"><span>{column.name}</span><b>{column.count}</b><button>+</button></div><div className="column-cards">{column.cards.map(card => <article className="mission-card" key={card[0]}><div className="mission-card-top"><Badge tone={card[1] === "High" ? "blue" : "gray"}>{card[1]}</Badge><span>•••</span></div><h3>{card[0]}</h3><p>Automated task with review checkpoint and live telemetry.</p><ProgressBar value={Number(card[3])} /><div className="mission-card-foot"><AgentAvatar player={card[2]} /><span>{card[3]}%</span></div></article>)}</div></section>)}</div></>; }
