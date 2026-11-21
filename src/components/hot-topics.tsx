import Link from "next/link";
import { StatusBanner } from "@/components/chrome";
import { latestHotTopicsByState, type HotTopicRecord } from "@/lib/hot-topics";
import { logError } from "@/lib/errors";
import { formatDate } from "@/lib/site";
import { liveStates } from "@/lib/launch";

function linkLabel(href: string): string {
  return href.includes("/bills/") ? "See the bill" : "See the topic";
}

function TopicCard({ topic }: { topic: HotTopicRecord }) {
  return (
    <li className="rounded-lg border border-line bg-paper p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-crimson">{topic.rank}</p>
      <h3 className="mt-1 font-serif text-xl text-navy">{topic.title}</h3>
      <p className="mt-2 text-sm leading-relaxed">{topic.summary}</p>
      {topic.link ? (
        <p className="mt-2 text-sm">
          <Link className="font-semibold text-crimson underline" href={topic.link}>
            {linkLabel(topic.link)}
          </Link>
        </p>
      ) : null}
      {topic.sourceNote ? <p className="mt-2 text-xs text-muted">{topic.sourceNote}</p> : null}
    </li>
  );
}

export async function HotTopicsPage() {
  let byState: Awaited<ReturnType<typeof latestHotTopicsByState>> = new Map();
  let failed = false;
  try {
    byState = await latestHotTopicsByState();
  } catch (error) {
    await logError(error, "/hot-topics");
    failed = true;
  }
  if (failed) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-4xl text-navy">Hot Topics</h1>
        <StatusBanner>Hot topics could not be loaded.</StatusBanner>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-crimson">American Capitol Watch</p>
        <h1 className="font-serif text-4xl leading-tight text-navy">Hot Topics</h1>
        <p className="max-w-2xl text-lg text-ink">Based on public posts on X this week.</p>
      </section>
      {liveStates().map((state) => {
        const week = byState.get(state.slug);
        return (
          <section key={state.slug} aria-labelledby={`hot-${state.slug}`}>
            <h2 id={`hot-${state.slug}`} className="font-serif text-2xl text-navy">
              {state.name}
            </h2>
            {week && week.topics.length > 0 ? (
              <>
                <p className="mt-1 text-sm text-muted">Week of {formatDate(week.weekStart)}.</p>
                <ol className="mt-3 grid gap-3">
                  {week.topics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
                </ol>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">No hot topics for {state.name} yet.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
