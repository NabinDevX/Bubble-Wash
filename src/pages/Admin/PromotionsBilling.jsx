import { useEffect, useMemo, useState, useCallback } from "react";
import { SkeletonTableRow } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";
import notify from "../../lib/notify.js";

const topTabs = ["Coupon Management", "Subscription Plans"];
const modeFilters = ["All Modes", "Global", "App Only", "Web Only"];
const COUPON_PAGE_SIZE = 10;

const initialCouponForm = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "0",
  maxDiscountAmount: "0",
  usageLimit: "0",
  perUserLimit: "1",
  validFrom: "",
  validUntil: "",
};

const initialPlanForm = {
  name: "",
  price: "",
  validityDays: "30",
  benefits: "",
};

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(v) {
  const n = toNumber(v);
  return `₹${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function formatDate(v) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function toIsoDateStart(dateValue) {
  if (!dateValue) return null;
  return new Date(`${dateValue}T00:00:00.000Z`).toISOString();
}

function normalizeCoupon(raw) {
  const id = raw?.id ?? raw?._id ?? raw?.couponId;
  const code = raw?.code ?? raw?.couponCode ?? raw?.name ?? "—";
  const mode = raw?.mode ?? raw?.orderMode ?? raw?.platform ?? "Global";
  const startDate = formatDate(
    raw?.startDate ?? raw?.startsAt ?? raw?.validFrom,
  );
  const endDate = formatDate(
    raw?.endDate ?? raw?.endsAt ?? raw?.validUntil ?? raw?.validTo,
  );
  const minOrderValue =
    raw?.minOrderValue != null
      ? formatMoney(raw.minOrderValue)
      : raw?.minimumOrderAmount != null
        ? formatMoney(raw.minimumOrderAmount)
        : raw?.minOrderAmount != null
          ? formatMoney(raw.minOrderAmount)
          : raw?.minAmount != null
            ? formatMoney(raw.minAmount)
            : "—";

  const discountPercent =
    raw?.discountType === "percentage" && raw?.discountValue != null
      ? `${toNumber(raw.discountValue)}%`
      : raw?.discountPercent != null
        ? `${toNumber(raw.discountPercent)}%`
        : raw?.percentage != null
          ? `${toNumber(raw.percentage)}%`
          : raw?.percent != null
            ? `${toNumber(raw.percent)}%`
            : "--";

  const discountAmount =
    raw?.discountType === "fixed" && raw?.discountValue != null
      ? formatMoney(raw.discountValue)
      : raw?.discountAmount != null
        ? formatMoney(raw.discountAmount)
        : raw?.amount != null
          ? formatMoney(raw.amount)
          : "--";

  const status =
    raw?.status ??
    (raw?.isActive === false
      ? "Inactive"
      : raw?.isActive === true
        ? "Active"
        : "Active");

  const title = raw?.title ?? raw?.name ?? raw?.descriptionTitle ?? code;
  const description = raw?.description ?? raw?.details ?? "—";

  const createdBy = raw?.createdBy?.name ?? raw?.createdBy ?? "—";
  const lastModified = formatDate(
    raw?.updatedAt ?? raw?.lastModified ?? raw?.modifiedAt,
  );

  const totalUsageLimit = toNumber(
    raw?.totalUsageLimit ?? raw?.usageLimit ?? raw?.limit,
  );
  const currentUsage = toNumber(
    raw?.currentUsage ?? raw?.usedCount ?? raw?.usageCount,
  );
  const usagePerUser = toNumber(
    raw?.usagePerUser ?? raw?.perUserLimit ?? raw?.limitPerUser ?? 1,
  );

  const applicability = Array.isArray(raw?.applicability)
    ? raw.applicability
    : Array.isArray(raw?.rules)
      ? raw.rules
      : [];

  return {
    id: String(id ?? code),
    code: String(code),
    title: String(title),
    mode: String(mode),
    startDate,
    endDate,
    minOrderValue,
    discountPercent,
    discountAmount,
    status: String(status),
    description: String(description),
    createdBy: String(createdBy),
    lastModified,
    totalUsageLimit: totalUsageLimit || 0,
    currentUsage: currentUsage || 0,
    usagePerUser: usagePerUser || 1,
    applicability: Array.isArray(applicability)
      ? applicability
          .map((r) => {
            if (!r) return null;
            if (typeof r === "string") return { label: r, included: true };
            return {
              label: r.label ?? r.name ?? r.key ?? "—",
              included: r.included ?? r.enabled ?? r.allowed ?? true,
            };
          })
          .filter(Boolean)
      : [],
  };
}

function normalizePlan(raw) {
  const id = raw?.id ?? raw?._id ?? raw?.planId;
  const name = raw?.name ?? raw?.title ?? "—";
  const price =
    raw?.price != null
      ? formatMoney(raw.price)
      : raw?.amount != null
        ? formatMoney(raw.amount)
        : "—";
  const interval =
    raw?.interval ??
    raw?.billingCycle ??
    (raw?.validityDays != null ? `${raw.validityDays} days` : raw?.duration) ??
    "—";
  const status =
    raw?.status ??
    (raw?.isActive === false
      ? "Inactive"
      : raw?.isActive === true
        ? "Active"
        : "Active");

  return {
    id: String(id ?? name),
    name: String(name),
    price,
    interval: String(interval),
    status: String(status),
  };
}

function getModePillClasses(mode) {
  if (mode === "Global") {
    return "border border-secondary-container bg-secondary-container/30 text-on-secondary-container";
  }

  return "border border-outline-variant bg-surface-container-high text-on-surface";
}

export default function PromotionsBilling() {
  const [activeTab, setActiveTab] = useState("Coupon Management");
  const [activeModeFilter, setActiveModeFilter] = useState("All Modes");
  const [coupons, setCoupons] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [couponPage, setCouponPage] = useState(1);
  const [couponPagination, setCouponPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCoupons: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState(initialCouponForm);
  const [planForm, setPlanForm] = useState(initialPlanForm);
  const [submittingCoupon, setSubmittingCoupon] = useState(false);
  const [submittingPlan, setSubmittingPlan] = useState(false);

  const loadCoupons = useCallback(async (page = 1) => {
    setLoadingCoupons(true);
    try {
      const data = await api.get(
        `/admin/coupons?page=${page}&limit=${COUPON_PAGE_SIZE}`,
      );
      const list = data.coupons ?? data.items ?? data.data ?? data ?? [];
      const normalized = Array.isArray(list) ? list.map(normalizeCoupon) : [];
      const pagination = data.pagination ?? {};

      setCoupons(normalized);
      setCouponPagination({
        currentPage: toNumber(pagination.currentPage) || page,
        totalPages: toNumber(pagination.totalPages) || 1,
        totalCoupons: toNumber(
          pagination.totalCoupons ?? pagination.total ?? normalized.length,
        ),
        hasNext: Boolean(pagination.hasNext),
        hasPrev: Boolean(pagination.hasPrev),
      });
      setSelectedCouponId((prev) => {
        if (prev && normalized.some((c) => c.id === prev)) return prev;
        return normalized[0]?.id ?? null;
      });
    } catch {
      setCoupons([]);
      setSelectedCouponId(null);
      setCouponPagination({
        currentPage: 1,
        totalPages: 1,
        totalCoupons: 0,
        hasNext: false,
        hasPrev: false,
      });
    } finally {
      setLoadingCoupons(false);
    }
  }, []);

  async function loadPlans() {
    setLoadingPlans(true);
    try {
      const data = await api.get("/admin/subscriptions");
      const list =
        data.plans ??
        data.subscriptions ??
        data.items ??
        data.data ??
        data ??
        [];
      setPlans(Array.isArray(list) ? list.map(normalizePlan) : []);
    } catch {
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  }

  const loadPlansCallback = useCallback(() => loadPlans(), []);

  useEffect(() => {
    (async () => {
      await loadPlansCallback();
    })();
  }, [loadPlansCallback]);

  useEffect(() => {
    (async () => {
      await loadCoupons(couponPage);
    })();
  }, [couponPage, loadCoupons]);

  useEffect(() => {
    (async () => {
      const today = new Date();
      const yyyy = today.getUTCFullYear();
      const mm = String(today.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(today.getUTCDate()).padStart(2, "0");
      const todayDate = `${yyyy}-${mm}-${dd}`;
      setCouponForm((prev) => ({
        ...prev,
        validFrom: prev.validFrom || todayDate,
      }));
    })();
  }, []);

  const filteredCoupons = useMemo(() => {
    if (activeModeFilter === "All Modes") return coupons;
    return coupons.filter((c) => c.mode === activeModeFilter);
  }, [activeModeFilter, coupons]);

  const selectedCoupon = useMemo(() => {
    if (!filteredCoupons.length) return null;
    const found = filteredCoupons.find((c) => c.id === selectedCouponId);
    return found ?? filteredCoupons[0];
  }, [filteredCoupons, selectedCouponId]);

  const usagePercent = useMemo(() => {
    if (!selectedCoupon) return 0;
    if (!selectedCoupon.totalUsageLimit) return 0;
    return Math.min(
      100,
      Math.round(
        (selectedCoupon.currentUsage / selectedCoupon.totalUsageLimit) * 100,
      ),
    );
  }, [selectedCoupon]);

  const isCouponTab = activeTab === "Coupon Management";
  const totalEntries =
    activeModeFilter === "All Modes"
      ? couponPagination.totalCoupons
      : filteredCoupons.length;
  const showingStart =
    filteredCoupons.length === 0
      ? 0
      : activeModeFilter === "All Modes"
        ? (couponPagination.currentPage - 1) * COUPON_PAGE_SIZE + 1
        : 1;
  const showingEnd =
    filteredCoupons.length === 0
      ? 0
      : activeModeFilter === "All Modes"
        ? Math.min(
            couponPagination.totalCoupons,
            showingStart + filteredCoupons.length - 1,
          )
        : filteredCoupons.length;

  function openCreateModal() {
    if (isCouponTab) {
      setIsCouponModalOpen(true);
      return;
    }
    setIsPlanModalOpen(true);
  }

  function closeCouponModal() {
    setIsCouponModalOpen(false);
    setCouponForm((prev) => ({
      ...initialCouponForm,
      validFrom: prev.validFrom,
    }));
  }

  function closePlanModal() {
    setIsPlanModalOpen(false);
    setPlanForm(initialPlanForm);
  }

  async function handleCreateCoupon(event) {
    event.preventDefault();
    if (submittingCoupon) return;

    const code = couponForm.code.trim().toUpperCase();
    const discountValue = toNumber(couponForm.discountValue);
    const validFromIso = toIsoDateStart(couponForm.validFrom);
    const validUntilIso = toIsoDateStart(couponForm.validUntil);

    if (!code) {
      notify.error("Coupon code is required");
      return;
    }
    if (discountValue <= 0) {
      notify.error("Discount value must be greater than 0");
      return;
    }
    if (couponForm.discountType === "percentage" && discountValue > 100) {
      notify.error("Percentage discount cannot be greater than 100");
      return;
    }
    if (!validUntilIso) {
      notify.error("Valid until date is required");
      return;
    }

    setSubmittingCoupon(true);
    try {
      await api.post("/admin/coupons", {
        code,
        description: couponForm.description.trim(),
        discountType: couponForm.discountType,
        discountValue,
        minOrderAmount: toNumber(couponForm.minOrderAmount),
        maxDiscountAmount: toNumber(couponForm.maxDiscountAmount),
        usageLimit: toNumber(couponForm.usageLimit),
        perUserLimit: toNumber(couponForm.perUserLimit) || 1,
        validFrom: validFromIso,
        validUntil: validUntilIso,
        expiryDate: validUntilIso,
      });

      closeCouponModal();
      setCouponPage(1);
      await loadCoupons(1);
      notify.success("Coupon created successfully");
    } catch (err) {
      notify.error(err?.message || "Failed to create coupon");
    } finally {
      setSubmittingCoupon(false);
    }
  }

  async function handleCreatePlan(event) {
    event.preventDefault();
    if (submittingPlan) return;

    const name = planForm.name.trim();
    const price = toNumber(planForm.price);
    const validityDays = toNumber(planForm.validityDays);

    if (!name) {
      notify.error("Plan name is required");
      return;
    }
    if (price <= 0) {
      notify.error("Plan price must be greater than 0");
      return;
    }
    if (validityDays <= 0) {
      notify.error("Validity days must be greater than 0");
      return;
    }

    const benefits = planForm.benefits
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    setSubmittingPlan(true);
    try {
      await api.post("/admin/subscriptions", {
        name,
        price,
        validityDays,
        duration: validityDays,
        benefits,
      });

      closePlanModal();
      await loadPlans();
      setActiveTab("Subscription Plans");
      notify.success("Subscription plan created successfully");
    } catch (err) {
      notify.error(err?.message || "Failed to create subscription plan");
    } finally {
      setSubmittingPlan(false);
    }
  }

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-headline-md font-semibold tracking-headline-sm text-on-surface">
              Promotions &amp; Billing
            </h1>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Manage coupons, promotional rules, and subscription plans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded border border-secondary-container bg-surface-container-lowest px-6 text-label-md font-semibold uppercase tracking-wider text-secondary transition-colors hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-body-lg">
                download
              </span>
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-10 items-center gap-2 rounded bg-primary-container px-6 text-label-md font-semibold uppercase tracking-wider text-on-primary transition-colors hover:bg-primary"
            >
              <span className="material-symbols-outlined text-body-lg">
                add
              </span>
              <span>{isCouponTab ? "New Coupon" : "New Plan"}</span>
            </button>
          </div>
        </header>

        <div className="mb-1 flex border-b border-outline-variant">
          {topTabs.map((tab) => {
            const isActive = tab === activeTab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={
                  isActive
                    ? "border-b-2 border-primary-container bg-surface-container-lowest/50 px-6 py-3 text-label-md font-semibold uppercase tracking-wider text-primary"
                    : "px-6 py-3 text-label-md font-semibold uppercase tracking-wider text-outline transition-colors hover:text-on-surface"
                }
              >
                {tab}
              </button>
            );
          })}
        </div>

        {activeTab === "Coupon Management" ? (
          <div className="space-y-6">
            <section className="overflow-hidden rounded border border-outline-variant bg-surface-container-lowest shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-lowest px-4 py-3">
                <h2 className="text-headline-sm font-semibold text-on-surface">
                  Active Coupons
                </h2>

                <div className="relative">
                  <span className="material-symbols-outlined pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[16px] text-outline">
                    filter_list
                  </span>

                  <select
                    value={activeModeFilter}
                    onChange={(event) => {
                      setActiveModeFilter(event.target.value);
                      setSelectedCouponId(null);
                    }}
                    className="cursor-pointer appearance-none rounded border border-outline-variant bg-surface py-1.5 pl-8 pr-8 text-label-sm font-medium text-on-surface outline-none transition-colors focus:border-secondary-container"
                    aria-label="Filter coupons by order mode"
                  >
                    {modeFilters.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="custom-scroll overflow-x-auto">
                <table className="w-full min-w-5xl border-collapse text-left">
                  <thead className="border-b border-outline-variant bg-surface-container-low">
                    <tr>
                      <th className="p-3 text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                        Coupon ID
                      </th>
                      <th className="p-3 text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                        Coupon Code
                      </th>
                      <th className="p-3 text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                        Mode of Order
                      </th>
                      <th className="p-3 text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                        Start Date
                      </th>
                      <th className="p-3 text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                        End Date
                      </th>
                      <th className="p-3 text-right text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                        Min Order Value
                      </th>
                      <th className="p-3 text-right text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                        Disc %
                      </th>
                      <th className="p-3 text-right text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                        Disc Amount
                      </th>
                      <th className="p-3 text-center text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-body-md text-on-surface">
                    {loadingCoupons ? (
                      <>
                        <SkeletonTableRow columns={9} />
                        <SkeletonTableRow columns={9} />
                        <SkeletonTableRow columns={9} />
                        <SkeletonTableRow columns={9} />
                      </>
                    ) : filteredCoupons.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="p-8 text-center text-on-surface-variant"
                        >
                          No coupons found
                        </td>
                      </tr>
                    ) : (
                      filteredCoupons.map((coupon, index) => {
                        const isSelected = coupon.id === selectedCoupon?.id;
                        const isExpired = coupon.status === "Expired";

                        return (
                          <tr
                            key={coupon.id}
                            className={`border-b border-outline-variant transition-colors hover:bg-surface-container-low ${
                              isSelected
                                ? "bg-surface-container"
                                : index % 2 === 1
                                  ? "bg-surface-container-low/50"
                                  : ""
                            }`}
                            onClick={() => setSelectedCouponId(coupon.id)}
                          >
                            <td
                              className={`relative p-3 font-data-tabular ${
                                isSelected
                                  ? "text-primary-container"
                                  : "text-on-surface-variant"
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute bottom-0 left-0 top-0 w-1 bg-secondary-container" />
                              )}
                              {coupon.id}
                            </td>

                            <td
                              className={`p-3 text-label-md font-semibold ${
                                isExpired ? "text-outline" : "text-on-surface"
                              }`}
                            >
                              {coupon.code}
                              {isExpired ? " (Expired)" : ""}
                            </td>

                            <td className="p-3">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-label-sm font-medium ${getModePillClasses(
                                  coupon.mode,
                                )}`}
                              >
                                {coupon.mode}
                              </span>
                            </td>

                            <td
                              className={`p-3 ${
                                isExpired
                                  ? "text-outline"
                                  : "text-on-surface-variant"
                              }`}
                            >
                              {coupon.startDate}
                            </td>

                            <td
                              className={`p-3 ${
                                isExpired
                                  ? "text-outline"
                                  : "text-on-surface-variant"
                              }`}
                            >
                              {coupon.endDate}
                            </td>

                            <td
                              className={`p-3 text-right font-data-tabular ${
                                isExpired ? "text-outline" : "text-on-surface"
                              }`}
                            >
                              {coupon.minOrderValue}
                            </td>

                            <td
                              className={`p-3 text-right font-data-tabular ${
                                coupon.discountPercent !== "--"
                                  ? "text-secondary"
                                  : "text-outline-variant"
                              }`}
                            >
                              {coupon.discountPercent}
                            </td>

                            <td className="p-3 text-right font-data-tabular text-outline-variant">
                              {coupon.discountAmount}
                            </td>

                            <td className="p-3 text-center">
                              <button
                                type="button"
                                className="rounded p-1 text-outline transition-colors hover:text-primary"
                                aria-label={`More actions for ${coupon.code}`}
                              >
                                <span className="material-symbols-outlined text-body-lg">
                                  more_vert
                                </span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface-variant">
                <span>
                  Showing {showingStart} to {showingEnd} of {totalEntries}{" "}
                  entries
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!couponPagination.hasPrev || loadingCoupons) return;
                      setCouponPage((prev) => Math.max(1, prev - 1));
                    }}
                    disabled={!couponPagination.hasPrev || loadingCoupons}
                    className="rounded border border-outline-variant p-1 text-outline transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      chevron_left
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!couponPagination.hasNext || loadingCoupons) return;
                      setCouponPage((prev) => prev + 1);
                    }}
                    disabled={!couponPagination.hasNext || loadingCoupons}
                    className="rounded border border-outline-variant p-1 text-outline transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Next page"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </section>

            <h3 className="text-headline-sm font-semibold text-on-surface">
              Coupon Details:{" "}
              <span className="rounded bg-primary px-2 py-0.5 tracking-wide text-secondary-fixed">
                {selectedCoupon?.code ?? "—"}
              </span>
            </h3>

            {!selectedCoupon ? (
              <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 text-on-surface-variant">
                Select a coupon to view details.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <article className="relative overflow-hidden rounded border border-outline-variant bg-surface-container-lowest p-6 shadow-sm lg:col-span-5">
                  <div className="absolute right-0 top-0 z-0 h-24 w-24 rounded-bl-full bg-surface-container opacity-50" />

                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-label-sm uppercase tracking-widest text-outline">
                        Offer Title
                      </p>
                      <h4 className="mt-1 text-headline-sm font-semibold text-on-surface">
                        {selectedCoupon.title}
                      </h4>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-label-md font-semibold ${
                        selectedCoupon.status === "Active"
                          ? "bg-secondary text-on-secondary"
                          : "bg-outline-variant text-on-surface"
                      }`}
                    >
                      {selectedCoupon.status}
                    </span>
                  </div>

                  <div className="relative z-10 mt-4">
                    <p className="mb-1 text-label-sm uppercase tracking-widest text-outline">
                      Description
                    </p>
                    <p className="rounded border border-outline-variant/50 bg-surface-bright p-3 text-body-md text-on-surface-variant">
                      {selectedCoupon.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-5 grid grid-cols-2 gap-4 border-t border-outline-variant pt-4">
                    <div>
                      <p className="text-label-sm text-outline">Created By</p>
                      <p className="text-body-md font-semibold text-on-surface">
                        {selectedCoupon.createdBy}
                      </p>
                    </div>
                    <div>
                      <p className="text-label-sm text-outline">
                        Last Modified
                      </p>
                      <p className="text-body-md font-semibold text-on-surface">
                        {selectedCoupon.lastModified}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded border border-outline-variant bg-surface-container-lowest p-6 shadow-sm lg:col-span-4">
                  <h4 className="mb-3 flex items-center gap-2 border-b border-outline-variant pb-2 text-label-md font-semibold uppercase tracking-wider text-on-surface">
                    <span className="material-symbols-outlined text-[16px]">
                      rule
                    </span>
                    <span>Usage Limits</span>
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-body-md text-on-surface-variant">
                        Total Usage Limit
                      </span>
                      <span className="rounded border border-outline-variant bg-surface px-2 py-1 font-data-tabular font-bold text-on-surface">
                        {selectedCoupon.totalUsageLimit || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-body-md text-on-surface-variant">
                        Current Usage
                      </span>
                      <span className="rounded border border-secondary/20 bg-secondary/10 px-2 py-1 font-data-tabular font-bold text-secondary">
                        {selectedCoupon.currentUsage || "—"}
                      </span>
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-surface-container-high">
                      <div
                        className="h-1.5 rounded-full bg-secondary"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-outline-variant pt-2">
                      <span className="text-body-md text-on-surface-variant">
                        Limit Per User
                      </span>
                      <span className="font-data-tabular font-bold text-on-surface">
                        {selectedCoupon.usagePerUser || "—"}
                      </span>
                    </div>
                  </div>
                </article>

                <article className="flex flex-col rounded border border-outline-variant bg-surface-container-lowest p-6 shadow-sm lg:col-span-3">
                  <h4 className="mb-3 flex items-center gap-2 border-b border-outline-variant pb-2 text-label-md font-semibold uppercase tracking-wider text-on-surface">
                    <span className="material-symbols-outlined text-[16px]">
                      checklist
                    </span>
                    <span>Applicability</span>
                  </h4>

                  <ul className="space-y-2 text-body-md text-on-surface-variant">
                    {selectedCoupon.applicability.length === 0 ? (
                      <li className="text-outline">No rules provided</li>
                    ) : (
                      selectedCoupon.applicability.map((item, index) => {
                        const isLast =
                          index === selectedCoupon.applicability.length - 1;

                        return (
                          <li
                            key={`${item.label}-${index}`}
                            className={`flex items-start gap-2 ${
                              !item.included
                                ? "border-t border-outline-variant/30 pt-2 text-outline"
                                : ""
                            } ${isLast ? "mt-2" : ""}`}
                          >
                            <span
                              className={`material-symbols-outlined mt-0.5 text-[16px] ${
                                item.included
                                  ? "text-secondary"
                                  : "text-outline"
                              }`}
                            >
                              {item.included ? "check_circle" : "cancel"}
                            </span>
                            <span
                              className={item.included ? "" : "line-through"}
                            >
                              {item.label}
                            </span>
                          </li>
                        );
                      })
                    )}
                  </ul>

                  <div className="mt-auto pt-4">
                    <button
                      type="button"
                      className="h-10 w-full rounded border border-outline text-label-md font-semibold uppercase tracking-wider text-on-surface transition-colors hover:bg-surface-container"
                    >
                      Edit Logic
                    </button>
                  </div>
                </article>
              </div>
            )}
          </div>
        ) : (
          <section className="overflow-hidden rounded border border-outline-variant bg-surface-container-lowest shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-outline-variant bg-surface-container-lowest px-4 py-3">
              <h2 className="text-headline-sm font-semibold text-on-surface">
                Subscription Plans
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-3xl border-collapse text-left">
                <thead className="border-b border-outline-variant bg-surface-container-low">
                  <tr>
                    <th className="p-3 text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                      Plan
                    </th>
                    <th className="p-3 text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                      Price
                    </th>
                    <th className="p-3 text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                      Interval
                    </th>
                    <th className="p-3 text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="text-body-md text-on-surface">
                  {loadingPlans ? (
                    <>
                      <SkeletonTableRow columns={4} />
                      <SkeletonTableRow columns={4} />
                      <SkeletonTableRow columns={4} />
                    </>
                  ) : plans.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-on-surface-variant"
                      >
                        No subscription plans found
                      </td>
                    </tr>
                  ) : (
                    plans.map((p, i) => (
                      <tr
                        key={p.id}
                        className={`border-b border-outline-variant ${
                          i % 2 === 1 ? "bg-surface-container-low/50" : ""
                        }`}
                      >
                        <td className="p-3 font-semibold text-on-surface">
                          {p.name}
                        </td>
                        <td className="p-3 font-data-tabular text-secondary">
                          {p.price}
                        </td>
                        <td className="p-3 text-on-surface-variant">
                          {p.interval}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-label-sm font-semibold ${
                              p.status === "Active"
                                ? "bg-secondary text-on-secondary"
                                : "bg-outline-variant text-on-surface"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-outline-variant bg-surface p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-headline-sm font-semibold text-on-surface">
                Create Coupon
              </h3>
              <button
                type="button"
                onClick={closeCouponModal}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container"
                aria-label="Close create coupon dialog"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span className="text-on-surface-variant">Code</span>
                  <input
                    type="text"
                    value={couponForm.code}
                    onChange={(e) =>
                      setCouponForm((prev) => ({
                        ...prev,
                        code: e.target.value,
                      }))
                    }
                    className="w-full rounded border border-outline-variant bg-surface-bright px-3 py-2 text-on-surface outline-none focus:border-primary"
                    placeholder="WELCOME10"
                    required
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-on-surface-variant">Discount Type</span>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) =>
                      setCouponForm((prev) => ({
                        ...prev,
                        discountType: e.target.value,
                      }))
                    }
                    className="w-full rounded border border-outline-variant bg-surface-bright px-3 py-2 text-on-surface outline-none focus:border-primary"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-on-surface-variant">
                    Discount Value
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={couponForm.discountValue}
                    onChange={(e) =>
                      setCouponForm((prev) => ({
                        ...prev,
                        discountValue: e.target.value,
                      }))
                    }
                    className="w-full rounded border border-outline-variant bg-surface-bright px-3 py-2 text-on-surface outline-none focus:border-primary"
                    required
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-on-surface-variant">
                    Min Order Amount
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={couponForm.minOrderAmount}
                    onChange={(e) =>
                      setCouponForm((prev) => ({
                        ...prev,
                        minOrderAmount: e.target.value,
                      }))
                    }
                    className="w-full rounded border border-outline-variant bg-surface-bright px-3 py-2 text-on-surface outline-none focus:border-primary"
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-on-surface-variant">Valid From</span>
                  <input
                    type="date"
                    value={couponForm.validFrom}
                    onChange={(e) =>
                      setCouponForm((prev) => ({
                        ...prev,
                        validFrom: e.target.value,
                      }))
                    }
                    className="w-full rounded border border-outline-variant bg-surface-bright px-3 py-2 text-on-surface outline-none focus:border-primary"
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-on-surface-variant">Valid Until</span>
                  <input
                    type="date"
                    value={couponForm.validUntil}
                    onChange={(e) =>
                      setCouponForm((prev) => ({
                        ...prev,
                        validUntil: e.target.value,
                      }))
                    }
                    className="w-full rounded border border-outline-variant bg-surface-bright px-3 py-2 text-on-surface outline-none focus:border-primary"
                    required
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-on-surface-variant">Usage Limit</span>
                  <input
                    type="number"
                    min="0"
                    value={couponForm.usageLimit}
                    onChange={(e) =>
                      setCouponForm((prev) => ({
                        ...prev,
                        usageLimit: e.target.value,
                      }))
                    }
                    className="w-full rounded border border-outline-variant bg-surface-bright px-3 py-2 text-on-surface outline-none focus:border-primary"
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-on-surface-variant">
                    Per User Limit
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={couponForm.perUserLimit}
                    onChange={(e) =>
                      setCouponForm((prev) => ({
                        ...prev,
                        perUserLimit: e.target.value,
                      }))
                    }
                    className="w-full rounded border border-outline-variant bg-surface-bright px-3 py-2 text-on-surface outline-none focus:border-primary"
                  />
                </label>
              </div>

              <label className="space-y-1 text-sm">
                <span className="text-on-surface-variant">Description</span>
                <textarea
                  rows={3}
                  value={couponForm.description}
                  onChange={(e) =>
                    setCouponForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full rounded border border-outline-variant bg-surface-bright px-3 py-2 text-on-surface outline-none focus:border-primary"
                  placeholder="Optional coupon description"
                />
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeCouponModal}
                  className="rounded border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCoupon}
                  className="rounded bg-primary px-4 py-2 text-sm font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submittingCoupon ? "Creating..." : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-xl rounded-xl border border-outline-variant bg-surface p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-headline-sm font-semibold text-on-surface">
                Create Subscription Plan
              </h3>
              <button
                type="button"
                onClick={closePlanModal}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container"
                aria-label="Close create plan dialog"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <label className="space-y-1 text-sm">
                <span className="text-on-surface-variant">Plan Name</span>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) =>
                    setPlanForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded border border-outline-variant bg-surface-bright px-3 py-2 text-on-surface outline-none focus:border-primary"
                  placeholder="Basic Plan"
                  required
                />
              </label>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span className="text-on-surface-variant">Price</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={planForm.price}
                    onChange={(e) =>
                      setPlanForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    className="w-full rounded border border-outline-variant bg-surface-bright px-3 py-2 text-on-surface outline-none focus:border-primary"
                    required
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="text-on-surface-variant">Validity Days</span>
                  <input
                    type="number"
                    min="1"
                    value={planForm.validityDays}
                    onChange={(e) =>
                      setPlanForm((prev) => ({
                        ...prev,
                        validityDays: e.target.value,
                      }))
                    }
                    className="w-full rounded border border-outline-variant bg-surface-bright px-3 py-2 text-on-surface outline-none focus:border-primary"
                    required
                  />
                </label>
              </div>

              <label className="space-y-1 text-sm">
                <span className="text-on-surface-variant">
                  Benefits (one per line)
                </span>
                <textarea
                  rows={4}
                  value={planForm.benefits}
                  onChange={(e) =>
                    setPlanForm((prev) => ({
                      ...prev,
                      benefits: e.target.value,
                    }))
                  }
                  className="w-full rounded border border-outline-variant bg-surface-bright px-3 py-2 text-on-surface outline-none focus:border-primary"
                  placeholder={"5% discount on all orders\nPriority support"}
                />
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closePlanModal}
                  className="rounded border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPlan}
                  className="rounded bg-primary px-4 py-2 text-sm font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submittingPlan ? "Creating..." : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
