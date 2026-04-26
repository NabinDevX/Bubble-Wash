import { Link } from "react-router-dom";

const summaryCards = [
  {
    title: "Today's Pickups",
    value: "48",
    delta: "12%",
    deltaIcon: "trending_up",
    deltaColor: "text-secondary",
    note: "14 pending collection",
  },
  {
    title: "Today's Deliveries",
    value: "32",
    delta: "3%",
    deltaIcon: "trending_down",
    deltaColor: "text-error",
    note: "8 en route",
  },
  {
    title: "Active Subscribers",
    value: "1,204",
    icon: "group",
    note: "Corporate & Residential",
    featured: true,
  },
];

const actionCards = [
  {
    title: "Pickup List",
    icon: "local_shipping",
    description:
      "Manage pending laundry collections, optimize routing, and mark bags as received from clients.",
    cta: "View List",
    to: "/rider/pickup-list",
  },
  {
    title: "Delivery List",
    icon: "inventory_2",
    description:
      "Track clean laundry dispatches, confirm client drop-offs, and manage delivery exceptions.",
    cta: "View List",
    to: "/rider/delivery-list",
  },
  {
    title: "Rate Card",
    icon: "payments",
    description:
      "Access current pricing for standard wash, dry cleaning, ironing, and special garment care.",
    cta: "View Rates",
    to: "/rider/rate-card",
  },
  {
    title: "Subscriptions & Coupons",
    icon: "card_membership",
    description:
      "Verify active membership tiers, apply promotional discounts, and handle recurring billing queries.",
    cta: "Manage Subs",
    to: "/rider/subscriptions-coupons",
  },
];

export default function RiderDashboard() {
  return (
    <section className="w-full">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-md font-semibold tracking-headline-sm text-on-surface">
            Rider Overview
          </h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Today's operational metrics and active routes.
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-label-md font-semibold uppercase tracking-widest text-on-surface-variant">
            Date
          </p>
          <p className="mt-1 text-data-tabular font-semibold tracking-normal text-on-surface">
            OCT 24, 2023
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <article
            key={card.title}
            className={
              card.featured
                ? "relative overflow-hidden rounded-xl border border-primary-container bg-primary p-6 text-on-primary shadow-[0_2px_8px_rgba(0,32,69,0.15)]"
                : "group relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-6 transition-colors hover:border-secondary"
            }
          >
            {!card.featured && (
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-surface-container opacity-50 transition-colors group-hover:bg-secondary-fixed-dim" />
            )}

            {card.featured && (
              <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-primary-container opacity-50" />
            )}

            <div className="relative z-10 flex items-start justify-between">
              <p
                className={
                  card.featured
                    ? "text-label-md font-semibold uppercase tracking-[0.05em] text-inverse-primary"
                    : "text-label-md font-semibold uppercase tracking-[0.05em] text-on-surface-variant"
                }
              >
                {card.title}
              </p>

              {card.featured ? (
                <span className="material-symbols-outlined text-secondary-fixed">
                  {card.icon}
                </span>
              ) : (
                <div className="flex items-center gap-1 rounded bg-surface-container px-2 py-1 text-[12px] font-semibold text-on-surface">
                  <span
                    className={`material-symbols-outlined text-[14px] ${card.deltaColor}`}
                  >
                    {card.deltaIcon}
                  </span>
                  <span>{card.delta}</span>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-6">
              <p
                className={
                  card.featured
                    ? "text-display-lg leading-display-xl font-bold tracking-headline-md text-on-primary"
                    : "text-display-lg leading-display-xl font-bold tracking-headline-md text-primary"
                }
              >
                {card.value}
              </p>
              <p
                className={
                  card.featured
                    ? "mt-1 text-label-md text-primary-fixed"
                    : "mt-1 text-label-md text-outline"
                }
              >
                {card.note}
              </p>
            </div>
          </article>
        ))}
      </div>

      <h2 className="mt-12 border-b border-outline-variant pb-2 text-headline-sm font-semibold text-on-surface">
        Operational Actions
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {actionCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="group flex items-start gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container transition-colors group-hover:bg-primary group-hover:text-on-primary">
              <span className="material-symbols-outlined text-[28px]">
                {card.icon}
              </span>
            </div>

            <div className="min-w-0">
              <h3 className="text-headline-sm font-semibold text-on-surface">
                {card.title}
              </h3>
              <p className="mt-2 text-body-md text-on-surface-variant">
                {card.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-label-md font-semibold text-primary transition-colors group-hover:text-secondary">
                {card.cta}
                <span className="material-symbols-outlined text-body-lg">
                  arrow_forward
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
