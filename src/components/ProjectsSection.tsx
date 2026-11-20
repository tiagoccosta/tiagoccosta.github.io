import { ArrowUpRight, Boxes, Brain, Network } from 'lucide-react';
import { Language, PERSONAL_PROJECTS, UI_COPY } from '../data/portfolio';

interface ProjectsSectionProps {
  lang: Language;
}

function getIcon(id: string) {
  if (id === 'tnet') return Network;
  if (id === 'vbrain') return Brain;
  return Boxes;
}

export function ProjectsSection({ lang }: ProjectsSectionProps) {
  const copy = UI_COPY.projects;

  return (
    <section
      id="projects"
      className="border-t border-slate-200/80 py-16 sm:py-22 dark:border-white/8"
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

        <div className="mt-9 grid gap-4 md:grid-cols-2">
          {PERSONAL_PROJECTS.map((project) => {
            const Icon = getIcon(project.id);
            return (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-[#2563EB]/50 hover:shadow-sm dark:border-white/8 dark:bg-[#16191D] dark:hover:border-[#14B8A6]/50"
              >
                {project.iconImage ? (
                  <img
                    src={project.iconImage}
                    alt={project.title}
                    loading="lazy"
                    className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 object-cover dark:border-white/10"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB]/12 to-[#0D9488]/12 text-[#2563EB] dark:from-[#2563EB]/20 dark:to-[#0D9488]/20 dark:text-[#14B8A6]">
                    <Icon className="h-6 w-6" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="block text-[11px] font-semibold tracking-wide text-[#0D9488] uppercase dark:text-[#14B8A6]">
                        {project.kind[lang]}
                      </span>
                      <h3 className="mt-0.5 font-display text-lg font-bold text-[#11151B] transition group-hover:text-[#2563EB] dark:text-[#F3F5F7] dark:group-hover:text-[#14B8A6]">
                        {project.title}
                      </h3>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#2563EB] dark:group-hover:text-[#14B8A6]" />
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {project.description[lang]}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {project.tech.join(' · ')}
                    </span>
                    <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA]">
                      {project.actionLabel[lang]}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
