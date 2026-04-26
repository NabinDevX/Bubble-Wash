import { useMemo, useState } from "react";

const topTabs = ["Coupon Management", "Subscription Plans"];
const modeFilters = ["All Modes", "Global", "App Only", "Web Only"];

const coupons = [
  {
    id: "CP-9012",
    code: "SPRINGCLEAN20",
    title: "Spring Cleaning Special 20% Off",
    mode: "Global",
    startDate: "Mar 01, 2024",
    endDate: "May 31, 2024",
    minOrderValue: "$50.00",
    discountPercent: "20%",
    discountAmount: "--",
    status: "Active",
    description:
      "Seasonal promotion targeting residential clients for deep cleaning services. Applicable across all standard laundry items. Excludes leather and specialty rugs.",
    createdBy: "Admin System",
    lastModified: "Feb 28, 2024",
    totalUsageLimit: 1000,
    currentUsage: 342,
    usagePerUser: 1,
    applicability: [
      { label: "All Service Areas", included: true },
      { label: "Standard Wash & Fold", included: true },
      { label: "Dry Cleaning", included: true },
      { label: "Subscription Renewals", included: false },
    ],
  },
  {
    id: "CP-9013",
    code: "WELCOMEFLAT10",
    title: "New Customer Flat Discount",
    mode: "App Only",
    startDate: "Jan 01, 2024",
    endDate: "Dec 31, 2024",
    minOrderValue: "$0.00",
    discountPercent: "--",
    discountAmount: "$10.00",
    status: "Active",
    description:
      "Introductory incentive for first-time app users to boost onboarding conversion and first order completion.",
    createdBy: "Growth Team",
    lastModified: "Mar 05, 2024",
    totalUsageLimit: 2500,
    currentUsage: 1029,
    usagePerUser: 1,
    applicability: [
      { label: "Mobile App Orders", included: true },
      { label: "All Service Areas", included: true },
      { label: "First Order Only", included: true },
      { label: "Web Checkouts", included: false },
    ],
  },
  {
    id: "CP-9014",
    code: "WINTER50",
    title: "Winter Revival Campaign",
    mode: "Web Only",
    startDate: "Nov 01, 2023",
    endDate: "Feb 28, 2024",
    minOrderValue: "$100.00",
    discountPercent: "50%",
    discountAmount: "--",
    status: "Expired",
    description:
      "Legacy seasonal campaign retained for reporting and historical trend analysis.",
    createdBy: "Campaign Ops",
    lastModified: "Feb 28, 2024",
    totalUsageLimit: 600,
    currentUsage: 600,
    usagePerUser: 1,
    applicability: [
      { label: "Web Portal Orders", included: true },
      { label: "Premium Dry Clean", included: true },
      { label: "Household Line", included: false },
      { label: "Subscription Renewals", included: false },
    ],
  },
];

function getModePillClasses(mode) {
  if (mode === "Global") {
    return "border border-[#c8e6c9] bg-[#e8f5e9] text-[#1b5e20]";
  }

  return "border border-outline-variant bg-surface-container-high text-on-surface";
}

