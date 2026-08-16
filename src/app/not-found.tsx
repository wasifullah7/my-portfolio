import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const routes = [
  { href: "/work", label: "Case studies", note: "How the systems were built" },
  { href: "/blog", label: "Writing", note: "Engineering write-ups" },
  { href: "/hire", label: "Hire me", note: "Roles and availability" },
  { href: "/resume", label: "Résumé", note: "Full experience" },
];

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1400px] flex-col justify-center px-6 py-28 sm:px-10">
      <div className="rule-heavy pt-4">
        <div className="index-rule">
          <span className="tabular text-xs text-accent">404</span>
          <span className="label order-3">Not found</span>
        </div>
      </div>

      <h1 className="display mt-8 text-[clamp(2.1rem,7vw,5rem)]">
        This page
        <br />
        does not exist
      </h1>

      <p className="measure mt-7 text-lg leading-relaxed text-muted">
        Either the address is wrong, or I moved something and forgot to leave a
        redirect. Both are on me.
      </p>

      <ul className="mt-14 max-w-2xl">
        {routes.map((route) => (
          <li key={route.href}>
            <Link
              href={route.href}
              className="row rule-t group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-5"
            >
              <span className="text-[0.9375rem] text-ink">{route.label}</span>
              <span className="mono text-xs text-faint">{route.note}</span>
            </Link>
          </li>
        ))}
        <li className="rule-t" />
      </ul>

      <p className="mt-10 text-sm text-muted">
        If you followed a link from somewhere and it broke,{" "}
        <a href={`mailto:${site.email}`} className="link-underline text-accent">
          tell me
        </a>{" "}
        and I will fix it.
      </p>
    </div>
  );
}
