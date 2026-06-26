import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface LiquidSettings {
  blobCount: number;
  speed: number;
  intensity: number;
  colorTheme: "purple" | "ocean" | "sunset" | "forest" | "neon";
  grain: boolean;
  vignette: boolean;
  audioReactive: boolean;
  mouseReactive: boolean;
}

export interface AppSettings {
  liquid: LiquidSettings;
  theme: "dark" | "light" | "auto";
  notifications: boolean;
  soundEffects: boolean;
  reducedMotion: boolean;
  language: string;
}

const defaultSettings: AppSettings = {
  liquid: {
    blobCount: 5,
    speed: 0.15,
    intensity: 1.0,
    colorTheme: "purple",
    grain: true,
    vignette: true,
    audioReactive: true,
    mouseReactive: true,
  },
  theme: "dark",
  notifications: true,
  soundEffects: false,
  reducedMotion: false,
  language: "en",
};

interface SettingsContextType {
  settings: AppSettings;
  setLiquid: (partial: Partial<LiquidSettings>) => void;
  setApp: (partial: Partial<Omit<AppSettings, "liquid">>) => void;
  resetLiquid: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const setLiquid = useCallback((partial: Partial<LiquidSettings>) => {
    setSettings((prev) => ({
      ...prev,
      liquid: { ...prev.liquid, ...partial },
    }));
  }, []);

  const setApp = useCallback((partial: Partial<Omit<AppSettings, "liquid">>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetLiquid = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      liquid: defaultSettings.liquid,
    }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setLiquid, setApp, resetLiquid }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
