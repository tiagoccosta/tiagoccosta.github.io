import { ArrowUpRight } from 'lucide-react';
import { Language, PERSONAL_PROJECTS, UI_COPY } from '../data/portfolio';

interface ProjectsSectionProps {
  lang: Language;
}

function getCodePrefix(id: string): string {
  if (id === 'sequenciator-system') return 'TOOL_01';
  if (id === 'tnet') return 'LIB_02';
  if (id === 'vbrain') return 'AI_03';
  if (id === 'sea-creatures-store') return 'APP_04';
  return 'APP_05';
}

export function ProjectsSection({ lang }: ProjectsSectionProps) {
  const copy = UI_COPY.projects;

  return (
    <section
      id="projects"
      className="border-t border-[#D2CFC5] py-18 sm:py-22 dark:border-[#272A30]"
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

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAL_PROJECTS.map((project) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="reticle-card group flex flex-col rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6] p-5 transition hover:border-[#D94612] dark:border-[#272A30] dark:bg-[#151619] dark:hover:border-[#FF5A1F]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {project.iconImage ? (
                    <img
                      src={project.iconImage}
                      alt={project.title}
                      loading="lazy"
                      className="h-11 w-11 rounded-[2px] border border-[#D2CFC5] object-cover dark:border-[#272A30]"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-[2px] border border-[#D2CFC5] bg-[#E7E5DD] font-mono text-[10px] font-semibold tracking-tight text-[#141518] dark:border-[#272A30] dark:bg-[#1B1D21] dark:text-[#ECEEE9]">
                      {getCodePrefix(project.id).split('_')[0]}
                    </div>
                  )}
                  <div>
                    <span className="block font-mono text-[10px] tracking-wider text-[#D94612] uppercase dark:text-[#FF5A1F]">
                      {project.kind[lang]}
                    </span>
                    <h3 className="mt-0.5 font-display text-lg font-bold text-[#141518] transition group-hover:text-[#D94612] dark:text-[#ECEEE9] dark:group-hover:text-[#FF5A1F]">
                      {project.title}
                    </h3>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#70757F] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#D94612] dark:text-[#6E747E] dark:group-hover:text-[#FF5A1F]" />
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-[#4B4F57] dark:text-[#9A9FA8]">
                {project.description[lang]}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#D2CFC5] pt-3.5 dark:border-[#272A30]">
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((item) => (
                    <span
                      key={item}
                      className="rounded-[2px] bg-[#E7E5DD] px-2 py-0.5 font-mono text-[10px] text-[#4B4F57] dark:bg-[#1B1D21] dark:text-[#9A9FA8]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[11px] font-medium text-[#D94612] dark:text-[#FF5A1F]">
                  {project.actionLabel[lang]}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
