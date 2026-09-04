# Mission Control — Villars Basket

A local-first dashboard for orchestrating AI agents, designed as a clean operations console with retro basketball-game accents.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-0ea5e9)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## Why this exists

This project explores an agentic software-development workflow: the product brief, visual system, generated pixel-art assets, implementation, verification, and iterative refinement are developed in collaboration with an AI agent running locally through OpenClaw and the OpenAI Codex runtime.

The interface is connected to the local OpenClaw runtime and refreshes its sanitized operational snapshot every five seconds.

## Current screens

- **Overview** — live roster status, task metrics, runtime health, and recent activity
- **Agents** — configured agents work on court; unconfigured roster slots remain on the bench
- **Missions** — live OpenClaw task pipeline
- **Activity** — sanitized session and task signals

## OpenClaw integration

The server-only `/api/openclaw` route reads the local CLI and returns a deliberately limited payload:

- configured agent identity, model, role, heartbeat, and aggregate session counts
- current working/idle state derived from task and trajectory activity
- task titles, owners, states, priorities, and progress
- gateway reachability, latency, runtime version, and aggregate token usage

It does **not** expose transcripts, prompts, session keys, chat/user identifiers, filesystem paths, gateway addresses, credentials, or raw OpenClaw JSON. The route rejects non-local hostnames. A public deployment without a local OpenClaw runtime therefore shows an offline state rather than personal telemetry.

## Visual system

- Linear-inspired layout, hierarchy, and whitespace
- Villars Basket blue-and-white palette
- Pixel basketball indicators and 8-bit navigation details
- Generated pixel-art portraits for agent identities
- Monospace telemetry and segmented progress bars
- Large, readable typography for operational data across desktop and mobile
- Responsive desktop and mobile layouts

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

OpenClaw must be installed and available as `openclaw` on the server process PATH. The four-player roster maps configured agents by basketball identity and keeps unused slots visibly inactive.

## Quality checks

```bash
npm run lint
npm run build
```

## Roadmap

- Add mission creation and execution controls
- Add opt-in drill-down views for task logs
- Add cost telemetry
- Add persistent mission and agent configuration
- Add screenshots and architecture documentation

## Project structure

```text
src/app/          Next.js routes and global styles
src/components/   Shared dashboard shell and UI primitives
public/assets/    Pixel-art agent sprite assets
```

## Attribution

Built by Adrien Joliat with an agentic AI workflow using OpenClaw and OpenAI Codex.
