# Mission Control — Villars Basket

A local-first dashboard for orchestrating AI agents, designed as a clean operations console with retro basketball-game accents.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-0ea5e9)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## Why this exists

This project explores an agentic software-development workflow: the product brief, visual system, generated pixel-art assets, implementation, verification, and iterative refinement are developed in collaboration with an AI agent running locally through OpenClaw and the OpenAI Codex runtime.

The goal is to evolve the static interface into a live control plane for agents, missions, runtime health, memory, logs, and model usage.

## Current screens

- **Overview** — roster status, mission metrics, health, and recent activity
- **Agents** — basketball-player-inspired agent roster and runtime assignments
- **Missions** — Kanban-style task pipeline
- **Activity** — timestamped agent and system telemetry

## Visual system

- Linear-inspired layout, hierarchy, and whitespace
- Villars Basket blue-and-white palette
- Pixel basketball indicators and 8-bit navigation details
- Generated pixel-art portraits for agent identities
- Monospace telemetry and segmented progress bars
- Responsive desktop and mobile layouts

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run build
```

## Roadmap

- Connect dashboard metrics to live OpenClaw state
- Add mission creation and execution controls
- Stream task and agent logs
- Surface model, token, and cost telemetry
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
