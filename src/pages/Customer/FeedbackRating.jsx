import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../lib/api.js";
import notify from "../../lib/notify.js";

export default function FeedbackRating() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || searchParams.get("id");

  const [rating, setRating] = useState(4);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");
    setSubmitting(true);

    try {
      if (!orderId) {
        setError("Invalid access. Please complete order first.");
        setSubmitting(false);
        return;
      }

      if (!rating) {
        setError("Please select a rating");
        setSubmitting(false);
        return;
      }

      const payload = {
        subject: "Service Feedback",
        description: comment || "No comment",
        orderId: orderId,
        rating: rating,
      };

      console.log("FEEDBACK PAYLOAD:", payload);

      await api.post("/tickets", payload);

      notify.success("Feedback submitted successfully");
      window.location.href = "/customer";
    } catch (err) {
      console.log("FEEDBACK ERROR:", err.response?.data || err.message);

      setError(
        err.response?.data?.message ||
          "Unable to submit feedback. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="space-y-6 px-4 md:px-8 py-6 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-2xl text-center mb-4">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
          Thank You
        </h1>
        <p className="font-body-lg text-body-lg text-outline">
          Order Reference:{" "}
          <span className="font-semibold text-secondary">{orderId ?? "—"}</span>
        </p>
      </div>

      <div className="w-full max-w-2xl glass-card rounded-3xl p-8 flex flex-col gap-6 items-center">
        <div className="text-center w-full">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">
            How was your service?
          </h2>
          <p className="text-outline">
            Your feedback helps us maintain our premium standards.
          </p>
        </div>

        {/* Stars */}
        <div className="flex gap-2 py-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= (hoveredStar || rating);
            return (
              <button
                key={star}
                type="button"
                className="p-2 transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
              >
                <span
                  className="material-symbols-outlined text-5xl"
                  style={{
                    fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                    color: active ? "#198754" : "#c6c6cd",
                  }}
                >
                  star
                </span>
              </button>
            );
          })}
        </div>

        {/* Comment */}
        <div className="w-full">
          <label className="block mb-2 text-on-surface-variant">
            Additional Details (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-lg p-4"
            rows={4}
          />
        </div>

        {/* Error */}
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 bg-secondary text-white rounded-lg"
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>

        <button className="text-outline">Skip for now</button>
      </div>
    </div>
  );
}
