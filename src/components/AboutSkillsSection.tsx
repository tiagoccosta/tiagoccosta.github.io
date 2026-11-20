import { Cpu, Globe, Server, Sparkles } from 'lucide-react';
import { Language, SKILL_GROUPS, UI_COPY } from '../data/portfolio';

interface AboutSkillsSectionProps {
  lang: Language;
}

const GROUP_ICONS = [Cpu, Globe, Server, Sparkles] as const;

export function AboutSkillsSection({ lang }: AboutSkillsSectionProps) {
  const copy = UI_COPY.about;

  return (
    <section
      id="about"
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
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 lg:col-span-5 dark:border-slate-800 dark:bg-[#0D121E]">
            <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              {copy.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph[lang]}</p>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {SKILL_GROUPS.map((group, idx) => {
              const Icon = GROUP_ICONS[idx % GROUP_ICONS.length];
              return (
                <div
                  key={group.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-[#0D121E] dark:hover:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                      {group.title[lang]}
                    </h3>
                  </div>

                  <p className="mt-2.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {group.subtitle[lang]}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700 dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
