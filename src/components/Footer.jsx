import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer id="contact" className="bg-[#064E3B] pt-14 pb-8 text-white sm:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">

        {/* ── Top grid ── */}
        <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Col 1 – Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <img src="/assets/logo.png" alt="FixMyArea" className="h-6 w-6" />
              </div>
              <span className="text-lg font-extrabold">
                Fix<span className="text-emerald-300">My</span>Area
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              A citizen-led platform for reporting and resolving local civic issues through community power and government action.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {["in", "f", "𝕏", "📷"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-bold transition hover:bg-white/20"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 – Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              {[
                { label: "Home", to: "/" },
                { label: "Issue Feed", to: "/local-issues" },
                { label: "Report Issue", to: "/login" },
                { label: "Dashboard", to: "/dashboard" },
                { label: "Login", to: "/login" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="flex items-center gap-1.5 transition hover:text-white">
                    <span className="text-emerald-400">›</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 – Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Support</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              {["Contact Us", "Privacy Policy", "Terms & Conditions", "FAQs"].map((item) => (
                <li key={item}>
                  <a href="#" className="flex items-center gap-1.5 transition hover:text-white">
                    <span className="text-emerald-400">›</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 – Get in touch */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Get in Touch</h3>
            <div className="space-y-3 text-sm text-white/60 leading-relaxed">
              <p>4th Floor, NeGD, Electronics Niketan,<br />6 CGO Complex, Lodhi Road,<br />New Delhi – 110003, India</p>
              <a
                href="mailto:support-fixmyarea@digitalindia.gov.in"
                className="block break-words text-emerald-300 underline-offset-2 hover:underline"
              >
                support-fixmyarea@digitalindia.gov.in
              </a>
              <p>(011) 24307714</p>
              <p className="text-xs text-white/40">Mon–Fri · 9:00 AM to 5:30 PM</p>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-white/30 sm:flex-row">
            <p>© 2025 FixMyArea — Ministry of Electronics &amp; IT (MeitY), Government of India®</p>
            <p>Last Updated: {new Date().toLocaleDateString("en-GB")} · v2.3.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
