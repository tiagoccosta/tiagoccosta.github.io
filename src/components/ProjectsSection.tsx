import { ArrowUpRight, Brain, Boxes, Network } from 'lucide-react';
import { Language, PERSONAL_PROJECTS, UI_COPY } from '../data/portfolio';

interface ProjectsSectionProps {
  lang: Language;
}

function getFallbackIcon(id: string) {
  if (id === 'tnet') return Network;
  if (id === 'vbrain') return Brain;
  return Boxes;
}

export function ProjectsSection({ lang }: ProjectsSectionProps) {
  const copy = UI_COPY.projects;

  return (
    <section id="projects" className="border-t border-slate-200 py-20 sm:py-24 dark:border-slate-800/70">
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

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAL_PROJECTS.map((project) => {
            const FallbackIcon = getFallbackIcon(project.id);
            return (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-0.5 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-slate-200/70 dark:border-slate-800 dark:bg-[#0D121E] dark:hover:border-cyan-400/45 dark:hover:bg-[#101726] dark:hover:shadow-none"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {project.iconImage ? (
                      <img
                        src={project.iconImage}
                        alt={project.title}
                        loading="lazy"
                        className="h-12 w-12 rounded-xl border border-slate-200 object-cover dark:border-slate-700/80"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-600 dark:border-indigo-400/30 dark:text-indigo-300">
                        <FallbackIcon className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <span className="block font-mono text-[11px] uppercase tracking-wider text-cyan-700 dark:text-cyan-300/90">
                        {project.kind[lang]}
                      </span>
                      <h3 className="mt-0.5 font-display text-lg font-bold text-slate-900 transition group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-200">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-600 dark:text-slate-500 dark:group-hover:text-cyan-300" />
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {project.description[lang]}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4 dark:border-slate-800/80">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((item) => (
                      <span
                        key={item}
                        className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-xs font-medium text-cyan-700 dark:text-cyan-300">
                    {project.actionLabel[lang]}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
