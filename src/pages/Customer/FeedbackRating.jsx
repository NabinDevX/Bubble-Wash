import { useState } from "react";

export default function FeedbackRating() {
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const displayRating = hoverRating || rating;

  if (submitted) {
    return (
      <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="glass-card rounded-2xl p-12 text-center max-w-lg w-full">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg, #0f8d65, #25c48f)" }}>
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Thank You!</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Your feedback has been submitted. We appreciate your input!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto flex flex-col items-center justify-center min-h-[60vh] mt-8 md:mt-0">
      {/* Header */}
      <div className="w-full max-w-2xl text-center mb-stack-lg">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-stack-sm">Thank You</h1>
        <p className="font-body-lg text-body-lg text-outline">
          Order Reference: <span className="font-semibold text-secondary">#BW-8924A</span>
        </p>
      </div>

      {/* Feedback Card */}
      <div className="w-full max-w-2xl glass-card rounded-2xl p-8 md:p-12 flex flex-col gap-stack-md items-center">
        <div className="text-center w-full">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-unit">How was your service?</h2>
          <p className="font-body-md text-body-md text-outline">Your feedback helps us maintain our premium standards.</p>
        </div>

        {/* 5-Star Rating */}
        <div className="flex gap-2 py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              className="p-2 focus:outline-none transition-transform duration-200 hover:scale-110"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <span
                className="material-symbols-outlined text-[48px] transition-all duration-200"
                style={{
                  fontVariationSettings: star <= displayRating ? "'FILL' 1" : "'FILL' 0",
                  color: star <= displayRating ? "#25c48f" : "#c6c6cd",
                }}
              >
                star
              </span>
            </button>
          ))}
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap gap-2 justify-center">
          {["Fast Delivery", "Great Quality", "Friendly Staff", "Good Packaging", "Value for Money"].map((tag) => (
            <button
              key={tag}
              className="px-4 py-2 rounded-full border border-outline-variant/30 bg-white/20 hover:bg-secondary/10 hover:border-secondary/30 font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-all duration-200"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Details Text Area */}
        <div className="w-full">
          <label
            className="font-label-md text-label-md text-on-surface-variant block mb-unit"
            htmlFor="feedback-details"
          >
            Additional Details (Optional)
          </label>
          <textarea
            className="glass-input w-full rounded-lg p-4 font-body-md text-body-md min-h-[120px] resize-none"
            id="feedback-details"
            placeholder="Tell us about your experience..."
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={() => setSubmitted(true)}
          className="w-full py-4 px-6 text-white rounded-lg font-label-md text-label-md uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.02]"
          style={{
            background: "linear-gradient(90deg, #0b5a49, #0f8d65, #25c48f)",
            boxShadow: "0 0 20px rgba(37,196,143,0.3)",
          }}
        >
          Submit Feedback
        </button>
        <button className="font-label-md text-label-md text-outline hover:text-secondary transition-colors">
          Skip for now
        </button>
      </div>
    </div>
  );
}
