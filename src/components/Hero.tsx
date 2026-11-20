import { useState } from 'react';
import { ArrowDownRight, Crosshair, Gamepad2, MapPin, Pause, Play } from 'lucide-react';
import {
  Language,
  SHIPPED_PLATFORMS,
  SOCIAL_LINKS,
  Theme,
  UI_COPY,
} from '../data/portfolio';
import { BoidsCanvas, BoidsStats } from './BoidsCanvas';
import { GitHubIcon, LinkedInIcon, UnityIcon } from './BrandIcons';

interface HeroProps {
  lang: Language;
  theme: Theme;
  enableTrailsAndObstacles: boolean;
}

export function Hero({ lang, theme, enableTrailsAndObstacles }: HeroProps) {
  const [paused, setPaused] = useState(false);
  const [showGizmos, setShowGizmos] = useState(false);
  const [interactionMode, setInteractionMode] = useState<'attract' | 'repel'>('attract');
  const [simStats, setSimStats] = useState<BoidsStats>({
    fps: 60,
    prey: 40,
    eggs: 0,
    food: 6,
  });

  const copy = UI_COPY.hero;

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-slate-200/80 bg-[#F7F8FA] studio-hero-wash dark:border-white/8 dark:bg-[#101214]"
    >
      <BoidsCanvas
        theme={theme}
        paused={paused}
        showGizmos={showGizmos}
        interactionMode={interactionMode}
        enableTrailsAndObstacles={enableTrailsAndObstacles}
        onStatsUpdate={setSimStats}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20 sm:pb-12 lg:px-8">
        <div className="max-w-3xl">
          <div
            data-boid-obstacle="true"
            className="inline-flex flex-wrap items-center gap-4"
          >
            <img
              src="images/perfil.jpg"
              alt="Tiago C. Costa"
              className="h-14 w-14 rounded-2xl border border-slate-300 object-cover shadow-sm sm:h-16 sm:w-16 dark:border-white/15"
            />
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-display text-lg font-bold text-[#11151B] dark:text-[#F3F5F7]">
                  Tiago C. Costa
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-[#0D9488] dark:text-[#14B8A6]" />
                  {copy.location[lang]}
                </span>
              </div>
              <p className="mt-0.5 text-sm font-medium text-[#2563EB] dark:text-[#60A5FA]">
                {copy.role[lang]}
              </p>
            </div>
          </div>

          <h1 className="mt-7 font-display text-4xl font-extrabold tracking-tight text-[#11151B] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.06] dark:text-[#F3F5F7]">
            {copy.headlinePrefix[lang]}{' '}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#0D9488] bg-clip-text text-transparent dark:from-[#3B82F6] dark:to-[#14B8A6]">
              {copy.headlineHighlight[lang]}
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
            {copy.pitch[lang]}
          </p>

          <p className="mt-4 text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
            <span className="mr-2 text-slate-400 dark:text-slate-500">
              {copy.platformsLabel[lang]}:
            </span>
            {SHIPPED_PLATFORMS.join(' · ')}
          </p>

          <div
            data-boid-obstacle="true"
            className="mt-8 inline-flex flex-wrap items-center gap-3"
          >
            <a
              href="#games"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#0D9488] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              <Gamepad2 className="h-4 w-4" />
              {copy.exploreCta[lang]}
              <ArrowDownRight className="h-4 w-4" />
            </a>

            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 bg-white/85 px-4 py-2.5 text-sm font-medium text-slate-700 backdrop-blur-xs transition hover:border-[#2563EB]/60 hover:text-[#2563EB] dark:border-white/12 dark:bg-[#16191D]/85 dark:text-slate-200 dark:hover:border-[#3B82F6]/60 dark:hover:text-white"
            >
              <LinkedInIcon className="h-4 w-4 text-[#2563EB] dark:text-[#60A5FA]" />
              LinkedIn
            </a>

            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 bg-white/85 px-4 py-2.5 text-sm font-medium text-slate-700 backdrop-blur-xs transition hover:border-slate-400 hover:text-slate-950 dark:border-white/12 dark:bg-[#16191D]/85 dark:text-slate-200 dark:hover:border-white/30 dark:hover:text-white"
            >
              <GitHubIcon className="h-4 w-4" />
              GitHub
            </a>

            <a
              href={SOCIAL_LINKS.unityAssetStore}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 bg-white/85 px-4 py-2.5 text-sm font-medium text-slate-700 backdrop-blur-xs transition hover:border-[#0D9488]/60 hover:text-[#0D9488] dark:border-white/12 dark:bg-[#16191D]/85 dark:text-slate-200 dark:hover:border-[#14B8A6]/60 dark:hover:text-white"
            >
              <UnityIcon className="h-4 w-4 text-[#0D9488] dark:text-[#14B8A6]" />
              Asset Store
            </a>
          </div>
        </div>

        {/* Discreet Boids interactive bar */}
        <div className="mt-12 flex flex-col gap-2.5 border-t border-slate-200/80 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-white/8 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {copy.sim.label[lang]}
            </span>
            <span>·</span>
            <span>
              {simStats.prey} {copy.sim.prey[lang]}
            </span>
            <span>·</span>
            <span>
              {simStats.eggs} {copy.sim.eggs[lang]}
            </span>
            <span>·</span>
            <span>{copy.sim.predator[lang]}</span>
            <span>·</span>
            <span>{paused ? copy.sim.pause[lang] : `${simStats.fps} fps`}</span>
            <span className="hidden lg:inline text-slate-400 dark:text-slate-500">
              — {copy.sim.pointerHint[lang]}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <div className="inline-flex rounded-md border border-slate-200 bg-white/80 p-0.5 dark:border-white/10 dark:bg-[#16191D]/80">
              <button
                type="button"
                onClick={() => setInteractionMode('attract')}
                aria-pressed={interactionMode === 'attract'}
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition ${
                  interactionMode === 'attract'
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {copy.sim.attract[lang]}
              </button>
              <button
                type="button"
                onClick={() => setInteractionMode('repel')}
                aria-pressed={interactionMode === 'repel'}
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition ${
                  interactionMode === 'repel'
                    ? 'bg-[#0D9488] text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {copy.sim.repel[lang]}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowGizmos((prev) => !prev)}
              aria-pressed={showGizmos}
              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition ${
                showGizmos
                  ? 'border-[#0D9488]/60 bg-[#0D9488]/12 text-[#0D9488] dark:border-[#14B8A6]/50 dark:text-[#14B8A6]'
                  : 'border-slate-200 bg-white/80 text-slate-600 hover:text-slate-900 dark:border-white/10 dark:bg-[#16191D]/80 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Crosshair className="h-3 w-3" />
              {copy.sim.vectors[lang]}
            </button>

            <button
              type="button"
              onClick={() => setPaused((prev) => !prev)}
              aria-pressed={paused}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition hover:text-slate-900 dark:border-white/10 dark:bg-[#16191D]/80 dark:text-slate-300 dark:hover:text-white"
            >
              {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              {paused ? copy.sim.play[lang] : copy.sim.pause[lang]}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
