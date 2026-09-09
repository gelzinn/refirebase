"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Refirebase } from "refirebase";
import {
  EMPTY_CONFIG,
  isConfigReady,
  PLAYGROUND_STORAGE_KEY,
  type PlaygroundConfig,
} from "@/lib/playground";

type PlaygroundContextValue = {
  config: PlaygroundConfig;
  ready: boolean;
  instance: Refirebase | null;
  save: (next: PlaygroundConfig) => void;
  clear: () => void;
};

const PlaygroundContext = createContext<PlaygroundContextValue | null>(null);

function readStoredConfig(): PlaygroundConfig {
  if (typeof window === "undefined") return EMPTY_CONFIG;
  try {
    const raw = sessionStorage.getItem(PLAYGROUND_STORAGE_KEY);
    if (!raw) return EMPTY_CONFIG;
    return { ...EMPTY_CONFIG, ...JSON.parse(raw) };
  } catch {
    return EMPTY_CONFIG;
  }
}

export function PlaygroundProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PlaygroundConfig>(EMPTY_CONFIG);

  useEffect(() => {
    setConfig(readStoredConfig());
  }, []);

  const ready = isConfigReady(config);

  const instance = useMemo(() => {
    if (!ready) return null;
    try {
      return new Refirebase({
        apiKey: config.apiKey.trim(),
        authDomain: config.authDomain.trim(),
        projectId: config.projectId.trim(),
        storageBucket: config.storageBucket.trim(),
        messagingSenderId: config.messagingSenderId.trim(),
        appId: config.appId.trim(),
        ...(config.databaseURL?.trim()
          ? { databaseURL: config.databaseURL.trim() }
          : {}),
        ...(config.measurementId?.trim()
          ? { measurementId: config.measurementId.trim() }
          : {}),
      });
    } catch {
      return null;
    }
  }, [config, ready]);

  const save = useCallback((next: PlaygroundConfig) => {
    setConfig(next);
    sessionStorage.setItem(PLAYGROUND_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const clear = useCallback(() => {
    setConfig(EMPTY_CONFIG);
    sessionStorage.removeItem(PLAYGROUND_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ config, ready, instance, save, clear }),
    [config, ready, instance, save, clear],
  );

  return (
    <PlaygroundContext.Provider value={value}>
      {children}
    </PlaygroundContext.Provider>
  );
}

export function usePlayground() {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error("usePlayground must be used within PlaygroundProvider");
  }
  return context;
}
