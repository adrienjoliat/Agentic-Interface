"use client";

import { BasketballCourt, type CourtAgent } from "@/components/basketball-court";
import { PageHeader } from "@/components/ui";
import { PLAYER_FRAMES, PLAYER_HEIGHT } from "@/components/live-utils";
import { useOpenClaw } from "@/components/openclaw-provider";

export function LiveAgents() {
  const { snapshot, loading, stale } = useOpenClaw();
  const roster: CourtAgent[] = (snapshot?.agents || []).map((agent) => ({
    player: agent.player,
    name: agent.name,
    number: agent.number,
    role: agent.role,
    status: agent.working ? "busy" : agent.configured ? "online" : "offline",
    model: agent.model,
    load: agent.load,
    missions: agent.taskCount,
    active: agent.working,
    configured: agent.configured,
    currentWork: agent.currentWork,
    heartbeat: agent.heartbeat,
    sessions: agent.sessionCount,
    heightCm: PLAYER_HEIGHT[agent.player],
    frames: PLAYER_FRAMES[agent.player],
  }));

  return <>
    <PageHeader
      eyebrow="ROSTER / LIVE"
      title="Agent roster"
      description={loading ? "Connecting to OpenClaw…" : stale ? "Live data is temporarily unavailable." : `${snapshot?.summary.configuredAgents || 0} configured · ${snapshot?.summary.workingAgents || 0} currently working. Updated every 5 seconds.`}
      action="+ Draft agent"
    />
    {roster.length > 0 && <BasketballCourt agents={roster} />}
  </>;
}
