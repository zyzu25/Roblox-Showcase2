import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

const STORAGE_KEY = "portfolio-view-count";
const SESSION_KEY = "portfolio-view-counted";
const BASE_COUNT  = 568;

export function ViewCounter() {
  const [count, setCount] = useState<number>(BASE_COUNT);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const current = stored ? parseInt(stored, 10) : BASE_COUNT;

    const alreadyCounted = sessionStorage.getItem(SESSION_KEY);
    if (!alreadyCounted) {
      const next = current + 1;
      localStorage.setItem(STORAGE_KEY, String(next));
      sessionStorage.setItem(SESSION_KEY, "1");
      setCount(next);
    } else {
      setCount(current);
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
