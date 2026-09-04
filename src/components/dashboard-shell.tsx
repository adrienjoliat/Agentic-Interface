"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useOpenClaw } from "@/components/openclaw-provider";

const navigation = [
  { href: "/", label: "Overview", icon: "▦" },
  { href: "/agents", label: "Agents", icon: "◫" },
  { href: "/missions", label: "Missions", icon: "◆" },
  { href: "/activity", label: "Activity", icon: "⌁" },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { snapshot, loading, stale } = useOpenClaw();
  const working = snapshot?.summary.workingAgents ?? 0;
  const configured = snapshot?.summary.configuredAgents ?? 0;
  const connected = Boolean(snapshot?.connected) && !stale;
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand-row"><span className="pixel-ball" aria-hidden="true" /><div><strong>VILLARS</strong><span>BASKET</span></div></div>
      <div className={`roster-state ${connected ? "" : "is-disconnected"}`}><span className="pixel-ball tiny blink" /><div><strong>{loading ? "CONNECTING" : connected ? "LIVE ROSTER" : "RUNTIME OFFLINE"}</strong><span>{working} working · {configured} configured</span></div></div>
      <nav className="main-nav" aria-label="Primary navigation"><p>MISSION CONTROL</p>{navigation.map((item) => { const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return <Link href={item.href} key={item.href} className={active ? "active" : ""}><span className="nav-icon">{item.icon}</span>{item.label}{active && <i />}</Link>; })}</nav>
      <div className="sidebar-bottom"><button className="profile-button"><span>AJ</span><div><strong>Adrien</strong><small>COMMANDER</small></div><b>···</b></button><div className="version"><span>MC OS</span><strong>v0.1.0</strong></div></div>
    </aside>
    <div className="main-column"><header className="topbar"><div className="mobile-brand"><span className="pixel-ball tiny" /> VILLARS / MC</div><div className="command-key"><span>⌘</span><span>K</span></div><div className="top-actions"><button aria-label="Search">⌕</button><button className="notification" aria-label="Notifications">♢<i /></button><span className={`system-state ${connected ? "" : "is-offline"}`}><i /> {loading ? "CONNECTING" : connected ? "SYSTEM ONLINE" : "SYSTEM OFFLINE"}</span></div></header><main className="content">{children}</main></div>
  </div>;
}
