import { useTheme } from "./ThemeContext";

export function SoftBackground() {
  const { theme } = useTheme();
  return (
    <div className="soft-background" aria-hidden="true" data-soft-theme={theme}>
      <div className="soft-background__wash soft-background__wash--one" />
      <div className="soft-background__wash soft-background__wash--two" />
      <div className="soft-background__grid" />
      <div className="soft-background__grain" />
    </div>
  );
}