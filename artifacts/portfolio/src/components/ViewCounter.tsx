import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

const SESSION_KEY = "portfolio-view-counted";
const BASE_COUNT  = 568;

export function ViewCounter() {
  const [count, setCount] = useState<number>(BASE_COUNT);

  useEffect(() => {
    const alreadyCounted = sessionStorage.getItem(SESSION_KEY);

    if (!alreadyCounted) {
      sessionStorage.setItem(SESSION_KEY, "1");
      fetch("/api/views", { method: "POST" })
        .then(r => r.json())
        .then(d => setCount(d.count))
        .catch(() => {});
    } else {
      fetch("/api/views")
        .then(r => r.json())
        .then(d => setCount(d.count))
        .catch(() => {});
    }
  }, []);

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-white/35"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Eye className="w-3 h-3 opacity-60" />
      <span>{count.toLocaleString()}</span>
    </div>
  );
}
