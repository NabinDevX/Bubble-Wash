import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SkeletonTableRow } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";
import notify from "../../lib/notify.js";

export default function ServicesRateCard() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await api.get("/admin/services");
        const list = data.services ?? data.data ?? data ?? [];
        setServices(
          list.map((s) => ({
            id: s._id ?? s.id,
            name: s.name ?? "Unknown",
            category: s.category ?? "—",
            price: s.pricePerKg
              ? `₹${s.pricePerKg} / kg`
              : s.pricePerItem
                ? `₹${s.pricePerItem} / item`
                : s.price
                  ? `₹${s.price}`
                  : "—",
            status: s.isActive !== false ? "Active" : "Paused",
            popular: s.popular ?? false,
          })),
        );
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const categoryMap = {};
  services.forEach((s) => {
    const cat = s.category || "Other";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const categoryIcons = {
    Laundry: "local_laundry_service",
    "Dry Cleaning": "dry_cleaning",
    Ironing: "iron",
    Specialty: "auto_awesome",
    wash: "local_laundry_service",
    dry_clean: "dry_cleaning",
    wash_and_iron: "laundry",
    iron: "iron",
    premium: "dry_cleaning",
  };
  const categoryColors = {
    Laundry: "bg-blue-50 text-primary",
    "Dry Cleaning": "bg-cyan-50 text-secondary",
    Ironing: "bg-amber-50 text-amber-700",
    Specialty: "bg-purple-50 text-purple-700",
    wash: "bg-blue-50 text-primary",
    dry_clean: "bg-cyan-50 text-secondary",
    wash_and_iron: "bg-teal-50 text-teal-700",
    iron: "bg-amber-50 text-amber-700",
    premium: "bg-cyan-50 text-secondary",
  };
  const categories = Object.entries(categoryMap).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    icon: categoryIcons[name] ?? "category",
    count: `${count} service${count !== 1 ? "s" : ""}`,
    color: categoryColors[name] ?? "bg-blue-50 text-primary",
  }));

  function handleAddService() {
    navigate("/admin/services/new");
  }

  function handleExportRateCardPdf() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const generatedAt = new Date().toLocaleString();
    const tableRows = services.map((service) => [
      service.name,
      service.category,
      service.price.replace("₹", "INR "),
      service.status,
    ]);

    doc.setFontSize(18);
    doc.text("Bubble Wash - Rate Card & Services", 40, 48);
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`Generated: ${generatedAt}`, 40, 68);

    autoTable(doc, {
      startY: 84,
      head: [["Service", "Category", "Price", "Status"]],
      body: tableRows.length
        ? tableRows
        : [["No services available", "-", "-", "-"]],
      theme: "striped",
      headStyles: {
        fillColor: [13, 148, 136],
      },
      styles: {
        fontSize: 10,
        cellPadding: 8,
      },
    });

    doc.save("bubble-wash-rate-card.pdf");
  }

  async function handleDelete(serviceId) {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      await api.delete(`/admin/services/${serviceId}`);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
    } catch (err) {
      notify.error(err?.message || "Failed to delete service");
    }
  }

  async function handleToggle(serviceId) {
    try {
      await api.patch(`/admin/services/${serviceId}/toggle`);
      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? { ...s, status: s.status === "Active" ? "Paused" : "Active" }
            : s,
        ),
      );
    } catch (err) {
      notify.error(err?.message || "Failed to change status");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Rate Card & Services
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage service categories and detailed pricing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportRateCardPdf}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium hover:bg-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export
          </button>
          <button
            onClick={handleAddService}
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add</span> New
            Service
          </button>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div
              key={c.name}
              className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div
                className={`p-2.5 ${c.color} rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform`}
              >
                <span className="material-symbols-outlined">{c.icon}</span>
              </div>
              <h3 className="font-semibold text-on-surface">{c.name}</h3>
              <p className="text-xs text-on-surface-variant mt-1">{c.count}</p>
            </div>
          ))}
        </div>
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
          <h3 className="font-semibold text-on-surface">All Services</h3>
          <div className="flex gap-2">
            <button className="p-2 text-on-surface-variant hover:bg-white/40 rounded-lg transition-colors border border-outline-variant/50">
              <span className="material-symbols-outlined text-lg">
                filter_list
              </span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-white/40 rounded-lg transition-colors border border-outline-variant/50">
              <span className="material-symbols-outlined text-lg">search</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-on-surface-variant bg-white/20">
              <tr>
                {["Service", "Category", "Price", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 font-semibold text-xs uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <SkeletonTableRow columns={5} />
                  <SkeletonTableRow columns={5} />
                  <SkeletonTableRow columns={5} />
                  <SkeletonTableRow columns={5} />
                  <SkeletonTableRow columns={5} />
                </>
              ) : services.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-on-surface-variant"
                  >
                    No services found
                  </td>
                </tr>
              ) : (
                services.map((s) => (
                  <tr
                    key={s.id ?? s.name}
                    className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-on-surface">
                          {s.name}
                        </span>
                        {s.popular && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                            Popular
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-on-surface-variant">
                      {s.category}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-secondary">
                      {s.price}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${s.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/services/edit/${s.id}`);
                          }}
                          className="h-8 w-8 rounded-md border border-outline-variant/50 text-primary hover:bg-white/60 transition-colors flex items-center justify-center"
                          title="Edit service"
                          aria-label="Edit service"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(s.id);
                          }}
                          className="h-8 w-8 rounded-md border border-outline-variant/50 text-secondary hover:bg-white/60 transition-colors flex items-center justify-center"
                          title={
                            s.status === "Active"
                              ? "Pause service"
                              : "Activate service"
                          }
                          aria-label={
                            s.status === "Active"
                              ? "Pause service"
                              : "Activate service"
                          }
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {s.status === "Active"
                              ? "pause_circle"
                              : "play_circle"}
                          </span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(s.id);
                          }}
                          className="h-8 w-8 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center"
                          title="Delete service"
                          aria-label="Delete service"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
