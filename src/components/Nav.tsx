"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { navItems, site } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b border-rule bg-paper/85 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 sm:px-10">
        <Link href="/" className="mono text-sm tracking-tight">
          {site.name.toLowerCase().replace(" ", ".")}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "mono group flex items-baseline gap-1.5 text-xs uppercase tracking-[0.14em] transition-colors",
                active === item.href ? "text-accent" : "text-muted hover:text-ink",
              )}
            >
              <span className="tabular text-[0.625rem] text-faint">{item.index}</span>
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/blog"
            className="mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
          >
            Writing
          </Link>
          <Link
            href="/hire"
            className="mono border border-ink px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-ink hover:text-paper"
          >
            Hire me
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <ThemeToggle />
          <a
            href={site.resumePath}
            download
            className="link-underline mono hidden text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink sm:inline-block"
          >
            Résumé
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="mono text-xs uppercase tracking-[0.14em] text-muted md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-rule bg-paper px-6 py-2 md:hidden">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="mono flex items-baseline gap-3 border-b border-rule py-3.5 text-xs uppercase tracking-[0.14em] text-muted last:border-b-0"
            >
              <span className="tabular text-[0.625rem] text-faint">{item.index}</span>
              {item.label}
            </a>
          ))}
          <Link
            href="/blog"
            onClick={() => setOpen(false)}
            className="mono flex items-baseline gap-3 border-b border-rule py-3.5 text-xs uppercase tracking-[0.14em] text-muted"
          >
            <span className="tabular text-[0.625rem] text-faint">06</span>
            Writing
          </Link>
          <Link
            href="/hire"
            onClick={() => setOpen(false)}
            className="mono flex items-baseline gap-3 py-3.5 text-xs uppercase tracking-[0.14em] text-accent"
          >
            <span className="tabular text-[0.625rem] text-faint">07</span>
            Hire me
          </Link>
        </div>
      ) : null}
    </header>
  );
}
