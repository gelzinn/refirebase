"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  collapsed: boolean;
  toggleCollapsed: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function PlaygroundSidebarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      collapsed,
      toggleCollapsed: () => setCollapsed((current) => !current),
    }),
    [open, collapsed],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function usePlaygroundSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "usePlaygroundSidebar must be used within PlaygroundSidebarProvider",
    );
  }
  return context;
}
