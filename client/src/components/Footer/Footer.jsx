import { CustomLogo } from "@/features/ui";
import Link from "next/link";
import {
  AiOutlineInstagram,
  AiOutlineLinkedin,
  AiOutlineFacebook,
} from "react-icons/ai";

const socialItems = [
  { icon: AiOutlineFacebook, href: "https://www.facebook.com/share/19c2x367Cv/" },
  { icon: AiOutlineInstagram, href: "https://www.instagram.com/fisiom_fulness?igsh=MWVmZ3pqYXY5bmZuag==" },
  { icon: AiOutlineLinkedin, href: "https://www.linkedin.com/company/fisio-fulness/" },
];

const navItems = [
  { name: "Trabaja con nosotros", href: "/trabajo" },
  { name: "Quienes somos", href: "/about" },
  { name: "Blog", href: "/blog" },
];

function Footer() {
  return (
    <footer className="text-white bg-secondary py-3 px-4">
      <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-3">
        <CustomLogo width={130} />
        <div className="flex items-center gap-4 text-sm">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="hover:text-primary-300 transition-colors">
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {socialItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-primary-300 transition-colors"
            >
              <item.icon className="text-xl" />
            </a>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-white/60 mt-2">
        Copyright © {new Date().getFullYear()} FisiomFulness
      </p>
    </footer>
  );
}

export default Footer;
