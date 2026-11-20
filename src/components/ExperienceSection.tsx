import { Briefcase } from 'lucide-react';
import { EXPERIENCE_ITEMS, Language, UI_COPY } from '../data/portfolio';

interface ExperienceSectionProps {
  lang: Language;
}

export function ExperienceSection({ lang }: ExperienceSectionProps) {
  if (EXPERIENCE_ITEMS.length === 0) {
    return null;
  }

  const copy = UI_COPY.experience;

  return (
    <section
      id="experience"
      className="border-t border-slate-200 bg-slate-100/50 py-20 sm:py-24 dark:border-slate-800/70 dark:bg-[#0A0E18]/60"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
            {copy.eyebrow[lang]}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {copy.title[lang]}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {copy.subtitle[lang]}
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {EXPERIENCE_ITEMS.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-slate-300 sm:p-8 dark:border-slate-800 dark:bg-[#0D121E] dark:hover:border-slate-700"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-300">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                      {item.company}
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-indigo-700 dark:text-indigo-300">
                      {item.role[lang]}
                    </p>
                  </div>
                </div>

                <span className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 font-mono text-xs text-slate-600 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-300">
                  {item.period[lang]}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                {item.summary[lang]}
              </p>

              {item.highlights.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {item.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600 dark:bg-cyan-400" />
                      <span>{highlight[lang]}</span>
                    </li>
                  ))}
                </ul>
              )}

              {item.tech && item.tech.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-slate-200 pt-4 dark:border-slate-800/80">
                  {item.tech.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
