import { useState } from "react";

const timeSlots = [
  { label: "08:00 AM - 10:00 AM", available: true },
  { label: "10:00 AM - 12:00 PM", available: true },
  { label: "02:00 PM - 04:00 PM", available: true },
  { label: "04:00 PM - 06:00 PM", available: false },
];

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
const calendarDays = [
  { day: 29, current: false }, { day: 30, current: false },
  { day: 1, current: true }, { day: 2, current: true },
  { day: 3, current: true }, { day: 4, current: true },
  { day: 5, current: true }, { day: 6, current: true },
  { day: 7, current: true }, { day: 8, current: true },
  { day: 9, current: true }, { day: 10, current: true },
  { day: 11, current: true }, { day: 12, current: true },
];

export default function SchedulePickup() {
  const [selectedDate, setSelectedDate] = useState(4);
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [selectedServices, setSelectedServices] = useState({ washFold: true, dryCleaning: false });

  const toggleService = (key) => {
    setSelectedServices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <header className="mb-stack-lg text-center md:text-left mt-8 md:mt-0">
        <p className="font-label-md text-label-md text-secondary mb-2 uppercase tracking-widest">Step 2 of 3</p>
        <h1 className="font-display-lg text-display-lg text-primary">Schedule Pickup</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
          When and where should we collect your items?
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter pb-stack-lg flex-grow">
        {/* Left Column: Location & Services */}
        <div className="lg:col-span-7 flex flex-col gap-stack-md">
          {/* Location Card */}
          <section className="glass-card rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #0f8d65, #25c48f)" }}>
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm">Pickup Address</h2>
            </div>
            <div className="flex flex-col gap-4">
              <input
                className="glass-input font-body-md text-body-md w-full rounded-lg px-4 py-3"
                placeholder="Street Address"
                type="text"
                defaultValue="123 Ocean View Drive, Apt 4B"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="glass-input font-body-md text-body-md w-full rounded-lg px-4 py-3"
                  placeholder="City"
                  type="text"
                  defaultValue="San Francisco"
                />
                <input
                  className="glass-input font-body-md text-body-md w-full rounded-lg px-4 py-3"
                  placeholder="ZIP Code"
                  type="text"
                  defaultValue="94105"
                />
              </div>
              <textarea
                className="glass-input font-body-md text-body-md w-full resize-none h-24 mt-2 rounded-lg px-4 py-3"
                placeholder="Delivery Instructions (Optional, e.g., 'Leave with doorman')"
              />
            </div>
          </section>

          {/* Services Selection */}
          <section className="glass-card rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #0f8d65, #25c48f)" }}>
                <span className="material-symbols-outlined">dry_cleaning</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm">Select Services</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Wash & Fold */}
              <label className="relative flex cursor-pointer group" onClick={() => toggleService("washFold")}>
                <div className={`w-full p-4 rounded-xl transition-all duration-300 ${
                  selectedServices.washFold
                    ? "border-2 border-secondary bg-secondary/5"
                    : "border border-outline-variant/30 bg-white/20 hover:bg-white/40"
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="material-symbols-outlined text-secondary">local_laundry_service</span>
                    <span className="font-label-sm text-label-sm text-secondary px-2 py-1 rounded-full"
                      style={{ background: "rgba(138, 240, 205, 0.3)" }}>Popular</span>
                  </div>
                  <h3 className="font-label-md text-label-md mb-1 text-primary">Wash & Fold</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">Everyday garments, perfectly folded.</p>
                </div>
              </label>

              {/* Dry Cleaning */}
              <label className="relative flex cursor-pointer group" onClick={() => toggleService("dryCleaning")}>
                <div className={`w-full p-4 rounded-xl transition-all duration-300 ${
                  selectedServices.dryCleaning
                    ? "border-2 border-secondary bg-secondary/5"
                    : "border border-outline-variant/30 bg-white/20 hover:bg-white/40"
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="material-symbols-outlined text-on-surface-variant">iron</span>
                  </div>
                  <h3 className="font-label-md text-label-md mb-1 text-primary">Dry Cleaning</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">Delicate items requiring special care.</p>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Calendar & Time */}
        <div className="lg:col-span-5 flex flex-col gap-stack-md">
          <section className="glass-card rounded-2xl p-6 md:p-8 flex-grow flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #0f8d65, #25c48f)" }}>
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm">Schedule Time</h2>
            </div>

            {/* Calendar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <button className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="font-label-md text-label-md">April 2026</span>
                <button className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center font-label-sm text-label-sm text-on-surface-variant mb-2">
                {daysOfWeek.map((d, i) => (
                  <div key={i}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center font-body-md text-body-md">
                {calendarDays.map((d, i) => (
                  <div
                    key={i}
                    onClick={() => d.current && setSelectedDate(d.day)}
                    className={`p-2 rounded-full cursor-pointer transition-all duration-200 ${
                      !d.current
                        ? "text-on-surface-variant/30 cursor-default"
                        : d.day === selectedDate
                        ? "text-white shadow-[0_0_15px_rgba(37,196,143,0.4)]"
                        : "hover:bg-white/40"
                    }`}
                    style={d.day === selectedDate && d.current ? { background: "linear-gradient(135deg, #0f8d65, #25c48f)" } : {}}
                  >
                    {d.day}
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="mt-auto">
              <h3 className="font-label-md text-label-md mb-3 text-on-surface-variant">Available Windows</h3>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(idx)}
                    className={`py-3 px-4 rounded-lg font-body-md text-body-md text-sm transition-all duration-200 ${
                      !slot.available
                        ? "border border-outline-variant/20 bg-white/10 text-on-surface-variant/40 cursor-not-allowed"
                        : idx === selectedSlot
                        ? "border-2 border-secondary bg-secondary/5 text-primary"
                        : "border border-outline-variant/30 bg-white/20 hover:bg-white/40"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-4 flex justify-end">
            <button className="cta-gradient text-white w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-label-md text-label-md hover:scale-[1.02] transition-transform duration-300">
              Continue to Payment
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
