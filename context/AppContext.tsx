"use client";
// context/AppContext.tsx
// React Context = shared state for the whole app. useApp() to read it anywhere.
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import type { Farmer, Role } from "@/types";
import {
  loadState, saveState, getFarmers, updateFarmer,
  verifyFarmer, rejectFarmer, getActiveRole, setActiveRole,
  getCurrentFarmerId, setCurrentFarmerId as storageSetFarmerId,
  getDarkMode, toggleDarkMode as storageDarkMode,
} from "@/lib/storage";
import { FAKE_FARMERS } from "@/lib/fakeData";

interface Ctx {
  activeRole: Role;
  setRole: (r: Role) => void;
  currentFarmer: Farmer | null;
  setCurrentFarmerId: (id: string | null) => void;
  farmers: Farmer[];
  refreshFarmers: () => void;
  saveFarmer: (f: Farmer) => void;
  appVerifyFarmer: (id: string) => void;
  appRejectFarmer: (id: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<Role>("farmer");
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const state = loadState();
    // Seed demo data on first visit
    if (state.farmers.length === 0) {
      saveState({ ...state, farmers: FAKE_FARMERS });
      setFarmers(FAKE_FARMERS);
    } else {
      setFarmers(state.farmers);
    }
    setActiveRoleState(getActiveRole());
    setCurrentId(getCurrentFarmerId());
    const dm = getDarkMode();
    setDarkMode(dm);
    document.documentElement.classList.toggle("dark", dm);
  }, []);

  const refreshFarmers = useCallback(() => setFarmers(getFarmers()), []);

  const setRole = useCallback((r: Role) => { setActiveRole(r); setActiveRoleState(r); }, []);

  const handleSetId = useCallback((id: string | null) => {
    storageSetFarmerId(id); setCurrentId(id);
  }, []);

  const saveFarmer = useCallback((f: Farmer) => { updateFarmer(f); refreshFarmers(); }, [refreshFarmers]);
  const appVerifyFarmer = useCallback((id: string) => { verifyFarmer(id); refreshFarmers(); }, [refreshFarmers]);
  const appRejectFarmer = useCallback((id: string) => { rejectFarmer(id); refreshFarmers(); }, [refreshFarmers]);

  const handleDark = useCallback(() => {
    const v = storageDarkMode();
    setDarkMode(v);
    document.documentElement.classList.toggle("dark", v);
  }, []);

  const currentFarmer = farmers.find(f => f.id === currentId) ?? null;

  return (
    <AppContext.Provider value={{ activeRole, setRole, currentFarmer, setCurrentFarmerId: handleSetId,
      farmers, refreshFarmers, saveFarmer, appVerifyFarmer, appRejectFarmer, darkMode, toggleDarkMode: handleDark }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): Ctx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside <AppProvider>");
  return ctx;
}
