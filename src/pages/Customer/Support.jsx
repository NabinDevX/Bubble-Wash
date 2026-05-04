import { useEffect, useState } from "react";
import api from "../../lib/api";
import notify from "../../lib/notify.js";

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    orderId: "",
    category: "",
    subject: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // LOAD TICKETS
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/tickets/my-tickets");

        const list = res?.tickets || res?.data || [];

        setTickets(list);
      } catch (err) {
        console.error(err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // SUBMIT
  async function handleSubmit() {
    if (!form.subject || !form.description) {
      notify.error("Please fill all fields");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        subject: form.subject,
        message: form.description,
        category: form.category.toUpperCase(),
        priority: "LOW",
      };

      if (form.orderId) {
        payload.orderId = form.orderId;
      }

      console.log("FINAL PAYLOAD:", payload);

      await api.post("/tickets", payload);

      notify.success("Ticket submitted successfully!");

      setForm({
        orderId: "",
        category: "billing",
        subject: "",
        description: "",
      });
    } catch (err) {
      console.error("FULL ERROR:", err.response?.data);
      notify.error("Ticket submission failed. Please try again later.");
      console.error("Ticket API error:", err.response?.data);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Support & Tickets
        </h1>
        <p className="text-gray-500">
          Manage your inquiries and get assistance with your laundry orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-7 space-y-6">
          {/* RECENT TICKETS */}
          <div className="bg-[#f8fafc] rounded-2xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-gray-600">
                description
              </span>
              <h2 className="font-semibold text-gray-800">Recent Tickets</h2>
            </div>

            {/* HEADER ROW */}
            <div className="grid grid-cols-4 text-sm text-gray-500 font-medium mb-3">
              <span>ID</span>
              <span>Subject</span>
              <span>Status</span>
              <span>Date</span>
            </div>

            {/* DATA */}
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : (
                tickets.map((t) => {
                  const status = (t.status || "open").toLowerCase();

                  const badge = {
                    pending: "bg-yellow-100 text-yellow-700",
                    resolved: "bg-green-100 text-green-700",
                    open: "bg-cyan-100 text-cyan-700",
                  }[status];

                  return (
                    <div
                      key={t._id}
                      className="grid grid-cols-4 items-center text-sm"
                    >
                      <span className="text-gray-500">
                        #BW-{t._id.slice(-4)}
                      </span>

                      <span className="font-medium text-gray-800">
                        {t.subject}
                      </span>

                      <span
                        className={`px-2 py-1 rounded-full text-xs w-fit ${badge}`}
                      >
                        {status}
                      </span>

                      <span className="text-gray-500">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* IMAGE CARD */}
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1696546760882-1d34a7af6800?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="w-full h-52 object-cover"
            />

            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-sm italic">
              “Every thread deserves precision care. We're here to ensure your
              experience is as seamless as our service.”
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 space-y-6">
          {/* CARD */}
          <div className="bg-[#f5f7f9] rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* TOP ACCENT LINE */}
            <div className="h-1 bg-gradient-to-r from-teal-400 to-cyan-400"></div>

            <div className="p-6 space-y-5">
              {/* TITLE */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Raise a New Ticket
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Our typical response time is under 2 hours.
                </p>
              </div>

              {/* CATEGORY */}
              <div className="space-y-1">
                <label className="text-sm text-gray-500">
                  Category <span className="text-xs">(Optional)</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-gray-300 focus:border-gray-500 outline-none py-2 text-gray-700"
                >
                  <option value="" disabled hidden>
                    Select category (optional)
                  </option>

                  <option value="billing">Billing</option>
                  <option value="pickup">Pickup Issue</option>
                  <option value="delivery">Delivery Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* SUBJECT */}
              <div className="space-y-1">
                <label className="text-sm text-gray-500">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="What is the issue about?"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-gray-300 focus:border-gray-500 outline-none py-2 text-gray-700"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1">
                <label className="text-sm text-gray-500">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Please provide as much detail as possible..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-gray-300 focus:border-gray-500 outline-none py-2 h-24 text-gray-700 resize-none"
                />
              </div>

              {/* OBJECT ID (MOVED TO END) */}
              <div className="space-y-1">
                <label className="text-sm text-gray-500">
                  Object ID <span className="text-xs">(Optional)</span>
                </label>
                <input
                  placeholder="#BW-0000"
                  value={form.orderId}
                  onChange={(e) =>
                    setForm({ ...form, orderId: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-gray-300 focus:border-gray-500 outline-none py-2 text-gray-700"
                />
              </div>

              {/* BUTTON */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-400 to-blue-500 hover:opacity-90"
                }`}
              >
                <span className="material-symbols-outlined text-sm">send</span>

                {submitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </div>

          {/* BOTTOM CARDS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f5f7f9] border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-gray-700">
              <span className="material-symbols-outlined text-green-500">
                verified_user
              </span>
              Secure Messaging
            </div>

            <div className="bg-[#f5f7f9] border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-gray-700">
              <span className="material-symbols-outlined text-green-500">
                schedule
              </span>
              24/7 Monitoring
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
