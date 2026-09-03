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

/*
 * Animation schedule in milliseconds.
 *
 * Change ONLY these four values when you want to tune the rhythm:
 *   frame1: dribble / setup
 *   frame2: gather / drive
 *   frame3: jump / takeoff
 *   frame4: release / dunk / follow-through
 *
 * The shooter flight animation automatically uses almost all of frame 4.
 */
const FRAME_DURATIONS_MS = {
  frame1: 12000,
  frame2: 12000,
  frame3: 12000,
  frame4: 220,
} as const;

const FRAME_DURATIONS = [
  FRAME_DURATIONS_MS.frame1,
  FRAME_DURATIONS_MS.frame2,
  FRAME_DURATIONS_MS.frame3,
  FRAME_DURATIONS_MS.frame4,
] as const;

const SHOT_DURATION_MS = Math.max(500, FRAME_DURATIONS_MS.frame4 - 180);

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

function CourtLines() {
  return (
    <svg
      className="court-lines"
      viewBox="0 0 1000 260"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Outer trapezoid line follows the floor edge */}
      <path
        d="M 8 10 H 992 L 1000 250 H 0 Z"
        className="line-main"
      />

      {/* Center line + center circle */}
      <line x1="500" y1="10" x2="500" y2="250" className="line-main" />
      <ellipse cx="500" cy="130" rx="36" ry="38" className="line-main" />

      {/* LEFT key */}
      <path
        d="
          M 8 84
          H 208
          V 176
          H 8
        "
        className="line-main"
      />

      {/* LEFT free throw semicircle */}
      <path
        d="
          M 208 84
          C 264 84, 264 176, 208 176
        "
        className="line-main"
      />

      {/* LEFT 3-point line all the way to the side edge */}
      <path
        d="
          M 8 34
          H 145
          C 222 48, 270 82, 270 130
          C 270 178, 222 212, 145 226
          H 8
        "
        className="line-main"
      />

      {/* RIGHT key */}
      <path
        d="
          M 992 84
          H 792
          V 176
          H 992
        "
        className="line-main"
      />

      {/* RIGHT free throw semicircle */}
      <path
        d="
          M 792 84
          C 736 84, 736 176, 792 176
        "
        className="line-main"
      />

      {/* RIGHT 3-point line all the way to the side edge */}
      <path
        d="
          M 992 34
          H 855
          C 778 48, 730 82, 730 130
          C 730 178, 778 212, 855 226
          H 992
        "
        className="line-main"
      />
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
  const playerPhase = agent.active ? phase : 0;

  const spriteSrc = agent.active
    ? agent.frames.active[playerPhase]
    : agent.frames.bench;

  const style = {
    ["--player-scale" as string]: String(agent.heightCm / 188),
  } as CSSProperties;

  return (
    <div
      className={[
        "court-player",
        `player-${agent.player}`,
        agent.active ? "is-active" : "is-inactive",
        `phase-${playerPhase}`,
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

        <span className="player-shadow" />
      </div>
    </div>
  );
}

function CourtFlightBall({ player }: { player: "curry" | "kobe" }) {
  const style = {
    animationDuration: `${SHOT_DURATION_MS}ms`,
  } as CSSProperties;

  return (
    <span
      className={`court-flight-ball flight-${player}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function BasketballCourt({ agents }: { agents: CourtAgent[] }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;

    const schedulePhase = (currentPhase: number) => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;

        const nextPhase = (currentPhase + 1) % 4;
        setPhase(nextPhase);
        schedulePhase(nextPhase);
      }, FRAME_DURATIONS[currentPhase]);
    };

    schedulePhase(0);

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const activeCount = useMemo(
    () => agents.filter((agent) => agent.active).length,
    [agents]
  );

  const curryIsShooting =
    phase === 3 &&
    agents.some((agent) => agent.player === "curry" && agent.active);

  const kobeIsShooting =
    phase === 3 &&
    agents.some((agent) => agent.player === "kobe" && agent.active);

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

          <Hoop side="left" />
          <Hoop side="right" />

          <div className="court-surface" aria-hidden="true">
            <span className="surface-logo">AI</span>
            <CourtLines />
          </div>

          {agents.map((agent) => (
            <CourtPlayer key={agent.player} agent={agent} phase={phase} />
          ))}

          {curryIsShooting && <CourtFlightBall player="curry" />}
          {kobeIsShooting && <CourtFlightBall player="kobe" />}
        </div>
      </div>

      <div className="court-agent-strip">
        {agents.map((agent) => (
          <article
            key={agent.player}
            className={`court-agent-card ${
              agent.active ? "agent-active" : "agent-inactive"
            }`}
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