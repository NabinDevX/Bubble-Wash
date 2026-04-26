import { useState } from "react";

export default function FeedbackRating() {
  const [rating, setRating] = useState(4);
  const [hoveredStar, setHoveredStar] = useState(0);

  return (
    <div className="space-y-6 px-4 md:px-8 py-6 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-2xl text-center mb-4">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Thank You</h1>
        <p className="font-body-lg text-body-lg text-outline">
          Order Reference: <span className="font-semibold text-secondary">#BW-8924A</span>
        </p>
      </div>

      <div className="w-full max-w-2xl glass-card rounded-3xl p-8 flex flex-col gap-6 items-center">
        <div className="text-center w-full">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">How was your service?</h2>
          <p className="text-outline">Your feedback helps us maintain our premium standards.</p>
        </div>

        {/* 5-Star Rating */}
        <div className="flex gap-2 py-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= (hoveredStar || rating);
            return (
              <button
                key={star}
                type="button"
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                className="p-2 focus:outline-none transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
              >
                <span
                  className="material-symbols-outlined text-5xl transition-all duration-200"
                  style={{
                    fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                    color: active ? "#62fae3" : "#c6c6cd",
                  }}
                >
                  star
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback Textarea */}
        <div className="w-full">
          <label className="font-label-md text-label-md text-on-surface-variant block mb-2" htmlFor="feedback-details">
            Additional Details (Optional)
          </label>
          <textarea
            id="feedback-details"
            className="w-full bg-surface-container-lowest/50 border border-outline-variant/50 rounded-lg p-4 focus:ring-2 focus:ring-secondary-container focus:border-secondary-container text-on-surface placeholder-outline-variant transition-all duration-300 backdrop-blur-sm resize-none"
            placeholder="Tell us about your experience..."
            rows={4}
          />
        </div>

        {/* Submit */}
        <button className="w-full py-4 px-6 bg-gradient-to-r from-secondary to-secondary-fixed-dim text-white rounded-lg font-label-md text-label-md uppercase tracking-widest hover:shadow-[0_0_20px_rgba(98,250,227,0.4)] transition-all duration-300 transform hover:scale-[1.02]">
          Submit Feedback
        </button>
        <button className="font-label-md text-label-md text-outline hover:text-secondary transition-colors">
          Skip for now
        </button>
      </div>
    </div>
  );
}
