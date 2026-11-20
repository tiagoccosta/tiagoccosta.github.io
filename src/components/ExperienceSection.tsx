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
      className="border-t border-slate-200/80 bg-white/60 py-16 sm:py-22 dark:border-white/8 dark:bg-[#14171B]/60"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#2563EB] uppercase dark:text-[#14B8A6]">
            {copy.eyebrow[lang]}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#11151B] sm:text-4xl dark:text-[#F3F5F7]">
            {copy.title[lang]}
          </h2>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            {copy.subtitle[lang]}
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {EXPERIENCE_ITEMS.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-[#2563EB]/40 sm:p-7 dark:border-white/8 dark:bg-[#16191D] dark:hover:border-[#14B8A6]/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#3B82F6]/15 dark:text-[#60A5FA]">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#11151B] dark:text-[#F3F5F7]">
                      {item.company}
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-[#0D9488] dark:text-[#14B8A6]">
                      {item.role[lang]}
                    </p>
                  </div>
                </div>

                <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/6 dark:text-slate-300">
                  {item.period[lang]}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                {item.summary[lang]}
              </p>

              {item.highlights.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {item.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB] dark:bg-[#14B8A6]" />
                      <span>{highlight[lang]}</span>
                    </li>
                  ))}
                </ul>
              )}

              {item.tech && item.tech.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-slate-200 pt-4 dark:border-white/8">
                  {item.tech.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-white/6 dark:text-slate-300"
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
