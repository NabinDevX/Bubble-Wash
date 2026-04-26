export default function Footer() {
  return (
    <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 pt-16 pb-24 md:pb-8 px-margin-mobile md:px-margin-desktop relative overflow-hidden mt-12">
      <div className="absolute inset-0 -z-10 bg-background overflow-hidden">
        <div className="absolute bottom-[-50%] left-[50%] w-screen h-[50vw] rounded-[100%] bg-primary-fixed/20 blur-[100px] -translate-x-1/2" />
      </div>

      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
        <div className="lg:col-span-2">
          <div className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-600 mb-4 inline-block">
            Bubble Wash
          </div>
          <p className="font-body-md text-on-surface-variant mb-6 max-w-sm">
            Premium garment care delivered to your door. Simplifying laundry so
            you can focus on what matters most.
          </p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-secondary hover:scale-110 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">public</span>
            </a>
            <a
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-secondary hover:scale-110 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">camera_alt</span>
            </a>
            <a
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-secondary hover:scale-110 transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-on-surface mb-4">Services</h4>
          <ul className="space-y-3 font-body-md text-on-surface-variant">
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Wash &amp; Fold
              </a>
            </li>
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Dry Cleaning
              </a>
            </li>
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Ironing
              </a>
            </li>
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Alterations
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-on-surface mb-4">Company</h4>
          <ul className="space-y-3 font-body-md text-on-surface-variant">
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                About Us
              </a>
            </li>
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Locations
              </a>
            </li>
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Pricing
              </a>
            </li>
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Careers
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-on-surface mb-4">Support</h4>
          <ul className="space-y-3 font-body-md text-on-surface-variant">
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Help Center
              </a>
            </li>
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Contact Us
              </a>
            </li>
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Terms of Service
              </a>
            </li>
            <li>
              <a className="hover:text-secondary transition-colors" href="#">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-container-max mx-auto pt-8 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-on-surface-variant">
        <p>© 2024 Bubble Wash Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <span>
            Made with <span className="text-red-500">♥</span> for clean clothes
          </span>
        </div>
      </div>
    </footer>
  );
}
