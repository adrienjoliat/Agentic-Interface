import type { LiveAgent } from "@/lib/openclaw-types";

export const PLAYER_FRAMES = {
  curry: { active: ["/assets/players/curry/1.png", "/assets/players/curry/2.png", "/assets/players/curry/3.png", "/assets/players/curry/4.png"], bench: "/assets/players/curry/bench.png" },
  jordan: { active: ["/assets/players/jordan/1.png", "/assets/players/jordan/2.png", "/assets/players/jordan/3.png", "/assets/players/jordan/4.png"], bench: "/assets/players/jordan/bench.png" },
  kobe: { active: ["/assets/players/kobe/1.png", "/assets/players/kobe/2.png", "/assets/players/kobe/3.png", "/assets/players/kobe/4.png"], bench: "/assets/players/kobe/bench.png" },
  lebron: { active: ["/assets/players/lebron/1.png", "/assets/players/lebron/2.png", "/assets/players/lebron/3.png", "/assets/players/lebron/4.png"], bench: "/assets/players/lebron/bench.png" },
} as const;

export const PLAYER_HEIGHT = { curry: 188, jordan: 198, kobe: 198, lebron: 206 } as const;

export function statusTone(agent: LiveAgent): "green" | "blue" | "gray" {
  return agent.working ? "green" : agent.configured ? "blue" : "gray";
}

export function relativeTime(timestamp: number | null, now = Date.now()): string {
  if (!timestamp) return "never";
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (seconds < 10) return "now";
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function compactNumber(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}
