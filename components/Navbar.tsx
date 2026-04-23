"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Library } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Generator", icon: Sparkles },
  { href: "/library", label: "Library", icon: Library },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
            🇫🇷
          </div>
          <span className="text-[15px] font-semibold text-white/90 tracking-tight">
            FrenchToSpeech
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-white/45 hover:bg-white/[0.04] hover:text-white/70"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
