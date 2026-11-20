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
    <section id="games" className="py-18 sm:py-22">
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

        <div
          className="mt-6 flex flex-wrap gap-2"
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
                className={`inline-flex items-center gap-2 rounded-[3px] border px-3 py-1.5 font-mono text-xs font-medium transition ${
                  isActive
                    ? 'border-[#D94612] bg-[#D94612]/10 text-[#D94612] dark:border-[#FF5A1F] dark:bg-[#FF5A1F]/12 dark:text-[#FF5A1F]'
                    : 'border-[#D2CFC5] bg-[#FAF9F6] text-[#4B4F57] hover:border-[#A5A194] hover:text-[#141518] dark:border-[#272A30] dark:bg-[#151619] dark:text-[#9A9FA8] dark:hover:border-[#3E434D] dark:hover:text-[#ECEEE9]'
                }`}
              >
                <span>{filter.label[lang]}</span>
                <span className="text-[11px] opacity-75">[{counts[filter.id]}]</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game, index) => {
            const indexLabel = String(index + 1).padStart(2, '0');
            return (
              <article
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className="reticle-card group flex cursor-pointer flex-col overflow-hidden rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6] transition duration-200 hover:border-[#A5A194] dark:border-[#272A30] dark:bg-[#151619] dark:hover:border-[#3E434D]"
              >
                <div className="relative aspect-video overflow-hidden border-b border-[#D2CFC5] bg-[#141518] dark:border-[#272A30] dark:bg-[#0E0F11]">
                  <img
                    src={game.image}
                    alt={game.title}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    className="h-full w-full scale-[1.03] object-cover transition duration-500 group-hover:scale-[1.06]"
                  />

                  <span className="absolute bottom-2.5 left-2.5 rounded-[2px] border border-white/15 bg-[#0E0F11]/85 px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#ECEEE9] backdrop-blur-xs">
                    #{indexLabel}
                  </span>

                  {game.highlight && (
                    <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-[2px] border border-[#D4A338]/55 bg-[#0E0F11]/90 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-[#D4A338] uppercase backdrop-blur-xs">
                      <Award className="h-3 w-3" />
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
                    className="absolute top-2.5 right-2.5 inline-flex h-7 w-7 items-center justify-center rounded-[2px] border border-white/20 bg-[#0E0F11]/85 text-[#ECEEE9] opacity-85 backdrop-blur-xs transition group-hover:border-[#FF5A1F] group-hover:text-[#FF5A1F] group-hover:opacity-100"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap gap-1.5">
                    {game.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="rounded-[2px] border border-[#D2CFC5] bg-[#E7E5DD]/70 px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#141518] dark:border-[#272A30] dark:bg-[#1B1D21] dark:text-[#ECEEE9]"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>

                  <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-[#141518] transition group-hover:text-[#D94612] dark:text-[#ECEEE9] dark:group-hover:text-[#FF5A1F]">
                    {game.title}
                  </h3>

                  <p className="mt-1 font-mono text-[11px] font-medium text-[#70757F] dark:text-[#9A9FA8]">
                    {game.role[lang]}
                  </p>

                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-[#4B4F57] dark:text-[#9A9FA8]">
                    {game.description[lang]}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-[#D2CFC5] pt-3.5 dark:border-[#272A30]">
                    {game.tech.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="rounded-[2px] bg-[#E7E5DD] px-2 py-0.5 font-mono text-[10px] text-[#4B4F57] dark:bg-[#1B1D21] dark:text-[#9A9FA8]"
                      >
                        {item}
                      </span>
                    ))}
                    {game.tech.length > 3 && (
                      <span className="font-mono text-[10px] text-[#70757F] dark:text-[#6E747E]">
                        +{game.tech.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
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
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6] shadow-2xl dark:border-[#3E434D] dark:bg-[#151619]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full overflow-hidden border-b border-[#D2CFC5] bg-[#0E0F11] dark:border-[#272A30]">
              <img
                src={selectedGame.image}
                alt={selectedGame.title}
                className="h-full w-full scale-[1.03] object-cover"
              />

              <button
                type="button"
                onClick={() => setSelectedGame(null)}
                aria-label={copy.close[lang]}
                className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-white/20 bg-[#0E0F11]/85 text-[#ECEEE9] backdrop-blur-xs transition hover:border-[#FF5A1F] hover:text-[#FF5A1F]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                {selectedGame.highlight && (
                  <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-[#9A7012]/40 bg-[#9A7012]/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#9A7012] uppercase dark:border-[#D4A338]/40 dark:bg-[#D4A338]/10 dark:text-[#D4A338]">
                    <Award className="h-3.5 w-3.5" />
                    {selectedGame.highlight[lang]}
                  </span>
                )}
                <span className="font-mono text-xs text-[#70757F] dark:text-[#6E747E]">
                  {selectedGame.subtitle[lang]}
                </span>
              </div>

              <h3
                id="project-modal-title"
                className="mt-3 font-display text-2xl font-bold text-[#141518] dark:text-[#ECEEE9] sm:text-3xl"
              >
                {selectedGame.title}
              </h3>

              <div className="mt-4 rounded-[3px] border border-[#D2CFC5] bg-[#F2F1EC] p-4 dark:border-[#272A30] dark:bg-[#1B1D21]">
                <div className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-wider text-[#D94612] uppercase dark:text-[#FF5A1F]">
                  <Layers className="h-3.5 w-3.5" />
                  {copy.modalRole[lang]}
                </div>
                <p className="mt-1 text-sm font-semibold text-[#141518] dark:text-[#ECEEE9]">
                  {selectedGame.role[lang]}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#4B4F57] dark:text-[#9A9FA8]">
                  {selectedGame.description[lang]}
                </p>
              </div>

              {selectedGame.technicalChallenge && (
                <div className="mt-4 rounded-[3px] border border-[#D94612]/35 bg-[#D94612]/5 p-4 dark:border-[#FF5A1F]/35 dark:bg-[#FF5A1F]/5">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-wider text-[#D94612] uppercase dark:text-[#FF5A1F]">
                    <Cpu className="h-3.5 w-3.5" />
                    {copy.modalChallenge[lang]}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#141518] dark:text-[#ECEEE9]">
                    {selectedGame.technicalChallenge[lang]}
                  </p>
                </div>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="font-mono text-[11px] tracking-wider text-[#70757F] uppercase dark:text-[#6E747E]">
                    {copy.modalPlatforms[lang]}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedGame.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="rounded-[2px] border border-[#D94612]/35 bg-[#D94612]/8 px-2.5 py-1 font-mono text-xs text-[#D94612] dark:border-[#FF5A1F]/40 dark:bg-[#FF5A1F]/10 dark:text-[#FF5A1F]"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[11px] tracking-wider text-[#70757F] uppercase dark:text-[#6E747E]">
                    {copy.modalTech[lang]}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedGame.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-[2px] border border-[#D2CFC5] bg-[#E7E5DD] px-2.5 py-1 font-mono text-xs text-[#141518] dark:border-[#272A30] dark:bg-[#1B1D21] dark:text-[#ECEEE9]"
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
