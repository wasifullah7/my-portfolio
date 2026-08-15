import { site } from "@/content/site";

type Event = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload?: { commits?: { message: string }[]; ref?: string };
};

type Profile = { public_repos: number; followers: number; created_at: string };

const USER = "wasifullah7";
const HEADERS = { Accept: "application/vnd.github+json", "User-Agent": USER };

/**
 * Live proof of work. Recruiters trust commit history over self-reported
 * skills, so this pulls the real thing. Revalidates hourly and degrades to
 * nothing if GitHub is unreachable, so a rate limit can never break a build.
 */
async function load() {
  try {
    const [profileRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}`, {
        headers: HEADERS,
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/users/${USER}/events/public?per_page=100`, {
        headers: HEADERS,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!profileRes.ok || !eventsRes.ok) return null;

    const profile = (await profileRes.json()) as Profile;
    const events = (await eventsRes.json()) as Event[];
    if (!Array.isArray(events)) return null;

    const pushes = events.filter((e) => e.type === "PushEvent");
    const commitCount = pushes.reduce(
      (sum, e) => sum + (e.payload?.commits?.length ?? 0),
      0,
    );

    const recent = pushes.slice(0, 6).map((e) => ({
      repo: e.repo.name.replace(`${USER}/`, ""),
      message: e.payload?.commits?.at(-1)?.message?.split("\n")[0] ?? "",
      date: e.created_at,
    }));

    const activeRepos = new Set(pushes.map((e) => e.repo.name)).size;

    return { profile, recent, commitCount, activeRepos };
  } catch {
    return null;
  }
}

export async function GitHubActivity() {
  const data = await load();
  if (!data || !data.recent.length) return null;

  const { profile, recent, commitCount, activeRepos } = data;

  return (
    <section className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-20 sm:px-10">
      <div className="rule-heavy pt-4">
        <div className="index-rule">
          <span className="tabular text-xs text-accent">/</span>
          <span className="label order-3">Live from GitHub</span>
        </div>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[300px_1fr] lg:gap-20">
        <dl className="flex flex-wrap gap-x-12 gap-y-6 lg:block lg:space-y-6">
          <div>
            <dt className="tabular text-3xl text-accent">{profile.public_repos}</dt>
            <dd className="label mt-1.5">public repositories</dd>
          </div>
          <div>
            <dt className="tabular text-3xl text-accent">{commitCount}</dt>
            <dd className="label mt-1.5">commits in recent activity</dd>
          </div>
          <div>
            <dt className="tabular text-3xl text-accent">{activeRepos}</dt>
            <dd className="label mt-1.5">repositories touched</dd>
          </div>
        </dl>

        <div>
          <p className="label">Latest pushes</p>
          <ul className="mt-4">
            {recent.map((item, i) => (
              <li
                key={`${item.repo}-${i}`}
                className="rule-t flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-3.5"
              >
                <span className="min-w-0">
                  <span className="mono text-[0.8125rem] text-accent">{item.repo}</span>
                  <span className="ml-3 text-sm text-muted">{item.message}</span>
                </span>
                <time dateTime={item.date} className="tabular text-xs text-faint">
                  {new Date(item.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </time>
              </li>
            ))}
          </ul>
          <div className="rule-t" />

          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            className="link-underline mono mt-6 inline-block text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
          >
            Full activity on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
