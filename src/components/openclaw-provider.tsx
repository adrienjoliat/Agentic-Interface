"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { OpenClawSnapshot } from "@/lib/openclaw-types";

type LiveState = {
  snapshot: OpenClawSnapshot | null;
  loading: boolean;
  stale: boolean;
};

const OpenClawContext = createContext<LiveState>({ snapshot: null, loading: true, stale: false });

export function OpenClawProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<OpenClawSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [stale, setStale] = useState(false);

  useEffect(() => {
    let active = true;
    let controller: AbortController | null = null;

    const refresh = async () => {
      controller?.abort();
      controller = new AbortController();
      try {
        const response = await fetch("/api/openclaw", { cache: "no-store", signal: controller.signal });
        const next = await response.json() as OpenClawSnapshot;
        if (!active) return;
        setSnapshot(next);
        setStale(!response.ok);
      } catch (error) {
        if (!active || (error instanceof DOMException && error.name === "AbortError")) return;
        setStale(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    void refresh();
    const interval = window.setInterval(refresh, 5_000);
    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(interval);
    };
  }, []);

  return <OpenClawContext.Provider value={{ snapshot, loading, stale }}>{children}</OpenClawContext.Provider>;
}

export function useOpenClaw() {
  return useContext(OpenClawContext);
}
