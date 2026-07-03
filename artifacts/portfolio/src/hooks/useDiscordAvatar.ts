import { useEffect, useState } from "react";

const FALLBACK = "/images/profile.jpg";
const CACHE_KEY = "mfx-discord-avatar";

export function useDiscordAvatar(): string {
  const [avatar, setAvatar] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) return cached;
    }
    return FALLBACK;
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/discord-status")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (data.available && data.avatar) {
          setAvatar(data.avatar);
          sessionStorage.setItem(CACHE_KEY, data.avatar);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return avatar;
}
