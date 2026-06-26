import {
  Palette, Monitor, Volume2, Bell, Globe, Shield,
  Sliders, Image, Keyboard, CircleUser, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsSection =
  | "appearance"
  | "display"
  | "background"
  | "sound"
  | "notifications"
  | "accessibility"
  | "language"
  | "privacy"
  | "profile"
  | "advanced";

interface SidebarProps {
  active: SettingsSection;
  onChange: (s: SettingsSection) => void;
}

const sections: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "display", label: "Display", icon: Monitor },
  { id: "background", label: "Background", icon: Image },
  { id: "sound", label: "Sound", icon: Volume2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "accessibility", label: "Accessibility", icon: Sliders },
  { id: "language", label: "Language & Region", icon: Globe },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "profile", label: "Profile", icon: CircleUser },
  { id: "advanced", label: "Advanced", icon: Keyboard },
];

export default function SettingsSidebar({ active, onChange }: SidebarProps) {
  return (
    <div className="w-64 h-full flex flex-col">
      <div className="px-4 py-3">
        <h2 className="text-sm font-semibold text-white/90 tracking-wide">Settings</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onChange(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                isActive
                  ? "bg-white/15 text-white shadow-sm backdrop-blur-md"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-white/90" : "text-white/40 group-hover:text-white/60"
                )}
              />
              <span className="flex-1 text-left">{section.label}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-white/50" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
