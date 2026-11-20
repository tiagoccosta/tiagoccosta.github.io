import { Language, SKILL_GROUPS, UI_COPY } from '../data/portfolio';

interface AboutSkillsSectionProps {
  lang: Language;
}

export function AboutSkillsSection({ lang }: AboutSkillsSectionProps) {
  const copy = UI_COPY.about;

  return (
    <section
      id="about"
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
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6] p-6 sm:p-8 lg:col-span-5 dark:border-[#272A30] dark:bg-[#151619]">
            <div className="mb-4 font-mono text-[10px] tracking-wider text-[#70757F] uppercase dark:text-[#6E747E]">
              BIO_SUMMARY // README.MD
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-[#4B4F57] dark:text-[#9A9FA8] sm:text-base">
              {copy.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph[lang]}</p>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6] lg:col-span-7 dark:border-[#272A30] dark:bg-[#151619]">
            <div className="grid sm:grid-cols-2 sm:divide-x sm:divide-[#D2CFC5] dark:sm:divide-[#272A30]">
              {SKILL_GROUPS.map((group, idx) => (
                <div
                  key={group.id}
                  className={`flex flex-col p-5 sm:p-6 ${
                    idx >= 2 ? 'border-t border-[#D2CFC5] dark:border-[#272A30]' : ''
                  } ${idx === 1 ? 'border-t border-[#D2CFC5] sm:border-t-0 dark:border-[#272A30]' : ''}`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-base font-bold text-[#141518] dark:text-[#ECEEE9]">
                      {group.title[lang]}
                    </h3>
                    <span className="font-mono text-[11px] font-semibold text-[#D94612] dark:text-[#FF5A1F]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs leading-relaxed text-[#70757F] dark:text-[#6E747E]">
                    {group.subtitle[lang]}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-[2px] border border-[#D2CFC5] bg-[#F2F1EC] px-2 py-0.5 font-mono text-[11px] text-[#141518] dark:border-[#272A30] dark:bg-[#1B1D21] dark:text-[#ECEEE9]"
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
      </div>
    </section>
  );
}