export default function RiderSubscriptionsCoupons() {
  const [activeTab, setActiveTab] = useState("Coupon Management");
  const [activeModeFilter, setActiveModeFilter] = useState("All Modes");
  const [selectedCouponId, setSelectedCouponId] = useState(coupons[0].id);

  const filteredCoupons = useMemo(() => {
    if (activeModeFilter === "All Modes") {
      return coupons;
    }

    return coupons.filter((coupon) => coupon.mode === activeModeFilter);
  }, [activeModeFilter]);

  const selectedCoupon = useMemo(() => {
    const fromFiltered = filteredCoupons.find(
      (coupon) => coupon.id === selectedCouponId,
    );

    if (fromFiltered) {
      return fromFiltered;
    }

    return filteredCoupons[0] ?? coupons[0];
  }, [filteredCoupons, selectedCouponId]);

  const usagePercent = Math.round(
    (selectedCoupon.currentUsage / selectedCoupon.totalUsageLimit) * 100,
  );

  const showingStart = filteredCoupons.length === 0 ? 0 : 1;
  const showingEnd = filteredCoupons.length;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-headline-md font-semibold tracking-headline-sm text-primary">
              Promotions &amp; Billing
            </h1>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Manage active coupons, promotional logic, and client subscription
              tiers.
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
              className="inline-flex h-10 items-center gap-2 rounded bg-primary-container px-6 text-label-md font-semibold uppercase tracking-wider text-on-primary transition-colors hover:bg-primary"
            >
              <span className="material-symbols-outlined text-body-lg">
                add
              </span>
              <span>New Coupon</span>
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
                  setSelectedCouponId(coupons[0].id);
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
                    Disc %ge
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
                {filteredCoupons.map((coupon, index) => {
                  const isSelected = coupon.id === selectedCoupon.id;
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
                          isExpired ? "text-outline" : "text-on-surface-variant"
                        }`}
                      >
                        {coupon.startDate}
                      </td>

                      <td
                        className={`p-3 ${
                          isExpired ? "text-outline" : "text-on-surface-variant"
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
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface-variant">
            <span>
              Showing {showingStart} to {showingEnd} of {filteredCoupons.length}{" "}
              entries
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded border border-outline-variant p-1 text-outline transition-colors hover:bg-surface-container"
                aria-label="Previous page"
              >
                <span className="material-symbols-outlined text-[16px]">
                  chevron_left
                </span>
              </button>
              <button
                type="button"
                className="rounded border border-outline-variant p-1 text-outline transition-colors hover:bg-surface-container"
                aria-label="Next page"
              >
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </section>

        <h3 className="text-headline-sm font-semibold text-primary">
          Coupon Details:{" "}
          <span className="rounded bg-primary px-2 py-0.5 tracking-wide text-secondary-fixed">
            {selectedCoupon.code}
          </span>
        </h3>

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
                <p className="text-label-sm text-outline">Last Modified</p>
                <p className="text-body-md font-semibold text-on-surface">
                  {selectedCoupon.lastModified}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded border border-outline-variant bg-surface-container-lowest p-6 shadow-sm lg:col-span-4">
            <h4 className="mb-3 flex items-center gap-2 border-b border-outline-variant pb-2 text-label-md font-semibold uppercase tracking-wider text-primary">
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
                  {selectedCoupon.totalUsageLimit}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-body-md text-on-surface-variant">
                  Current Usage
                </span>
                <span className="rounded border border-secondary/20 bg-secondary/10 px-2 py-1 font-data-tabular font-bold text-secondary">
                  {selectedCoupon.currentUsage}
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
                  {selectedCoupon.usagePerUser}
                </span>
              </div>
            </div>
          </article>

          <article className="flex flex-col rounded border border-outline-variant bg-surface-container-lowest p-6 shadow-sm lg:col-span-3">
            <h4 className="mb-3 flex items-center gap-2 border-b border-outline-variant pb-2 text-label-md font-semibold uppercase tracking-wider text-primary">
              <span className="material-symbols-outlined text-[16px]">
                checklist
              </span>
              <span>Applicability</span>
            </h4>

            <ul className="space-y-2 text-body-md text-on-surface-variant">
              {selectedCoupon.applicability.map((item, index) => {
                const isLast =
                  index === selectedCoupon.applicability.length - 1;

                return (
                  <li
                    key={item.label}
                    className={`flex items-start gap-2 ${
                      !item.included
                        ? "border-t border-outline-variant/30 pt-2 text-outline"
                        : ""
                    } ${isLast ? "mt-2" : ""}`}
                  >
                    <span
                      className={`material-symbols-outlined mt-0.5 text-[16px] ${
                        item.included ? "text-secondary" : "text-outline"
                      }`}
                    >
                      {item.included ? "check_circle" : "cancel"}
                    </span>
                    <span className={item.included ? "" : "line-through"}>
                      {item.label}
                    </span>
                  </li>
                );
              })}
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
      </div>
    </section>
  );
}
