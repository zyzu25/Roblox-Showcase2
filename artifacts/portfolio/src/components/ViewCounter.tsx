import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

const SESSION_KEY = "portfolio-view-counted";
let sharedViewRequest: Promise<number> | null = null;

async function requestViewCount(): Promise<number> {
  if (sharedViewRequest) return sharedViewRequest;

  const alreadyCounted = sessionStorage.getItem(SESSION_KEY) === "1";
  if (!alreadyCounted) sessionStorage.setItem(SESSION_KEY, "pending");

  sharedViewRequest = fetch("/api/views", {
    method: alreadyCounted ? "GET" : "POST",
    cache: "no-store",
    headers: { Accept: "application/json" },
  })
    .then(response => {
      if (!response.ok) throw new Error(`View counter returned ${response.status}`);
      return response.json() as Promise<{ count?: unknown }>;
    })
    .then(data => {
      if (typeof data.count !== "number") throw new Error("View counter returned an invalid count");
      sessionStorage.setItem(SESSION_KEY, "1");
      return data.count;
    })
    .catch(error => {
      if (!alreadyCounted) sessionStorage.removeItem(SESSION_KEY);
      sharedViewRequest = null;
      throw error;
    });

  return sharedViewRequest;
}

export function ViewCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    requestViewCount()
      .then(nextCount => {
        if (cancelled) return;
        setCount(nextCount);
      })
      .catch(() => {
        if (!cancelled) setUnavailable(true);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-white/35"
      title={unavailable ? "View count unavailable" : "Portfolio views"}
      aria-label={unavailable ? "View count unavailable" : `Portfolio views: ${count ?? "loading"}`}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Eye className="w-3 h-3 opacity-60" />
      <span>{unavailable ? "—" : count === null ? "…" : count.toLocaleString()}</span>
    </div>
  );
}
