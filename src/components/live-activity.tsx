"use client";

import { Badge, PageHeader } from "@/components/ui";
import { relativeTime } from "@/components/live-utils";
import { useOpenClaw } from "@/components/openclaw-provider";

export function LiveActivity() {
  const { snapshot, loading, stale } = useOpenClaw();
  const signals = snapshot?.signals || [];
  return <>
    <PageHeader eyebrow="TELEMETRY / LIVE" title="Activity stream" description={loading ? "Connecting to OpenClaw…" : stale ? "Live activity is temporarily unavailable." : "Sanitized session and task signals from the local runtime."} />
    <section className="panel activity-panel"><div className="activity-toolbar"><div className="filter-tabs"><button className="selected">All events</button><button>Agents</button><button>System</button></div><span className="live-refresh">AUTO REFRESH · 5S</span></div><div className="log-list">
      {signals.length === 0 && <div className="live-empty">No recent runtime activity.</div>}
      {signals.map((signal) => <div className="log-row" key={signal.id}><time>{relativeTime(signal.timestamp)}</time><span className="log-pixel" /><strong>{signal.actor}</strong><Badge tone={signal.tone}>{signal.action}</Badge><p>{signal.detail}</p><span /></div>)}
    </div></section>
  </>;
}
