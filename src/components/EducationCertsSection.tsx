import { ArrowUpRight, Award, BadgeCheck } from 'lucide-react';
import {
  CERTIFICATES,
  EDUCATION_ITEMS,
  Language,
  LANGUAGE_PROFICIENCIES,
  UI_COPY,
} from '../data/portfolio';

interface EducationCertsSectionProps {
  lang: Language;
}

export function EducationCertsSection({ lang }: EducationCertsSectionProps) {
  const copy = UI_COPY.education;

  return (
    <section
      id="education"
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

        <div className="mt-8 grid gap-5 lg:grid-cols-12">
          <div className="rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6] p-6 lg:col-span-7 dark:border-[#272A30] dark:bg-[#151619]">
            <div className="font-mono text-[11px] font-semibold tracking-wider text-[#70757F] uppercase dark:text-[#6E747E]">
              {copy.degreeLabel[lang]}
            </div>

            <div className="mt-4 space-y-3">
              {EDUCATION_ITEMS.map((edu) => (
                <div
                  key={edu.id}
                  className="rounded-[2px] border border-[#D2CFC5] bg-[#F2F1EC] p-4 dark:border-[#272A30] dark:bg-[#1B1D21]"
                >
                  <h3 className="font-display text-lg font-bold text-[#141518] dark:text-[#ECEEE9]">
                    {edu.degree[lang]}
                  </h3>
                  <p className="mt-1 font-mono text-xs font-medium text-[#D94612] dark:text-[#FF5A1F]">
                    {edu.institution}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B4F57] dark:text-[#9A9FA8]">
                    {edu.note[lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6] p-6 lg:col-span-5 dark:border-[#272A30] dark:bg-[#151619]">
            <div className="font-mono text-[11px] font-semibold tracking-wider text-[#70757F] uppercase dark:text-[#6E747E]">
              {copy.languagesLabel[lang]}
            </div>

            <div className="mt-4 divide-y divide-[#D2CFC5] rounded-[2px] border border-[#D2CFC5] bg-[#F2F1EC] dark:divide-[#272A30] dark:border-[#272A30] dark:bg-[#1B1D21]">
              {LANGUAGE_PROFICIENCIES.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 px-4 py-3.5"
                >
                  <span className="font-display text-sm font-semibold text-[#141518] dark:text-[#ECEEE9]">
                    {item.name[lang]}
                  </span>
                  <span className="rounded-[2px] border border-[#D2CFC5] bg-[#FAF9F6] px-2.5 py-0.5 font-mono text-xs font-medium text-[#D94612] dark:border-[#272A30] dark:bg-[#151619] dark:text-[#FF5A1F]">
                    {item.level[lang]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="font-mono text-xs font-semibold tracking-wider text-[#9A7012] uppercase dark:text-[#D4A338]">
            {copy.certificatesLabel[lang]}
          </h3>

          <div className="mt-4 grid gap-5 md:grid-cols-3">
            {CERTIFICATES.map((cert) => (
              <a
                key={cert.id}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="reticle-card group flex flex-col justify-between rounded-[3px] border border-[#9A7012]/35 bg-[#FAF9F6] p-5 transition hover:border-[#9A7012] dark:border-[#D4A338]/30 dark:bg-[#151619] dark:hover:border-[#D4A338]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-[#9A7012]/35 bg-[#9A7012]/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-[#9A7012] uppercase dark:border-[#D4A338]/35 dark:bg-[#D4A338]/10 dark:text-[#D4A338]">
                      <Award className="h-3 w-3" />
                      {cert.issuer} • {cert.tier}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[#70757F] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#9A7012] dark:text-[#6E747E] dark:group-hover:text-[#D4A338]" />
                  </div>

                  <h4 className="mt-4 font-display text-lg font-bold text-[#141518] dark:text-[#ECEEE9]">
                    {cert.title}
                  </h4>

                  <p className="mt-1.5 text-sm leading-relaxed text-[#4B4F57] dark:text-[#9A9FA8]">
                    {cert.track[lang]}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-[#D2CFC5] pt-3.5 font-mono text-[11px] font-medium text-[#9A7012] dark:border-[#272A30] dark:text-[#D4A338]">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  <span>{copy.verifyLabel[lang]}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
