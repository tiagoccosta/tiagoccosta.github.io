import { useEffect, useMemo, useState } from 'react';
import { Award, Cpu, Layers, Maximize2, X } from 'lucide-react';
import {
  GAME_WORKS,
  GameCategory,
  GameWork,
  Language,
  UI_COPY,
} from '../data/portfolio';

interface GamesSectionProps {
  lang: Language;
}

export function GamesSection({ lang }: GamesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all');
  const [selectedGame, setSelectedGame] = useState<GameWork | null>(null);

  const copy = UI_COPY.games;

  const counts = useMemo(() => {
    return {
      all: GAME_WORKS.length,
      'console-pc': GAME_WORKS.filter((g) => g.categories.includes('console-pc')).length,
      'multiplayer-backend': GAME_WORKS.filter((g) =>
        g.categories.includes('multiplayer-backend')
      ).length,
      mobile: GAME_WORKS.filter((g) => g.categories.includes('mobile')).length,
      'ar-tools': GAME_WORKS.filter((g) => g.categories.includes('ar-tools')).length,
    };
  }, []);

  const filteredGames = useMemo(() => {
    if (activeCategory === 'all') {
      return GAME_WORKS;
    }
    return GAME_WORKS.filter((game) => game.categories.includes(activeCategory));
  }, [activeCategory]);

  useEffect(() => {
    if (!selectedGame) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedGame(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedGame]);

  return (
    <section id="games" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
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
        </div>

        <div
          className="mt-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter games by category"
        >
          {copy.filters.map((filter) => {
            const isActive = activeCategory === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(filter.id)}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition sm:text-sm ${
                  isActive
                    ? 'border-cyan-500/50 bg-cyan-500/12 text-cyan-800 shadow-xs dark:border-cyan-400/50 dark:bg-cyan-400/15 dark:text-cyan-200 dark:shadow-[0_0_20px_rgba(34,211,238,0.12)]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white'
                }`}
              >
                <span>{filter.label[lang]}</span>
                <span
                  className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-800 dark:bg-cyan-400/20 dark:text-cyan-200'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {counts[filter.id]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game, index) => (
            <article
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-slate-200/80 dark:border-slate-800/90 dark:bg-[#0D121E] dark:hover:border-cyan-400/45 dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-900 dark:bg-slate-950">
                <img
                  src={game.image}
                  alt={game.title}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  className="h-full w-full scale-[1.03] object-cover transition duration-500 group-hover:scale-[1.07]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15 dark:from-[#0D121E] dark:via-transparent dark:to-black/20" />

                {game.highlight && (
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-950/80 px-2.5 py-1 text-[11px] font-semibold text-amber-200 backdrop-blur-md">
                    <Award className="h-3.5 w-3.5 text-amber-300" />
                    {game.highlight[lang]}
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGame(game);
                  }}
                  aria-label={`${copy.viewDetails[lang]} — ${game.title}`}
                  className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-slate-950/75 text-slate-100 opacity-85 backdrop-blur-md transition group-hover:border-cyan-400/50 group-hover:text-cyan-200 group-hover:opacity-100"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap gap-1.5">
                  {game.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-cyan-800 dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-cyan-200/90"
                    >
                      {platform}
                    </span>
                  ))}
                </div>

                <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-slate-900 transition group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-200">
                  {game.title}
                </h3>

                <p className="mt-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                  {game.role[lang]}
                </p>

                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {game.description[lang]}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-200 pt-4 dark:border-slate-800/80">
                  {game.tech.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                  {game.tech.length > 3 && (
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      +{game.tech.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onClick={() => setSelectedGame(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700/80 dark:bg-[#0D1322]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <img
                src={selectedGame.image}
                alt={selectedGame.title}
                className="h-full w-full scale-[1.03] object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 dark:from-[#0D1322] dark:via-transparent dark:to-black/30" />

              <button
                type="button"
                onClick={() => setSelectedGame(null)}
                aria-label={copy.close[lang]}
                className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-slate-950/80 text-slate-200 backdrop-blur-md transition hover:border-cyan-400/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                {selectedGame.highlight && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-400/40 dark:text-amber-200">
                    <Award className="h-3.5 w-3.5 text-amber-600 dark:text-amber-300" />
                    {selectedGame.highlight[lang]}
                  </span>
                )}
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {selectedGame.subtitle[lang]}
                </span>
              </div>

              <h3
                id="project-modal-title"
                className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl"
              >
                {selectedGame.title}
              </h3>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
                  <Layers className="h-3.5 w-3.5" />
                  {copy.modalRole[lang]}
                </div>
                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                  {selectedGame.role[lang]}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {selectedGame.description[lang]}
                </p>
              </div>

              {selectedGame.technicalChallenge && (
                <div className="mt-4 rounded-2xl border border-indigo-500/20 bg-indigo-50/70 p-4 dark:border-indigo-400/25 dark:bg-indigo-500/10">
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                    <Cpu className="h-3.5 w-3.5" />
                    {copy.modalChallenge[lang]}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {selectedGame.technicalChallenge[lang]}
                  </p>
                </div>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {copy.modalPlatforms[lang]}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedGame.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-xs text-cyan-800 dark:border-cyan-400/30 dark:text-cyan-200"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {copy.modalTech[lang]}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedGame.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
