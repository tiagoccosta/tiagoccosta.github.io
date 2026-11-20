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

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-7 dark:border-slate-800 dark:bg-[#0D121E]">
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
              <GraduationCap className="h-4 w-4" />
              {copy.degreeLabel[lang]}
            </div>

            <div className="mt-4 space-y-4">
              {EDUCATION_ITEMS.map((edu) => (
                <div
                  key={edu.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800/90 dark:bg-slate-900/60"
                >
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    {edu.degree[lang]}
                  </h3>
                  <p className="mt-1 font-mono text-xs font-medium text-indigo-700 dark:text-indigo-300">
                    {edu.institution}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {edu.note[lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-5 dark:border-slate-800 dark:bg-[#0D121E]">
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              <Languages className="h-4 w-4" />
              {copy.languagesLabel[lang]}
            </div>

            <div className="mt-4 space-y-3">
              {LANGUAGE_PROFICIENCIES.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 dark:border-slate-800/90 dark:bg-slate-900/60"
                >
                  <span className="font-display text-base font-semibold text-slate-900 dark:text-white">
                    {item.name[lang]}
                  </span>
                  <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-xs font-medium text-cyan-800 dark:border-cyan-400/30 dark:text-cyan-200">
                    {item.level[lang]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="font-mono text-xs uppercase tracking-wider text-amber-700 dark:text-amber-300/90">
            {copy.certificatesLabel[lang]}
          </h3>

          <div className="mt-4 grid gap-5 md:grid-cols-3">
            {CERTIFICATES.map((cert) => (
              <a
                key={cert.id}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-500/30 bg-white p-6 shadow-xs transition hover:-translate-y-0.5 hover:border-amber-500/65 hover:shadow-lg hover:shadow-amber-500/10 dark:border-amber-400/25 dark:bg-gradient-to-br dark:from-[#121624] dark:via-[#0E1320] dark:to-[#0A0E18] dark:hover:border-amber-400/60 dark:hover:shadow-[0_12px_32px_rgba(245,158,11,0.1)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/35 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:border-amber-400/35 dark:text-amber-200">
                      <Award className="h-3.5 w-3.5 text-amber-600 dark:text-amber-300" />
                      {cert.issuer} • {cert.tier}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber-600 dark:text-slate-500 dark:group-hover:text-amber-300" />
                  </div>

                  <h4 className="mt-4 font-display text-xl font-bold text-slate-900 transition group-hover:text-amber-800 dark:text-white dark:group-hover:text-amber-100">
                    {cert.title}
                  </h4>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {cert.track[lang]}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 border-t border-slate-200 pt-4 font-mono text-xs font-medium text-amber-700 dark:border-slate-800/80 dark:text-amber-300">
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
