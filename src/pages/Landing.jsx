import { Link } from "react-router-dom";

const steps = [
  { icon: "calendar_month", title: "1. Schedule", desc: "Choose a convenient pickup time through our app or website. We fit into your schedule." },
  { icon: "local_shipping", title: "2. Pickup", desc: "Our professional concierge collects your garments in secure, reusable Bubble Wash bags." },
  { icon: "check_circle", title: "3. Clean & Deliver", desc: "Expert cleaning, crisp folding, and prompt delivery back to your door within 48 hours." },
];

const whyUs = [
  { icon: "eco", title: "Eco-Friendly", desc: "We use sustainable, non-toxic detergents that are tough on stains but gentle on the planet." },
  { icon: "timer", title: "24h Turnaround", desc: "Need it fast? Enjoy our rapid next-day delivery service without compromising quality." },
  { icon: "diamond", title: "Expert Care", desc: "Our seasoned professionals handle delicate fabrics and intricate details with utmost precision." },
  { icon: "verified_user", title: "Fully Insured", desc: "Peace of mind guaranteed. Your garments are fully protected throughout the entire process." },
];

const services = [
  { title: "Wash & Fold", desc: "Everyday laundry washed, perfectly dried, and meticulously folded.", price: "$1.50", unit: "/ lb", popular: false, img: "/stitch/bubble-wash/service-wash-fold.jpg" },
  { title: "Dry Cleaning", desc: "Gentle, eco-solvent cleaning for your delicate and structured garments.", price: "$6.00", unit: "/ item", popular: true, img: "/stitch/bubble-wash/service-dry-cleaning.jpg" },
  { title: "Wash & Iron", desc: "Crisp, wrinkle-free finish for your shirts, blouses, and trousers.", price: "$4.50", unit: "/ item", popular: false, img: "/stitch/bubble-wash/service-wash-iron.jpg" },
];

const testimonials = [
  { name: "Sarah Jenkins", text: "Bubble Wash has completely changed my weekends. No more spending hours on laundry. The pickup is seamless and my clothes always come back perfectly folded and smelling fresh.", img: "/stitch/bubble-wash/testimonial-sarah.jpg" },
  { name: "Michael Chang", text: "Their dry cleaning service is top-notch. They managed to get a stubborn coffee stain out of my favorite silk tie. The 24h turnaround is a lifesaver for business trips.", img: "/stitch/bubble-wash/testimonial-michael.jpg" },
  { name: "Emily Rodriguez", text: "I love the eco-friendly approach. It's great knowing my clothes are clean without harsh chemicals. The app is super intuitive and tracking my orders is a breeze.", img: "/stitch/bubble-wash/testimonial-emily.jpg" },
];

