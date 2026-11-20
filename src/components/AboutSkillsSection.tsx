import { Language, SKILL_GROUPS, UI_COPY } from '../data/portfolio';

interface AboutSkillsSectionProps {
  lang: Language;
}

export function AboutSkillsSection({ lang }: AboutSkillsSectionProps) {
  const copy = UI_COPY.about;

  return (
    <section
      id="about"
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
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base lg:col-span-5 dark:text-slate-300">
            {copy.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph[lang]}</p>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {SKILL_GROUPS.map((group) => (
              <div
                key={group.id}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-white/8 dark:bg-[#16191D]"
              >
                <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-[#2563EB] to-[#0D9488] opacity-80" />

                <h3 className="font-display text-base font-bold text-[#11151B] dark:text-[#F3F5F7]">
                  {group.title[lang]}
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {group.subtitle[lang]}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-white/6 dark:text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
