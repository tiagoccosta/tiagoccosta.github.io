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
      className="border-t border-[#D2CFC5] bg-[#E7E5DD]/45 py-18 sm:py-22 dark:border-[#272A30] dark:bg-[#151619]/40"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#D2CFC5] pb-6 dark:border-[#272A30]">
          <p className="font-mono text-xs font-medium tracking-[0.16em] text-[#D94612] uppercase dark:text-[#FF5A1F]">
            {copy.eyebrow[lang]}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#141518] dark:text-[#ECEEE9] sm:text-4xl">
            {copy.title[lang]}
          </h2>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[#4B4F57] dark:text-[#9A9FA8] sm:text-base">
            {copy.subtitle[lang]}
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {EXPERIENCE_ITEMS.map((item, idx) => (
            <article
              key={item.id}
              className="rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6] p-6 transition hover:border-[#A5A194] sm:p-7 dark:border-[#272A30] dark:bg-[#151619] dark:hover:border-[#3E434D]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[11px] text-[#70757F] dark:text-[#6E747E]">
                    EXP_{String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-bold text-[#141518] dark:text-[#ECEEE9]">
                    {item.company}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs font-medium text-[#D94612] dark:text-[#FF5A1F]">
                    {item.role[lang]}
                  </p>
                </div>

                <span className="rounded-[2px] border border-[#D2CFC5] bg-[#E7E5DD] px-2.5 py-1 font-mono text-xs text-[#4B4F57] dark:border-[#272A30] dark:bg-[#1B1D21] dark:text-[#9A9FA8]">
                  {item.period[lang]}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#4B4F57] dark:text-[#9A9FA8] sm:text-base">
                {item.summary[lang]}
              </p>

              {item.highlights.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-[#4B4F57] dark:text-[#9A9FA8]">
                  {item.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-[1px] bg-[#D94612] dark:bg-[#FF5A1F]" />
                      <span>{highlight[lang]}</span>
                    </li>
                  ))}
                </ul>
              )}

              {item.tech && item.tech.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-[#D2CFC5] pt-4 dark:border-[#272A30]">
                  {item.tech.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[2px] bg-[#E7E5DD] px-2 py-0.5 font-mono text-xs text-[#141518] dark:bg-[#1B1D21] dark:text-[#ECEEE9]"
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
