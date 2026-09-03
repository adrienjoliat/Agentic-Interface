"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

export type PlayerId = "curry" | "jordan" | "kobe" | "lebron";

type SpriteFrames = {
  active: [string, string, string, string];
  bench: string;
};

export type CourtAgent = {
  player: PlayerId;
  name: string;
  number: string;
  role: string;
  model: string;
  load: number;
  missions: number;
  status: "online" | "busy" | "offline";
  active: boolean;
  heightCm: number;
  frames: SpriteFrames;
};

const ACTION_LABELS: Record<PlayerId, string> = {
  curry: "3PT shot",
  jordan: "Drive + dunk",
  kobe: "Midrange fadeaway",
  lebron: "Power dunk",
};

const PHASE_OFFSET: Record<PlayerId, number> = {
  curry: 0,
  jordan: 1,
  kobe: 2,
  lebron: 3,
};

function Hoop({ side }: { side: "left" | "right" }) {
  return (
    <div className={`court-hoop hoop-${side}`} aria-hidden="true">
      <span className="hoop-post" />
      <span className="hoop-arm" />
      <span className="hoop-backboard" />
      <span className="hoop-rim" />
      <span className="hoop-net" />
    </div>
  );
}

function Bench({ side }: { side: "left" | "right" }) {
  return (
    <div className={`court-bench bench-${side}`} aria-hidden="true">
      <span className="bench-back" />
      <span className="bench-seat" />
      <span className="bench-leg leg-1" />
      <span className="bench-leg leg-2" />
    </div>
  );
}

function CourtLines() {
  return (
    <svg
      className="court-lines"
      viewBox="0 0 1000 260"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* outer boundary */}
      <rect x="12" y="12" width="976" height="236" className="line-main" />

      {/* center line + circle */}
      <line x1="500" y1="12" x2="500" y2="248" className="line-main" />
      <circle cx="500" cy="130" r="38" className="line-main" />

      {/* left paint */}
      <rect x="110" y="68" width="145" height="124" className="line-main" />
      <circle cx="255" cy="130" r="38" className="line-main" />
      <path d="M255 92 A38 38 0 0 1 255 168" className="line-main line-soft" />
      <path d="M110 102 A22 22 0 0 0 110 158" className="line-main" />

      {/* left 3pt */}
      <path d="M72 214 A165 165 0 0 1 72 46" className="line-main" />
      <line x1="12" y1="58" x2="72" y2="58" className="line-main" />
      <line x1="12" y1="202" x2="72" y2="202" className="line-main" />

      {/* right paint */}
      <rect x="745" y="68" width="145" height="124" className="line-main" />
      <circle cx="745" cy="130" r="38" className="line-main" />
      <path d="M745 92 A38 38 0 0 0 745 168" className="line-main line-soft" />
      <path d="M890 102 A22 22 0 0 1 890 158" className="line-main" />

      {/* right 3pt */}
      <path d="M928 46 A165 165 0 0 1 928 214" className="line-main" />
      <line x1="928" y1="58" x2="988" y2="58" className="line-main" />
      <line x1="928" y1="202" x2="988" y2="202" className="line-main" />
    </svg>
  );
}

function CourtPlayer({
  agent,
  tick,
}: {
  agent: CourtAgent;
  tick: number;
}) {
  const phase = agent.active ? (tick + PHASE_OFFSET[agent.player]) % 4 : 0;
  const spriteSrc = agent.active
    ? agent.frames.active[phase]
    : agent.frames.bench;

  const showHeldBall =
    agent.active &&
    (
      agent.player === "jordan" ||
      agent.player === "lebron" ||
      (agent.player === "curry" && phase !== 3) ||
      (agent.player === "kobe" && phase !== 3)
    );

  const showFlightBall =
    agent.active &&
    (agent.player === "curry" || agent.player === "kobe") &&
    phase === 3;

  const style = {
    ["--player-scale" as string]: String(agent.heightCm / 188),
  } as CSSProperties;

  return (
    <div
      className={[
        "court-player",
        `player-${agent.player}`,
        agent.active ? "is-active" : "is-inactive",
        `phase-${phase}`,
      ].join(" ")}
      style={style}
    >
      <div className="court-player-tag">
        <strong>{agent.name}</strong>
        <span>{agent.active ? ACTION_LABELS[agent.player] : "ON BENCH"}</span>
      </div>

      <div className="player-figure">
        <img
          src={spriteSrc}
          alt={agent.name}
          className="court-sprite"
          draggable={false}
        />

        {showHeldBall && (
          <span className={`held-ball held-${agent.player} phase-${phase}`} />
        )}

        {showFlightBall && (
          <span className={`flight-ball flight-${agent.player}`} />
        )}

        <span className="player-shadow" />
      </div>
    </div>
  );
}

export function BasketballCourt({ agents }: { agents: CourtAgent[] }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((t) => (t + 1) % 4);
    }, 180);

    return () => window.clearInterval(id);
  }, []);

  const activeCount = useMemo(
    () => agents.filter((agent) => agent.active).length,
    [agents]
  );

  return (
    <section className="court-panel">
      <header className="court-panel-header">
        <div>
          <p className="kicker">LIVE ARENA</p>
          <h2>Agent court</h2>
        </div>

        <div className="court-live-state">
          <i />
          <strong>{activeCount}</strong>
          <span>ON COURT</span>
        </div>
      </header>

      <div className="court-scroll">
        <div className="basketball-court">
          <div className="arena-scoreboard">
            <span>AGENT ARENA</span>
            <strong>{String(activeCount).padStart(2, "0")}</strong>
            <small>ACTIVE</small>
          </div>

          <div className="arena-wall-line line-1" />
          <div className="arena-wall-line line-2" />

          <Bench side="left" />
          <Bench side="right" />

          <Hoop side="left" />
          <Hoop side="right" />

          <div className="court-surface" aria-hidden="true">
            <span className="surface-logo">AI</span>
            <CourtLines />
          </div>

          {agents.map((agent) => (
            <CourtPlayer key={agent.player} agent={agent} tick={tick} />
          ))}
        </div>
      </div>

      <div className="court-agent-strip">
        {agents.map((agent) => (
          <article
            key={agent.player}
            className={`court-agent-card ${agent.active ? "agent-active" : "agent-inactive"}`}
          >
            <div className="court-agent-top">
              <div className={`jersey-chip jersey-${agent.player}`}>{agent.number}</div>

              <div className="court-agent-meta">
                <strong>{agent.name}</strong>
                <span>{agent.role}</span>
              </div>

              <i className="court-agent-status" />
            </div>

            <div className="court-agent-action">
              <span>{agent.active ? "NOW PLAYING" : "STATUS"}</span>
              <strong>{agent.active ? ACTION_LABELS[agent.player] : "Waiting on bench"}</strong>
            </div>

            <div className="court-agent-info">
              <span>{agent.model}</span>
              <span>{agent.missions} missions</span>
              <span>{agent.load}% load</span>
            </div>

            <div className="court-agent-load">
              <span style={{ width: `${agent.load}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}