import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, TrendingUp, Loader2, BadgeCheck } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsData {
  reviews: Review[];
  average: number;
  total: number;
  distribution: Record<string, number>;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-125"
          style={{ color: i <= (hovered || value) ? "#f59e0b" : "rgba(255,255,255,0.15)" }}
        >
          <Star className="w-6 h-6" fill={i <= (hovered || value) ? "#f59e0b" : "none"} />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-white/50">{value}/5</span>
      )}
    </div>
  );
}

function RatingBar({ label, pct, count }: { label: string; pct: number; count: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/40 w-10 text-right">{label}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, var(--c-primary), var(--c-primary-2))" }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
      <span className="text-[10px] text-white/25 w-4">{count}</span>
    </div>
  );
}

function ReviewCard({ review, i }: { review: Review; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: i * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="glass rounded-2xl p-5 flex flex-col gap-3"
    >
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(s => (
          <Star key={s} className="w-3 h-3" fill={s <= review.rating ? "#f59e0b" : "none"} style={{ color: s <= review.rating ? "#f59e0b" : "rgba(255,255,255,0.1)" }} />
        ))}
        <span className="ml-1 text-[10px] text-white/30">{review.rating}/5</span>
      </div>
      {review.comment && (
        <p className="text-sm text-white/55 leading-relaxed italic">"{review.comment}"</p>
      )}
      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--c-glow-soft)", border: "1px solid var(--c-border)" }}>
          <BadgeCheck className="w-3 h-3" style={{ color: "var(--c-primary)" }} />
        </div>
        <span className="text-[10px] text-white/25">
          Verified · {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </span>
      </div>
    </motion.div>
  );
}

export function ReviewsSection() {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) setData(await res.json());
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const submit = async () => {
    if (rating === 0) { setError("Please select a star rating."); return; }
    setSubmitting(true); setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });
      if (!res.ok) { setError("Could not submit. Try again."); return; }
      setSubmitted(true);
      setRating(0); setComment("");
      await fetchReviews();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setSubmitting(false);
    }
  };

  const avg = data?.average ?? 0;
  const total = data?.total ?? 0;
  const dist = data?.distribution ?? {};

  return (
    <section className="py-28 border-t border-white/5 section-glow relative overflow-hidden" id="reviews" style={{ zIndex: 2 }}>
      <div
        className="absolute top-8 right-8 select-none pointer-events-none font-display font-bold leading-none"
        style={{ fontSize: "clamp(6rem,15vw,12rem)", color: "rgba(255,255,255,0.025)" }}
        aria-hidden="true"
      >
        07
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-xl mb-14">
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4">
            Community Reviews
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">
            Rate the work.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-base text-white/40 leading-relaxed">
            Leave an honest rating after your commission. No account needed — just stars and your words.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: aggregate */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="glass-bright rounded-2xl p-6 flex flex-col gap-6">

            {/* Big average */}
            <div className="text-center">
              <motion.p
                className="font-display font-bold leading-none"
                style={{ fontSize: "5rem", background: "linear-gradient(135deg, #ffffff 0%, var(--c-primary-2) 50%, var(--c-primary) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                initial={{ scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              >
                {avg > 0 ? avg.toFixed(1) : "—"}
              </motion.p>
              <div className="flex justify-center gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-4 h-4" fill={s <= Math.round(avg) ? "#f59e0b" : "none"} style={{ color: s <= Math.round(avg) ? "#f59e0b" : "rgba(255,255,255,0.1)" }} />
                ))}
              </div>
              <p className="text-xs text-white/30 mt-2">{total} {total === 1 ? "review" : "reviews"}</p>
            </div>

            {/* Distribution bars */}
            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map(s => {
                const cnt = dist[s] ?? 0;
                const pct = total > 0 ? (cnt / total) * 100 : 0;
                return <RatingBar key={s} label={`${s}★`} pct={pct} count={cnt} />;
              })}
            </div>

            {/* Trend */}
            <div className="flex items-center gap-2 text-xs text-white/30 pt-2 border-t border-white/5">
              <TrendingUp className="w-3.5 h-3.5" style={{ color: "var(--c-primary)" }} />
              All reviews are from real commission clients
            </div>
          </motion.div>

          {/* Middle: leave a review */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="glass rounded-2xl p-6 flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--c-primary)" }}>Leave a Review</p>
              <h3 className="text-lg font-bold text-white">How was your experience?</h3>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.6 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)" }}
                  >
                    <BadgeCheck className="w-7 h-7 text-green-400" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-white font-semibold">Thanks for the review!</p>
                    <p className="text-xs text-white/35 mt-1">Your rating is now live.</p>
                  </div>
                  <button onClick={() => setSubmitted(false)} className="text-xs text-white/25 hover:text-white/50 transition-colors mt-2">
                    Leave another review
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 flex-1">
                  <div>
                    <label className="block text-xs text-white/30 mb-3 font-medium">Your rating</label>
                    <StarPicker value={rating} onChange={setRating} />
                  </div>
                  <div>
                    <label className="block text-xs text-white/30 mb-2 font-medium">Comment <span className="text-white/20">(optional)</span></label>
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Share your experience..."
                      rows={4}
                      maxLength={300}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none resize-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", lineHeight: 1.6 }}
                    />
                    <p className="text-[9px] text-white/15 mt-1 text-right">{comment.length}/300</p>
                  </div>
                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <button
                    onClick={submit}
                    disabled={submitting || rating === 0}
                    className="h-11 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all btn-primary disabled:opacity-40 mt-auto"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? "Submitting..." : "Submit review"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: recent reviews */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col gap-4 max-h-[520px] overflow-y-auto pr-1"
            style={{ scrollbarWidth: "none" }}>
            {loading && (
              <div className="flex justify-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-white/30" />
              </div>
            )}
            {!loading && (!data || data.reviews.length === 0) && (
              <div className="glass rounded-2xl p-8 text-center flex flex-col items-center gap-3">
                <Star className="w-8 h-8 text-white/10" />
                <p className="text-sm text-white/30">No reviews yet. Be the first!</p>
              </div>
            )}
            {data?.reviews.map((r, i) => (
              <ReviewCard key={r.id} review={r} i={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
