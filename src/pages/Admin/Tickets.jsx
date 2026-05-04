import { useState, useEffect, useCallback } from "react";
import { SkeletonCard } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";
import notify from "../../lib/notify.js";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    avgResponse: "—",
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [pagination, setPagination] = useState({});

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: "support",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch tickets with filter
  const fetchTickets = useCallback(
    async (currentPage = 1) => {
      setLoading(true);
      try {
        let url = `/admin/tickets?page=${currentPage}&limit=${pageSize}`;
        if (filter !== "all") {
          url += `&status=${filter}`;
        }

        const data = await api.get(url);
        const list = data.tickets ?? data.data ?? [];

        setTickets(
          list.map((t) => ({
            id: t._id ?? t.id,
            ticketId:
              t.ticketId ??
              t._id?.substring(0, 8) ??
              `#${t.id?.substring(0, 8) ?? ""}`,
            subject: t.subject ?? "—",
            description: t.description ?? "",
            customer: t.customer?.name ?? t.customerName ?? "—",
            customerId: t.customer?._id ?? t.customerId,
            priority: t.priority ?? "medium",
            status: t.status ?? "open",
            messages: t.messages ?? [],
            createdAt: t.createdAt ?? new Date().toISOString(),
            updatedAt: t.updatedAt ?? new Date().toISOString(),
          })),
        );

        setPagination(
          data.pagination ?? { page: currentPage, total: list.length },
        );

        // Calculate stats
        setStats({
          total: data.pagination?.total ?? list.length,
          open: list.filter((t) => t.status === "open").length,
          inProgress: list.filter((t) => t.status === "in_progress").length,
          resolved: list.filter((t) => t.status === "resolved").length,
          avgResponse: data.avgResponse ?? "—",
        });
      } catch (err) {
        notify.error(err?.message || "Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    },
    [filter, pageSize],
  );

  useEffect(() => {
    (async () => {
      await fetchTickets(1);
    })();
  }, [filter, fetchTickets]);

  // Create ticket
  async function handleSubmitForm(e) {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.subject.trim()) {
      notify.error("Please enter a subject.");
      setSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      notify.error("Please enter a description.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        category: formData.category,
      };

      await api.post("/admin/tickets", payload);
      notify.success("Ticket created successfully.");

      setFormData({
        subject: "",
        description: "",
        priority: "medium",
        category: "support",
      });
      setShowModal(false);
      await fetchTickets(1);
    } catch (err) {
      notify.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create ticket",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // View ticket details
  function handleViewDetails(ticket) {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  }

  // Add message to ticket
  async function handleSendMessage(e) {
    e.preventDefault();
    if (!messageText.trim()) {
      notify.error("Please enter a message.");
      return;
    }

    setSendingMessage(true);
    try {
      await api.post(`/admin/tickets/${selectedTicket.id}/message`, {
        message: messageText.trim(),
      });

      notify.success("Message added successfully.");
      setMessageText("");

      // Refresh ticket details
      try {
        const data = await api.get(`/admin/tickets/${selectedTicket.id}`);
        const ticket = data.ticket ?? data.data ?? {};
        setSelectedTicket((prev) => ({
          ...prev,
          messages: ticket.messages ?? [],
        }));
      } catch (err) {
        console.error("Failed to refresh ticket:", err);
      }
    } catch (err) {
      notify.error(err?.message || "Failed to add message");
    } finally {
      setSendingMessage(false);
    }
  }

  // Update ticket status
  async function handleUpdateStatus(ticketId, newStatus) {
    try {
      await api.patch(`/admin/tickets/${ticketId}`, { status: newStatus });
      notify.success(`Ticket status updated to ${newStatus}.`);

      // Update local state
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)),
      );

      if (selectedTicket?.id === ticketId) {
        setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
      }

      // Recalculate stats
      await fetchTickets(page);
    } catch (err) {
      notify.error(err?.message || "Failed to update status");
    }
  }

  function formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Support Tickets
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Track and manage customer support requests.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2 w-fit"
        >
          <span className="material-symbols-outlined text-sm">add</span> Create
          Ticket
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Total Tickets
            </p>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {stats.total}
            </p>
          </div>
          <div className="text-4xl text-secondary-container">
            <span className="material-symbols-outlined text-4xl">
              assignment
            </span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Open
            </p>
            <p className="text-2xl font-bold text-error mt-1">{stats.open}</p>
          </div>
          <div className="text-4xl text-error/20">
            <span className="material-symbols-outlined text-4xl">
              circle_notifications
            </span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Resolved
            </p>
            <p className="text-2xl font-bold text-success mt-1">
              {stats.resolved}
            </p>
          </div>
          <div className="text-4xl text-success/20">
            <span className="material-symbols-outlined text-4xl">
              check_circle
            </span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Avg Response
            </p>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {stats.avgResponse}
            </p>
          </div>
          <div className="text-4xl text-secondary/20">
            <span className="material-symbols-outlined text-4xl">schedule</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: "all", label: "All" },
          { key: "open", label: "Open" },
          { key: "in_progress", label: "In Progress" },
          { key: "resolved", label: "Resolved" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setPage(1);
              setFilter(tab.key);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              filter === tab.key
                ? "bg-secondary text-white shadow-md"
                : "bg-white/30 text-on-surface-variant hover:bg-white/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tickets Table */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          No tickets found
        </div>
      ) : (
        <>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/50 border-b border-outline-variant/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Ticket ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-outline-variant/20 hover:bg-white/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-secondary-container">
                        {ticket.ticketId}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-on-surface">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {ticket.customer}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            ticket.priority === "high"
                              ? "bg-error/20 text-error"
                              : ticket.priority === "medium"
                                ? "bg-warning/20 text-warning"
                                : "bg-success/20 text-success"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            ticket.status === "open"
                              ? "bg-error/20 text-error"
                              : ticket.status === "in_progress"
                                ? "bg-warning/20 text-warning"
                                : "bg-success/20 text-success"
                          }`}
                        >
                          {ticket.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewDetails(ticket)}
                          className="text-secondary hover:text-secondary-container font-medium text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-sm text-on-surface-variant">
            <span>
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, pagination.total ?? 0)} of{" "}
              {pagination.total ?? 0} tickets
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (page > 1) {
                    setPage(page - 1);
                    fetchTickets(page - 1);
                  }
                }}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg border border-outline-variant/60 text-on-surface disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (page < (pagination.totalPages ?? 1)) {
                    setPage(page + 1);
                    fetchTickets(page + 1);
                  }
                }}
                disabled={page >= (pagination.totalPages ?? 1)}
                className="px-3 py-2 rounded-lg border border-outline-variant/60 text-on-surface disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={handleSubmitForm}
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-outline-variant/30 bg-linear-to-r from-secondary-fixed to-white flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-on-surface text-lg">
                  Create Support Ticket
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Required fields are marked with *.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="h-9 w-9 rounded-full hover:bg-black/5 flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  placeholder="e.g., Issue with last order"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the issue in detail..."
                  rows="4"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                >
                  <option value="support">Support</option>
                  <option value="billing">Billing</option>
                  <option value="delivery">Delivery</option>
                  <option value="quality">Quality</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/30 bg-white/50">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg text-white font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">
                      progress_activity
                    </span>
                    Creating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">
                      add
                    </span>
                    Create Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showDetailsModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-outline-variant/30 bg-linear-to-r from-secondary-fixed to-white flex items-center justify-between sticky top-0">
              <div>
                <h3 className="font-semibold text-on-surface text-lg">
                  Ticket Details
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  ID: {selectedTicket.ticketId}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="h-9 w-9 rounded-full hover:bg-black/5 flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Ticket Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase">
                      Subject
                    </p>
                    <p className="text-on-surface font-medium mt-1">
                      {selectedTicket.subject}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase">
                      Priority
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mt-1 ${
                        selectedTicket.priority === "high"
                          ? "bg-error/20 text-error"
                          : selectedTicket.priority === "medium"
                            ? "bg-warning/20 text-warning"
                            : "bg-success/20 text-success"
                      }`}
                    >
                      {selectedTicket.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase">
                    Description
                  </p>
                  <p className="text-on-surface mt-1">
                    {selectedTicket.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase">
                      Customer
                    </p>
                    <p className="text-on-surface font-medium mt-1">
                      {selectedTicket.customer}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase">
                      Created
                    </p>
                    <p className="text-on-surface-variant text-sm mt-1">
                      {formatDate(selectedTicket.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase mb-2">
                    Status
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {["open", "in_progress", "resolved"].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          handleUpdateStatus(selectedTicket.id, status)
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTicket.status === status
                            ? "bg-secondary text-white shadow-md"
                            : "bg-white/30 text-on-surface-variant hover:bg-white/50"
                        }`}
                      >
                        {status.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="border-t border-outline-variant/30 pt-6">
                <h4 className="font-semibold text-on-surface mb-4">
                  Messages ({selectedTicket.messages?.length ?? 0})
                </h4>

                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {selectedTicket.messages &&
                  selectedTicket.messages.length > 0 ? (
                    selectedTicket.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-white/50 border border-outline-variant/30"
                      >
                        <p className="text-xs font-bold text-on-surface-variant">
                          {msg.sender?.name ?? msg.senderName ?? "Support Team"}
                        </p>
                        <p className="text-sm text-on-surface mt-1">
                          {msg.message ?? msg.text}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-2">
                          {formatDate(msg.createdAt ?? msg.timestamp)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-on-surface-variant italic">
                      No messages yet
                    </p>
                  )}
                </div>

                {/* Add Message */}
                <form onSubmit={handleSendMessage} className="space-y-2">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Add a message..."
                    rows="3"
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none text-sm"
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !messageText.trim()}
                    className="w-full px-4 py-2.5 rounded-lg text-white font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {sendingMessage ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-sm">
                          progress_activity
                        </span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">
                          send
                        </span>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
