import { useMemo, useState } from "react";

const categoryTabs = [
  "Dry Clean",
  "Wash & Iron",
  "Ironing",
  "Alterations",
  "Household",
];

const pricingRows = [
  {
    category: "Dry Clean",
    item: "Two Piece Suit",
    standard: "$24.00",
    express: "$32.00",
    status: "Active",
    icon: "checkroom",
  },
  {
    category: "Dry Clean",
    item: "Blazer / Sports Coat",
    standard: "$15.00",
    express: "$20.00",
    status: "Active",
    icon: "styler",
  },
  {
    category: "Dry Clean",
    item: "Trousers",
    standard: "$10.00",
    express: "$14.00",
    status: "Active",
    icon: "accessibility_new",
  },
  {
    category: "Dry Clean",
    item: "Dress (Standard)",
    standard: "$18.00",
    express: "$25.00",
    status: "Active",
    icon: "dry_cleaning",
  },
  {
    category: "Dry Clean",
    item: "Skirt",
    standard: "$12.00",
    express: "$16.00",
    status: "Inactive",
    icon: "apparel",
  },
  {
    category: "Wash & Iron",
    item: "Casual Shirt",
    standard: "$7.00",
    express: "$10.50",
    status: "Active",
    icon: "iron",
  },
  {
    category: "Ironing",
    item: "Formal Shirt",
    standard: "$4.00",
    express: "$6.50",
    status: "Active",
    icon: "checkroom",
  },
  {
    category: "Alterations",
    item: "Trouser Hem Adjustment",
    standard: "$8.00",
    express: "$12.00",
    status: "Active",
    icon: "content_cut",
  },
  {
    category: "Household",
    item: "Curtain Panel",
    standard: "$16.00",
    express: "$22.00",
    status: "Inactive",
    icon: "blinds",
  },
];

function parsePrice(priceLabel) {
  return Number.parseFloat(priceLabel.replace(/[^\d.]/g, ""));
}

export default function RiderRateCard() {
  const [activeTab, setActiveTab] = useState("Dry Clean");

  const visibleRows = useMemo(
    () => pricingRows.filter((row) => row.category === activeTab),
    [activeTab],
  );

  const categoryStats = useMemo(() => {
    const totalItems = visibleRows.length;
    const standardAvg =
      totalItems > 0
        ? visibleRows.reduce((sum, row) => sum + parsePrice(row.standard), 0) /
          totalItems
        : 0;
    const expressAvg =
      totalItems > 0
        ? visibleRows.reduce((sum, row) => sum + parsePrice(row.express), 0) /
          totalItems
        : 0;

    return {
      totalItems,
      standardAvg: `$${standardAvg.toFixed(2)}`,
      expressAvg: `$${expressAvg.toFixed(2)}`,
      pricingAccuracy: totalItems > 0 ? 98 : 0,
    };
  }, [visibleRows]);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-headline-md font-semibold tracking-headline-sm text-on-surface">
              Rate Card Management
            </h1>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Manage pricing for all service categories and items.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-secondary px-4 text-label-md font-semibold text-secondary transition-colors hover:bg-secondary-fixed/20"
            >
              <span className="material-symbols-outlined">download</span>
              <span>Export</span>
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-label-md font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Add New Item</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-outline-variant pb-2">
          {categoryTabs.map((tab) => {
            const isActive = tab === activeTab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={
                  isActive
                    ? "border-b-2 border-primary px-4 py-2 text-label-md font-semibold text-primary"
                    : "px-4 py-2 text-label-md font-semibold text-on-surface-variant transition-colors hover:text-on-surface"
                }
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 lg:col-span-4">
            <h2 className="border-b border-outline-variant pb-2 text-headline-sm font-semibold text-on-surface">
              Category Overview
            </h2>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-body-md text-on-surface-variant">
                  Total Items
                </span>
                <span className="font-data-tabular font-semibold text-primary">
                  {categoryStats.totalItems}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-body-md text-on-surface-variant">
                  Avg Standard Price
                </span>
                <span className="font-data-tabular font-semibold text-primary">
                  {categoryStats.standardAvg}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-body-md text-on-surface-variant">
                  Avg Express Price
                </span>
                <span className="font-data-tabular font-semibold text-primary">
                  {categoryStats.expressAvg}
                </span>
              </div>

              <div className="border-t border-outline-variant pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">
                    Pricing Accuracy
                  </span>
                  <span className="text-label-md font-semibold text-secondary">
                    {categoryStats.pricingAccuracy}%
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-full bg-secondary transition-all duration-300"
                    style={{ width: `${categoryStats.pricingAccuracy}%` }}
                  />
                </div>
              </div>
            </div>
          </article>

          <article className="flex h-150 min-h-105 flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest lg:col-span-8">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-5 py-4">
              <h2 className="text-headline-sm font-semibold text-on-surface">
                {activeTab} Pricing
              </h2>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-md p-2 text-on-surface-variant transition-colors hover:text-primary"
                  aria-label="Filter"
                >
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
                <button
                  type="button"
                  className="rounded-md p-2 text-on-surface-variant transition-colors hover:text-primary"
                  aria-label="More"
                >
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>

            <div className="custom-scroll flex-1 overflow-auto">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 border-b border-outline-variant bg-surface">
                  <tr>
                    <th className="px-4 py-3 text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                      Item Name
                    </th>
                    <th className="px-4 py-3 text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                      Standard Price
                    </th>
                    <th className="px-4 py-3 text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                      Express Price
                    </th>
                    <th className="px-4 py-3 text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleRows.map((row, index) => (
                    <tr
                      key={row.item}
                      className={`group border-b border-outline-variant transition-colors hover:bg-surface-container-low ${
                        index % 2 === 1 ? "bg-surface-bright" : ""
                      }`}
                    >
                      <td className="px-4 py-4 text-body-md text-on-surface">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-primary">
                            <span className="material-symbols-outlined">
                              {row.icon}
                            </span>
                          </div>
                          <span>{row.item}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 font-data-tabular text-on-surface">
                        {row.standard}
                      </td>

                      <td className="px-4 py-4 font-data-tabular text-on-surface">
                        {row.express}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={
                            row.status === "Active"
                              ? "inline-flex items-center rounded-full bg-secondary-fixed px-2 py-1 text-label-sm font-semibold text-on-secondary-fixed-variant"
                              : "inline-flex items-center rounded-full bg-error-container px-2 py-1 text-label-sm font-semibold text-on-error-container"
                          }
                        >
                          {row.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          className="rounded-md p-1 text-on-surface-variant opacity-0 transition-all hover:text-primary group-hover:opacity-100"
                          aria-label={`Edit ${row.item}`}
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