export default function Landing() {
  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden relative">
      {/* Nav */}
      <nav className="hidden md:flex justify-between items-center px-8 py-3 z-50 rounded-full mt-6 mx-auto w-[90%] max-w-7xl sticky top-6 bg-white/15 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_0_rgba(15,23,42,0.1)]">
        <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">Bubble Wash</div>
        <div className="flex gap-8 items-center">
          <a className="text-cyan-600 font-semibold border-b-2 border-cyan-500" href="#services">Services</a>
          <a className="text-slate-600 hover:text-cyan-500 transition-colors" href="#pricing">Pricing</a>
          <a className="text-slate-600 hover:text-cyan-500 transition-colors" href="#testimonials">Locations</a>
          <a className="text-slate-600 hover:text-cyan-500 transition-colors" href="#download">Support</a>
        </div>
        <div className="flex gap-3 items-center">
          <Link to="/signin" className="text-slate-600 hover:text-cyan-500 transition-colors font-label-md text-label-md px-4 py-2 rounded-full hover:bg-white/20">Sign In</Link>
          <Link to="/signup" className="bg-gradient-to-r from-secondary-fixed-dim to-secondary text-on-secondary px-5 py-2 rounded-full font-label-md text-label-md hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(98,250,227,0.2)]">Sign Up</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 md:px-12 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img src="/stitch/bubble-wash/hero-towels.jpg" alt="Fresh clean towels" className="absolute inset-0 w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
          <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-secondary-container/20 blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-fixed/30 blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto text-center z-10 flex flex-col items-center gap-6 mt-12">
          <h1 className="font-display-xl text-display-xl text-on-surface max-w-4xl tracking-tight leading-tight">
            Laundry, Simplified. <br /> <span className="bg-gradient-to-r from-secondary-fixed-dim to-secondary bg-clip-text text-transparent">Clean Delivered.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Experience the future of garment care. Premium washing, meticulous folding, and precise dry cleaning, picked up and delivered to your door with a tap.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link to="/customer/schedule" className="bg-gradient-to-r from-secondary-fixed-dim to-secondary text-on-secondary px-8 py-4 rounded-full font-label-md text-label-md hover:scale-[1.02] transition-transform duration-300 shadow-[0_0_20px_rgba(98,250,227,0.3)] flex items-center justify-center gap-2">
              Schedule Pickup <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
            <Link to="/customer" className="glass-panel px-8 py-4 rounded-full font-label-md text-label-md hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2 bg-white/15 backdrop-blur-xl border border-white/30">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 md:py-20 px-4 md:px-12 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden"><div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-secondary-container/10 blur-[100px]" /></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display-lg text-display-lg text-on-surface">Effortless Care</h2>
            <p className="text-on-surface-variant mt-3">Three steps to a refreshed wardrobe.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.title} className="glass-card rounded-3xl p-8 hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden group">
                <div className="w-16 h-16 rounded-full bg-secondary-container/30 flex items-center justify-center mb-6 text-on-secondary-container">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{s.title}</h3>
                <p className="text-on-surface-variant">{s.desc}</p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 rounded-bl-[100px] -z-10 group-hover:bg-secondary-container/20 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Bubble Wash */}
      <section className="py-12 md:py-20 px-4 md:px-12 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden"><div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-primary-fixed/20 blur-[120px]" /></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display-lg text-display-lg text-on-surface">Why Bubble Wash</h2>
            <p className="text-on-surface-variant mt-3">The ultimate standard in fabric care.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((w) => (
              <div key={w.title} className="glass-card rounded-3xl p-6 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center mb-4 text-secondary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{w.icon}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{w.title}</h3>
                <p className="text-sm text-on-surface-variant">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-12 md:py-20 px-4 md:px-12 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden"><div className="absolute top-[30%] left-[-20%] w-[70vw] h-[70vw] rounded-full bg-secondary-container/15 blur-[150px]" /></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display-lg text-display-lg text-on-surface">Our Services</h2>
            <p className="text-on-surface-variant mt-3">Tailored solutions for every fabric.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className={`glass-card rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 flex flex-col relative group ${s.popular ? "border-2 border-secondary/50" : ""}`}>
                {s.popular && <div className="absolute top-4 right-4 bg-secondary text-on-secondary text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">Most Popular</div>}
                <div className="h-48 overflow-hidden">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{s.title}</h3>
                  <p className="text-on-surface-variant mb-4 flex-grow">{s.desc}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xl font-bold text-on-surface">{s.price} <span className="text-sm font-normal text-on-surface-variant">{s.unit}</span></span>
                    <Link to="/customer/schedule" className="text-secondary font-medium hover:underline">Select</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-12 md:py-20 px-4 md:px-12 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden"><div className="absolute top-[10%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-primary-fixed/20 blur-[80px]" /></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display-lg text-display-lg text-on-surface">Loved by Thousands</h2>
            <p className="text-on-surface-variant mt-3">Don't just take our word for it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card p-8 rounded-3xl relative">
                <span className="material-symbols-outlined absolute top-6 right-6 text-4xl text-secondary/20">format_quote</span>
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-secondary-container shadow-md" />
                  <div>
                    <h4 className="font-bold text-on-surface">{t.name}</h4>
                    <div className="flex text-yellow-400 text-sm">★★★★★</div>
                  </div>
                </div>
                <p className="text-on-surface-variant italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download */}
      <section id="download" className="py-12 md:py-20 px-4 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden"><div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-secondary-container/20 blur-[120px]" /></div>
        <div className="max-w-7xl mx-auto glass-card rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-cyan-400/30 to-blue-600/30 blur-[80px] rounded-full -z-10" />
          <div className="flex-1 text-center md:text-left z-10">
            <h2 className="font-display-lg text-display-lg text-on-surface mb-6">Laundry at your fingertips.</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg mx-auto md:mx-0">
              Download the Bubble Wash app to schedule pickups, track your orders in real-time, and manage your preferences seamlessly from your phone.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-3xl">apple</span>
                <div className="text-left"><div className="text-[10px] leading-tight">Download on the</div><div className="text-sm font-semibold leading-tight">App Store</div></div>
              </button>
              <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-3xl">shop</span>
                <div className="text-left"><div className="text-[10px] leading-tight">GET IT ON</div><div className="text-sm font-semibold leading-tight">Google Play</div></div>
              </button>
            </div>
          </div>
          {/* Phone Mockup */}
          <div className="flex-1 flex justify-center z-10">
            <div className="relative w-64 h-[500px] bg-white rounded-[40px] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col">
              <div className="h-6 bg-slate-800 w-32 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20" />
              <div className="flex-1 bg-surface-container p-4 pt-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="font-bold text-lg">Hi, Sarah 👋</div>
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center"><span className="material-symbols-outlined text-sm">notifications</span></div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                  <div className="text-xs text-on-surface-variant mb-1">Current Order</div>
                  <div className="font-bold text-secondary mb-2">Washing in progress</div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="w-1/2 bg-secondary h-full rounded-full" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm text-center">
                    <span className="material-symbols-outlined text-secondary mb-1">local_shipping</span>
                    <div className="text-xs font-semibold">Schedule</div>
                  </div>
                  <div className="bg-white p-3 rounded-2xl shadow-sm text-center">
                    <span className="material-symbols-outlined text-secondary mb-1">dry_cleaning</span>
                    <div className="text-xs font-semibold">Services</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 pt-16 pb-8 px-4 md:px-12 relative overflow-hidden mt-12">
        <div className="absolute inset-0 -z-10 overflow-hidden"><div className="absolute bottom-[-50%] left-[50%] w-[100vw] h-[50vw] rounded-[100%] bg-primary-fixed/20 blur-[100px] -translate-x-1/2" /></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 mb-4 inline-block">Bubble Wash</div>
            <p className="text-on-surface-variant mb-6 max-w-sm">Premium garment care delivered to your door. Simplifying laundry so you can focus on what matters most.</p>
            <div className="flex gap-4">
              {["public", "camera_alt", "alternate_email"].map((ic) => (
                <a key={ic} className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-secondary hover:scale-110 transition-all" href="#">
                  <span className="material-symbols-outlined">{ic}</span>
                </a>
              ))}
            </div>
          </div>
          {[
            { title: "Services", links: ["Wash & Fold", "Dry Cleaning", "Ironing", "Alterations"] },
            { title: "Company", links: ["About Us", "Locations", "Pricing", "Careers"] },
            { title: "Support", links: ["Help Center", "Contact Us", "Terms of Service", "Privacy Policy"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-on-surface mb-4">{col.title}</h4>
              <ul className="space-y-3 text-on-surface-variant">
                {col.links.map((link) => <li key={link}><a className="hover:text-secondary transition-colors" href="#">{link}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-on-surface-variant">
          <p>© 2024 Bubble Wash Inc. All rights reserved.</p>
          <span>Made with <span className="text-red-500">♥</span> for clean clothes</span>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-8 pt-4 rounded-t-[32px] bg-white/10 backdrop-blur-2xl border-t border-white/20 shadow-[0_-4px_24px_0_rgba(0,255,255,0.05)]">
        <Link to="/" className="flex flex-col items-center text-cyan-500 text-[10px] font-bold uppercase tracking-widest">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>home_max</span>Home
        </Link>
        <Link to="/customer/schedule" className="flex flex-col items-center text-slate-400 hover:text-cyan-300 text-[10px] font-bold uppercase tracking-widest">
          <span className="material-symbols-outlined mb-1">local_laundry_service</span>Orders
        </Link>
        <Link to="/customer/wallet" className="flex flex-col items-center text-slate-400 hover:text-cyan-300 text-[10px] font-bold uppercase tracking-widest">
          <span className="material-symbols-outlined mb-1">account_balance_wallet</span>Wallet
        </Link>
        <Link to="/signin" className="flex flex-col items-center text-slate-400 hover:text-cyan-300 text-[10px] font-bold uppercase tracking-widest">
          <span className="material-symbols-outlined mb-1">person</span>Profile
        </Link>
      </nav>
    </div>
  );
}
