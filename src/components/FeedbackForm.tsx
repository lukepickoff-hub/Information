import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function FeedbackForm({ topic }: { topic: string }) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, rating, comment }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full mt-12 p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-lg flex items-center justify-center gap-3 text-cyan-400">
        <CheckCircle2 className="w-5 h-5" />
        <span>Thank you for your feedback! It helps us improve the Quantum Teacher.</span>
      </div>
    );
  }

  return (
    <div className="w-full mt-12 p-6 bg-[#0c0c12] border border-white/5 rounded-lg font-sans">
      <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-500 mb-4">Rate this explanation</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-white/10 hover:text-white/30'}`}
            >
              ★
            </button>
          ))}
        </div>
        {error && <div className="text-red-400 text-xs">{error}</div>}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Any additional comments? (Optional)"
          className="w-full bg-black/40 border border-white/10 rounded-md p-3 text-sm text-white/90 placeholder:text-white/30 outline-none focus:border-cyan-500/50 resize-none h-24"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="self-end px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white/80 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Sumitting...' : 'Submit Feedback'}
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}
