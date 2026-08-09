import { Link } from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsLinkedin,
} from "react-icons/bs";
import { HiOutlineMail, HiOutlineLocationMarker } from "react-icons/hi";
import { FaArrowUp } from "react-icons/fa";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "All posts", to: "/search" },
];

const SOCIALS = [
  { icon: BsGithub, href: "https://github.com/md-fahad1?tab=repositories", label: "GitHub" },
  { icon: BsLinkedin, href: "https://www.linkedin.com/in/md-fahad-khan/", label: "LinkedIn" },
  { icon: BsTwitter, href: "#", label: "Twitter" },
  { icon: BsInstagram, href: "#", label: "Instagram" },
  { icon: BsFacebook, href: "#", label: "Facebook" },
];

export default function FooterCom() {
  const year = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-white dark:bg-[#0B1120] border-t border-gray-100 dark:border-gray-800">
      {/* brand accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-0.5 font-mono text-lg font-semibold"
            >
              <span className="text-pink-500">&lt;</span>
              <span className="text-gray-800 dark:text-white">Fahad</span>
              <span className="text-purple-500">Blog</span>
              <span className="text-pink-500">/&gt;</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-3 max-w-xs">
              A software engineer's journal of code, projects, and the
              places travel takes me — written to slow down and remember it
              all.
            </p>
            <div className="flex gap-2.5 mt-5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-500 transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
              Explore
            </h3>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://fahad-portfolio-v1-bice.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                >
                  Portfolio
                </a>
              </li>
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
              Get in touch
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:info@example.com"
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                >
                  <HiOutlineMail className="text-pink-500 shrink-0" />
                  info@example.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <HiOutlineLocationMarker className="text-pink-500 shrink-0" />
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>

          {/* Newsletter-style CTA */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
              Say hello
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Have a project in mind, or just want to talk travel? My inbox
              is always open.
            </p>
            <a
              href="mailto:info@example.com"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-sm shadow-pink-500/30 transition-all"
            >
              Send a message
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-left">
            © {year} Fahad Blog. Built with React &amp; Tailwind CSS.
          </p>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-pink-500 hover:-translate-y-0.5 transition-all duration-300"
          >
            <FaArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}