import { ArrowUpRight, Award, BadgeCheck, GraduationCap, Languages } from 'lucide-react';
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

        <div className="mt-9 grid gap-5 lg:grid-cols-12">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-7 dark:border-white/8 dark:bg-[#16191D]">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#2563EB] uppercase dark:text-[#60A5FA]">
              <GraduationCap className="h-4 w-4" />
              {copy.degreeLabel[lang]}
            </div>

            <div className="mt-4 space-y-3">
              {EDUCATION_ITEMS.map((edu) => (
                <div
                  key={edu.id}
                  className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 dark:border-white/8 dark:bg-[#111418]"
                >
                  <h3 className="font-display text-lg font-bold text-[#11151B] dark:text-[#F3F5F7]">
                    {edu.degree[lang]}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-[#0D9488] dark:text-[#14B8A6]">
                    {edu.institution}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {edu.note[lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-5 dark:border-white/8 dark:bg-[#16191D]">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0D9488] uppercase dark:text-[#14B8A6]">
              <Languages className="h-4 w-4" />
              {copy.languagesLabel[lang]}
            </div>

            <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-slate-50/80 dark:divide-white/8 dark:border-white/8 dark:bg-[#111418]">
              {LANGUAGE_PROFICIENCIES.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 px-4 py-3.5"
                >
                  <span className="font-display text-sm font-semibold text-[#11151B] dark:text-[#F3F5F7]">
                    {item.name[lang]}
                  </span>
                  <span className="rounded-md bg-[#2563EB]/10 px-2.5 py-1 text-xs font-medium text-[#2563EB] dark:bg-[#3B82F6]/15 dark:text-[#60A5FA]">
                    {item.level[lang]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-xs font-semibold tracking-wider text-[#9A7422] uppercase dark:text-[#C9A24D]">
            {copy.certificatesLabel[lang]}
          </h3>

          <div className="mt-4 grid gap-5 md:grid-cols-3">
            {CERTIFICATES.map((cert) => (
              <a
                key={cert.id}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-xl border border-[#C9A24D]/35 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#C9A24D] dark:border-[#C9A24D]/25 dark:bg-[#16191D] dark:hover:border-[#C9A24D]/70"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A24D]/12 px-2.5 py-0.5 text-[11px] font-semibold text-[#9A7422] dark:text-[#E2C275]">
                      <Award className="h-3.5 w-3.5 text-[#C9A24D]" />
                      {cert.issuer} · {cert.tier}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#C9A24D]" />
                  </div>

                  <h4 className="mt-4 font-display text-lg font-bold text-[#11151B] dark:text-[#F3F5F7]">
                    {cert.title}
                  </h4>

                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {cert.track[lang]}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1.5 border-t border-slate-200 pt-3.5 text-xs font-semibold text-[#9A7422] dark:border-white/8 dark:text-[#C9A24D]">
                  <BadgeCheck className="h-4 w-4" />
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
