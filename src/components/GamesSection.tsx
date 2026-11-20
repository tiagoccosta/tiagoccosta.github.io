import { useEffect, useMemo, useState } from 'react';
import { Award, ChevronRight, Cpu, Layers, X } from 'lucide-react';
import {
  FEATURED_GAME_IDS,
  GAME_WORKS,
  GameCategory,
  GameWork,
  Language,
  UI_COPY,
} from '../data/portfolio';
import { triggerBurstFromElement } from '../utils/fxBus';

interface GamesSectionProps {
  lang: Language;
  microBurstsEnabled: boolean;
}

export function GamesSection({ lang, microBurstsEnabled }: GamesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [selectedGame, setSelectedGame] = useState<GameWork | null>(null);

  const copy = UI_COPY.games;

  const featuredGames = useMemo(() => {
    const map = new Map(GAME_WORKS.map((g) => [g.id, g]));
    return FEATURED_GAME_IDS.map((id) => map.get(id)).filter(
      (g): g is GameWork => Boolean(g)
    );
  }, []);

  const currentFeatured = featuredGames[featuredIndex] ?? GAME_WORKS[0];

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
    <section id="games" className="py-16 sm:py-22">
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

        {/* Spotlight Featured Stage */}
        {currentFeatured && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                {copy.featuredLabel[lang]}
              </h3>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#16191D]">
              <div className="grid lg:grid-cols-12">
                <div
                  onClick={() => setSelectedGame(currentFeatured)}
                  className="group relative aspect-video cursor-pointer overflow-hidden bg-slate-950 lg:col-span-7 lg:aspect-auto lg:min-h-[340px]"
                >
                  <img
                    src={currentFeatured.image}
                    alt={currentFeatured.title}
                    className="h-full w-full scale-[1.03] object-cover transition duration-500 group-hover:scale-[1.06]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/20" />

                  {currentFeatured.highlight && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (microBurstsEnabled) {
                          triggerBurstFromElement(e.currentTarget, 'gold', 18);
                        }
                      }}
                      className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full border border-[#C9A24D]/50 bg-[#101214]/85 px-3 py-1 text-xs font-semibold text-[#E2C275] backdrop-blur-md transition hover:border-[#E2C275]"
                    >
                      <Award className="h-3.5 w-3.5 text-[#C9A24D]" />
                      {currentFeatured.highlight[lang]}
                    </button>
                  )}
                </div>

                <div className="flex flex-col justify-between p-5 sm:p-7 lg:col-span-5">
                  <div>
                    <div className="text-xs font-medium text-[#0D9488] dark:text-[#14B8A6]">
                      {currentFeatured.subtitle[lang]}
                    </div>

                    <h4 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#11151B] sm:text-3xl dark:text-[#F3F5F7]">
                      {currentFeatured.title}
                    </h4>

                    <p className="mt-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                      {currentFeatured.role[lang]}
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {currentFeatured.description[lang]}
                    </p>
                  </div>

                  <div className="mt-6">
                    <div className="flex flex-wrap gap-1.5">
                      {currentFeatured.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-white/6 dark:text-slate-200"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedGame(currentFeatured)}
                      className="mt-5 inline-flex min-h-[42px] items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#0D9488] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                    >
                      <span>{copy.viewDetails[lang]}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Thumbnail switcher */}
              <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-slate-50/80 p-2.5 sm:grid-cols-4 dark:border-white/8 dark:bg-[#111418]">
                {featuredGames.map((item, idx) => {
                  const active = idx === featuredIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={(e) => {
                        setFeaturedIndex(idx);
                        if (microBurstsEnabled && idx !== featuredIndex) {
                          triggerBurstFromElement(
                            e.currentTarget,
                            item.highlight ? 'gold' : 'brand',
                            15
                          );
                        }
                      }}
                      className={`group relative flex items-center gap-2.5 overflow-hidden rounded-lg border p-2 text-left transition ${
                        active
                          ? 'border-[#2563EB]/60 bg-white shadow-xs dark:border-[#14B8A6]/60 dark:bg-[#1A1E24]'
                          : 'border-transparent hover:bg-white/60 dark:hover:bg-white/4'
                      }`}
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="h-9 w-16 shrink-0 rounded object-cover"
                      />
                      <div className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-[#11151B] dark:text-[#F3F5F7]">
                          {item.title}
                        </span>
                        <span className="block truncate text-[11px] text-slate-500 dark:text-slate-400">
                          {item.platforms.slice(0, 2).join(' · ')}
                        </span>
                      </div>
                      {active && (
                        <span className="absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#2563EB] to-[#0D9488]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Complete Game Library */}
        <div className="mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              {copy.libraryLabel[lang]}
            </h3>

            <div
              className="flex gap-2 overflow-x-auto pb-1 no-scrollbar"
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
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? 'border-transparent bg-gradient-to-r from-[#2563EB] to-[#0D9488] text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-[#16191D] dark:text-slate-300 dark:hover:border-white/25 dark:hover:text-white'
                    }`}
                  >
                    <span>{filter.label[lang]}</span>
                    <span className="opacity-80">({counts[filter.id]})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map((game, index) => (
              <article
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#2563EB]/50 hover:shadow-md dark:border-white/8 dark:bg-[#16191D] dark:hover:border-[#14B8A6]/50"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={game.image}
                    alt={game.title}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    className="h-full w-full scale-[1.03] object-cover transition duration-500 group-hover:scale-[1.07]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                  {game.highlight && (
                    <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full border border-[#C9A24D]/50 bg-[#101214]/85 px-2.5 py-0.5 text-[11px] font-semibold text-[#E2C275] backdrop-blur-md">
                      <Award className="h-3 w-3 text-[#C9A24D]" />
                      {game.highlight[lang]}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h4 className="font-display text-lg font-bold tracking-tight text-[#11151B] transition group-hover:text-[#2563EB] dark:text-[#F3F5F7] dark:group-hover:text-[#14B8A6]">
                      {game.title}
                    </h4>
                    <p className="mt-0.5 line-clamp-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {game.role[lang]}
                    </p>
                  </div>

                  <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {game.platforms.join(' · ')}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {selectedGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onClick={() => setSelectedGame(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/12 dark:bg-[#16191D]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <img
                src={selectedGame.image}
                alt={selectedGame.title}
                className="h-full w-full scale-[1.03] object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />

              <button
                type="button"
                onClick={() => setSelectedGame(null)}
                aria-label={copy.close[lang]}
                className="absolute top-3.5 right-3.5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#101214]/80 text-white backdrop-blur-md transition hover:border-white/50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                {selectedGame.highlight && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A24D]/40 bg-[#C9A24D]/12 px-2.5 py-0.5 text-xs font-semibold text-[#9A7422] dark:text-[#E2C275]">
                    <Award className="h-3.5 w-3.5 text-[#C9A24D]" />
                    {selectedGame.highlight[lang]}
                  </span>
                )}
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {selectedGame.subtitle[lang]}
                </span>
              </div>

              <h3
                id="project-modal-title"
                className="mt-2.5 font-display text-2xl font-bold text-[#11151B] sm:text-3xl dark:text-[#F3F5F7]"
              >
                {selectedGame.title}
              </h3>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/8 dark:bg-[#111418]">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#2563EB] uppercase dark:text-[#60A5FA]">
                  <Layers className="h-3.5 w-3.5" />
                  {copy.modalRole[lang]}
                </div>
                <p className="mt-1 text-sm font-semibold text-[#11151B] dark:text-[#F3F5F7]">
                  {selectedGame.role[lang]}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {selectedGame.description[lang]}
                </p>
              </div>

              {selectedGame.technicalChallenge && (
                <div className="mt-4 rounded-xl border border-[#0D9488]/25 bg-[#0D9488]/5 p-4 dark:border-[#14B8A6]/30 dark:bg-[#14B8A6]/8">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0D9488] uppercase dark:text-[#14B8A6]">
                    <Cpu className="h-3.5 w-3.5" />
                    {copy.modalChallenge[lang]}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#11151B] dark:text-[#F3F5F7]">
                    {selectedGame.technicalChallenge[lang]}
                  </p>
                </div>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    {copy.modalPlatforms[lang]}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedGame.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="rounded-md bg-[#2563EB]/10 px-2.5 py-1 text-xs font-medium text-[#2563EB] dark:bg-[#3B82F6]/15 dark:text-[#60A5FA]"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    {copy.modalTech[lang]}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedGame.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-white/8 dark:text-slate-200"
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
