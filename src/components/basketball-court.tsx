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

const FRAME_DURATIONS = [260, 260, 260, 900];

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
      {/* Outer boundary */}
      <rect x="18" y="10" width="964" height="240" className="line-main" />

      {/* Center line + center circle */}
      <line x1="500" y1="10" x2="500" y2="250" className="line-main" />
      <circle cx="500" cy="130" r="34" className="line-main" />

      {/* Left paint */}
      <rect x="115" y="66" width="145" height="128" className="line-main" />
      <circle cx="260" cy="130" r="34" className="line-main" />
      <path d="M260 96 A34 34 0 0 1 260 164" className="line-main line-soft" />

      {/* Left restricted area */}
      <path d="M95 104 A26 26 0 0 1 95 156" className="line-main" />

      {/* Left 3-point line */}
      <line x1="18" y1="58" x2="78" y2="58" className="line-main" />
      <line x1="18" y1="202" x2="78" y2="202" className="line-main" />
      <path d="M78 202 A150 150 0 0 1 78 58" className="line-main" />

      {/* Right paint */}
      <rect x="740" y="66" width="145" height="128" className="line-main" />
      <circle cx="740" cy="130" r="34" className="line-main" />
      <path d="M740 96 A34 34 0 0 0 740 164" className="line-main line-soft" />

      {/* Right restricted area */}
      <path d="M905 104 A26 26 0 0 0 905 156" className="line-main" />

      {/* Right 3-point line */}
      <line x1="922" y1="58" x2="982" y2="58" className="line-main" />
      <line x1="922" y1="202" x2="982" y2="202" className="line-main" />
      <path d="M922 58 A150 150 0 0 1 922 202" className="line-main" />
    </svg>
  );
}

function CourtPlayer({
  agent,
  phase,
}: {
  agent: CourtAgent;
  phase: number;
}) {
  const spriteSrc = agent.active
    ? agent.frames.active[phase]
    : agent.frames.bench;

  const showFlightBall =
    agent.active &&
    phase === 3 &&
    (agent.player === "curry" || agent.player === "kobe");

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

        {showFlightBall && (
          <span className={`flight-ball flight-${agent.player}`} />
        )}

        <span className="player-shadow" />
      </div>
    </div>
  );
}

export function BasketballCourt({ agents }: { agents: CourtAgent[] }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number;

    const run = (currentPhase: number) => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        const next = (currentPhase + 1) % 4;
        setPhase(next);
        run(next);
      }, FRAME_DURATIONS[currentPhase]);
    };

    run(0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
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
            <CourtPlayer key={agent.player} agent={agent} phase={phase} />
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
              <div className={`jersey-chip jersey-${agent.player}`}>
                {agent.number}
              </div>

              <div className="court-agent-meta">
                <strong>{agent.name}</strong>
                <span>{agent.role}</span>
              </div>

              <i className="court-agent-status" />
            </div>

            <div className="court-agent-action">
              <span>{agent.active ? "NOW PLAYING" : "STATUS"}</span>
              <strong>
                {agent.active
                  ? ACTION_LABELS[agent.player]
                  : "Waiting on bench"}
              </strong>
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