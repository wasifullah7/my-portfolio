import { Mail, PenLine } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="hairline mt-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold">{site.name}</p>
          <p className="text-sm text-muted">{site.role}</p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { href: site.links.github, label: "GitHub", Icon: GithubIcon },
            { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
            { href: site.links.medium, label: "Medium", Icon: PenLine },
            { href: `mailto:${site.email}`, label: "Email", Icon: Mail },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              className="grid size-9 place-items-center rounded-full border border-border text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>

        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
