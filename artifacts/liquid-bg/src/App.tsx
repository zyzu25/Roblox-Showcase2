import { useState } from "react";
import { LiquidBackground } from "@/components/LiquidBackground";
import { SettingsProvider } from "@/hooks/useSettings";
import SettingsSidebar, { type SettingsSection } from "@/components/SettingsSidebar";
import SettingsPanel from "@/components/SettingsPanel";
import { Settings } from "lucide-react";

function AppInner() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("background");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Liquid Background Layer */}
      <LiquidBackground />

      {/* Main UI Layer */}
      <div className="relative z-10 flex min-h-screen w-full">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="shrink-0 h-screen border-r border-white/8 backdrop-blur-xl bg-black/20">
            <SettingsSidebar active={activeSection} onChange={setActiveSection} />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 h-screen overflow-hidden flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/8 backdrop-blur-md bg-black/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white/90 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              <h1 className="text-sm font-semibold text-white/90 tracking-wide">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h1>
            </div>
            <div className="text-xs text-white/30">
              Liquid Ambient
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto py-6 px-6">
              {/* Glass panel */}
              <div className="rounded-2xl backdrop-blur-xl bg-black/20 border border-white/8 shadow-2xl overflow-hidden">
                <SettingsPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppInner />
    </SettingsProvider>
  );
}
