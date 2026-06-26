import { useState } from "react";
import { useSettings, type LiquidSettings } from "@/hooks/useSettings";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  RotateCcw, Sparkles, Eye, EyeOff, Music, Mouse,
  Sun, Moon, SunMoon, Bell, BellOff, Volume2, VolumeX,
  Zap, Circle, Palette, Check, SlidersHorizontal
} from "lucide-react";

const colorThemes: { id: LiquidSettings["colorTheme"]; label: string; gradient: string }[] = [
  { id: "purple", label: "Purple Neon", gradient: "from-purple-500 via-fuchsia-400 to-violet-600" },
  { id: "ocean", label: "Ocean Depth", gradient: "from-cyan-500 via-blue-400 to-teal-600" },
  { id: "sunset", label: "Sunset Glow", gradient: "from-orange-500 via-pink-400 to-red-500" },
  { id: "forest", label: "Forest Mist", gradient: "from-emerald-500 via-lime-400 to-green-600" },
  { id: "neon", label: "Neon City", gradient: "from-yellow-400 via-pink-500 to-cyan-400" },
];

function SettingRow({
  icon,
  label,
  description,
  children,
  highlighted,
}: {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  children: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div className={cn(
      "flex items-center justify-between py-4 px-4 rounded-xl transition-colors",
      highlighted && "bg-white/5"
    )}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-white/40">{icon}</div>}
        <div>
          <div className="text-sm font-medium text-white/90">{label}</div>
          {description && (
            <div className="text-xs text-white/40 mt-0.5">{description}</div>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function SectionTitle({ children, badge }: { children: string; badge?: string }) {
  return (
    <div className="flex items-center gap-2 mb-1 px-4 pt-2">
      <h3 className="text-lg font-semibold text-white">{children}</h3>
      {badge && (
        <Badge variant="secondary" className="bg-white/10 text-white/70 text-[10px] hover:bg-white/10">
          {badge}
        </Badge>
      )}
    </div>
  );
}

export default function SettingsPanel() {
  const { settings, setLiquid, setApp, resetLiquid } = useSettings();
  const [preview] = useState(true);
  const { liquid } = settings;

  return (
    <div className="flex flex-col gap-2">
      {/* Background Settings */}
      <SectionTitle badge="Live">Background</SectionTitle>
      <div className="space-y-1">
        <SettingRow
          icon={<Sparkles className="w-4 h-4" />}
          label="Blob Count"
          description={`${liquid.blobCount} organic blobs`}
        >
          <Slider
            value={[liquid.blobCount]}
            min={1}
            max={8}
            step={1}
            onValueChange={([v]) => setLiquid({ blobCount: v })}
            className="w-32"
          />
        </SettingRow>

        <SettingRow
          icon={<Zap className="w-4 h-4" />}
          label="Animation Speed"
          description={`${Math.round(liquid.speed * 100)}%`}
        >
          <Slider
            value={[liquid.speed * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={([v]) => setLiquid({ speed: v / 100 })}
            className="w-32"
          />
        </SettingRow>

        <SettingRow
          icon={<Circle className="w-4 h-4" />}
          label="Intensity"
          description={`${Math.round(liquid.intensity * 100)}%`}
        >
          <Slider
            value={[liquid.intensity * 100]}
            min={0}
            max={200}
            step={1}
            onValueChange={([v]) => setLiquid({ intensity: v / 100 })}
            className="w-32"
          />
        </SettingRow>

        <SettingRow
          icon={<Palette className="w-4 h-4" />}
          label="Color Theme"
          description="Color palette for the blobs"
        >
          <div className="flex items-center gap-2">
            {colorThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setLiquid({ colorTheme: theme.id })}
                className={cn(
                  "w-7 h-7 rounded-full bg-gradient-to-br transition-all duration-200 border-2",
                  theme.gradient,
                  liquid.colorTheme === theme.id
                    ? "border-white scale-110 shadow-lg shadow-white/20"
                    : "border-white/10 hover:border-white/30"
                )}
                title={theme.label}
              />
            ))}
          </div>
        </SettingRow>

        <SettingRow
          icon={liquid.grain ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          label="Film Grain"
          description="Add subtle grain texture"
        >
          <Switch checked={liquid.grain} onCheckedChange={(v) => setLiquid({ grain: v })} />
        </SettingRow>

        <SettingRow
          icon={liquid.vignette ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          label="Vignette"
          description="Darken edges for depth"
        >
          <Switch checked={liquid.vignette} onCheckedChange={(v) => setLiquid({ vignette: v })} />
        </SettingRow>

        <SettingRow
          icon={liquid.audioReactive ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          label="Audio Reactivity"
          description="Blobs respond to microphone input"
        >
          <Switch checked={liquid.audioReactive} onCheckedChange={(v) => setLiquid({ audioReactive: v })} />
        </SettingRow>

        <SettingRow
          icon={liquid.mouseReactive ? <Mouse className="w-4 h-4" /> : <Mouse className="w-4 h-4 opacity-40" />}
          label="Mouse Interaction"
          description="Blobs react to cursor position"
        >
          <Switch checked={liquid.mouseReactive} onCheckedChange={(v) => setLiquid({ mouseReactive: v })} />
        </SettingRow>

        <div className="px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetLiquid}
            className="text-white/50 hover:text-white/80 hover:bg-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      <Separator className="bg-white/10 my-2" />

      {/* Appearance */}
      <SectionTitle>Appearance</SectionTitle>
      <div className="space-y-1">
        <SettingRow
          label="Theme"
          description="System color scheme"
        >
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {([
              { id: "dark" as const, icon: Moon, label: "Dark" },
              { id: "light" as const, icon: Sun, label: "Light" },
              { id: "auto" as const, icon: SunMoon, label: "Auto" },
            ]).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setApp({ theme: id })}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all",
                  settings.theme === id
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/40 hover:text-white/70"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </SettingRow>
      </div>

      <Separator className="bg-white/10 my-2" />

      {/* Sound */}
      <SectionTitle>Sound</SectionTitle>
      <div className="space-y-1">
        <SettingRow
          icon={settings.soundEffects ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          label="Sound Effects"
          description="Interface sounds on interactions"
        >
          <Switch checked={settings.soundEffects} onCheckedChange={(v) => setApp({ soundEffects: v })} />
        </SettingRow>
      </div>

      <Separator className="bg-white/10 my-2" />

      {/* Notifications */}
      <SectionTitle>Notifications</SectionTitle>
      <div className="space-y-1">
        <SettingRow
          icon={settings.notifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          label="Push Notifications"
          description="Receive updates about the app"
        >
          <Switch checked={settings.notifications} onCheckedChange={(v) => setApp({ notifications: v })} />
        </SettingRow>
      </div>

      <Separator className="bg-white/10 my-2" />

      {/* Accessibility */}
      <SectionTitle>Accessibility</SectionTitle>
      <div className="space-y-1">
        <SettingRow
          icon={<SlidersHorizontal className="w-4 h-4" />}
          label="Reduced Motion"
          description="Minimize animation effects"
        >
          <Switch checked={settings.reducedMotion} onCheckedChange={(v) => setApp({ reducedMotion: v })} />
        </SettingRow>
      </div>

      <Separator className="bg-white/10 my-2" />

      {/* Language */}
      <SectionTitle>Language</SectionTitle>
      <div className="space-y-1">
        <SettingRow
          label="Display Language"
          description="Interface language"
        >
          <Select value={settings.language} onValueChange={(v) => setApp({ language: v })}>
            <SelectTrigger className="w-36 bg-white/5 border-white/10 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0615] border-white/10">
              <SelectItem value="en" className="text-white">English</SelectItem>
              <SelectItem value="es" className="text-white">Español</SelectItem>
              <SelectItem value="fr" className="text-white">Français</SelectItem>
              <SelectItem value="de" className="text-white">Deutsch</SelectItem>
              <SelectItem value="ja" className="text-white">日本語</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
      </div>

      <Separator className="bg-white/10 my-2" />

      {/* Profile Preview */}
      <SectionTitle>Profile</SectionTitle>
      <div className="space-y-1">
        <SettingRow
          label="Your Profile"
          description="Manage your account information"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
              JD
            </div>
            <div className="text-xs text-right">
              <div className="text-white/90 font-medium">John Doe</div>
              <div className="text-white/40">john@example.com</div>
            </div>
          </div>
        </SettingRow>
      </div>

      <Separator className="bg-white/10 my-2" />

      {/* Version */}
      <div className="px-4 py-3 text-center">
        <div className="text-xs text-white/30">Liquid Ambient v1.0.0</div>
        <div className="text-[10px] text-white/20 mt-1">Built with WebGL & React</div>
      </div>
    </div>
  );
}
