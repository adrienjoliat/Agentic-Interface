"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Overview", icon: "▦" },
  { href: "/agents", label: "Agents", icon: "◫" },
  { href: "/missions", label: "Missions", icon: "◆" },
  { href: "/activity", label: "Activity", icon: "⌁" },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand-row"><span className="pixel-ball" aria-hidden="true" /><div><strong>VILLARS</strong><span>BASKET</span></div></div>
      <div className="roster-state"><span className="pixel-ball tiny blink" /><div><strong>AGENTS ONLINE</strong><span>3 / 4 on the court</span></div></div>
      <nav className="main-nav" aria-label="Primary navigation"><p>MISSION CONTROL</p>{navigation.map((item) => { const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return <Link href={item.href} key={item.href} className={active ? "active" : ""}><span className="nav-icon">{item.icon}</span>{item.label}{active && <i />}</Link>; })}</nav>
      <div className="sidebar-bottom"><button className="profile-button"><span>AJ</span><div><strong>Adrien</strong><small>COMMANDER</small></div><b>···</b></button><div className="version"><span>MC OS</span><strong>v0.1.0</strong></div></div>
    </aside>
    <div className="main-column"><header className="topbar"><div className="mobile-brand"><span className="pixel-ball tiny" /> VILLARS / MC</div><div className="command-key"><span>⌘</span><span>K</span></div><div className="top-actions"><button aria-label="Search">⌕</button><button className="notification" aria-label="Notifications">♢<i /></button><span className="system-state"><i /> SYSTEM ONLINE</span></div></header><main className="content">{children}</main></div>
  </div>;
}
