import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mx-auto max-w-[1400px] px-6 sm:px-10">
      <div className="rule-t flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="display text-2xl">{site.name}</p>
          <p className="label mt-2">{site.role}</p>
        </div>

        <ul className="flex flex-wrap gap-x-8 gap-y-2">
          {[
            { href: site.links.github, label: "GitHub" },
            { href: site.links.linkedin, label: "LinkedIn" },
            { href: site.links.medium, label: "Medium" },
            { href: `mailto:${site.email}`, label: "Email" },
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="link-underline mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="tabular text-xs text-faint">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
