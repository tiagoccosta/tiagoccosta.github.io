import { useState } from 'react';
import { ArrowDownRight, Crosshair, Gamepad2, MapPin, Pause, Play } from 'lucide-react';
import {
  Language,
  SHIPPED_PLATFORMS,
  SOCIAL_LINKS,
  Theme,
  UI_COPY,
} from '../data/portfolio';
import { BoidsCanvas } from './BoidsCanvas';
import { GitHubIcon, LinkedInIcon, UnityIcon } from './BrandIcons';

interface HeroProps {
  lang: Language;
  theme: Theme;
}

export function Hero({ lang, theme }: HeroProps) {
  const [paused, setPaused] = useState(false);
  const [showGizmos, setShowGizmos] = useState(true);
  const [interactionMode, setInteractionMode] = useState<'attract' | 'repel'>('attract');
  const [simStats, setSimStats] = useState({ fps: 60, count: 64 });

  const copy = UI_COPY.hero;

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-[#D2CFC5] bg-[#F2F1EC] bg-engine-grid dark:border-[#272A30] dark:bg-[#0E0F11]"
    >
      <BoidsCanvas
        theme={theme}
        paused={paused}
        showGizmos={showGizmos}
        interactionMode={interactionMode}
        onStatsUpdate={setSimStats}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6 sm:pt-16 sm:pb-10 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-[2px] border border-[#D2CFC5] bg-[#FAF9F6]/90 px-2.5 py-1 font-mono text-[11px] font-medium tracking-wider text-[#4B4F57] backdrop-blur-xs dark:border-[#272A30] dark:bg-[#151619]/90 dark:text-[#9A9FA8]">
              <span className="h-1.5 w-1.5 rounded-[1px] bg-[#D94612] dark:bg-[#FF5A1F]" />
              <span>{copy.badge[lang]}</span>
            </div>

            <p className="mt-5 font-mono text-xs font-medium tracking-[0.14em] text-[#D94612] uppercase dark:text-[#FF5A1F]">
              {copy.role[lang]}
            </p>

            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-[#141518] dark:text-[#ECEEE9] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.06]">
              {copy.headlinePrefix[lang]}{' '}
              <span className="underline decoration-[#D94612] decoration-2 underline-offset-[6px] dark:decoration-[#FF5A1F]">
                {copy.headlineHighlight[lang]}
              </span>
            </h1>

            <p className="mt-5 max-w-2xl rounded-[3px] border border-[#D2CFC5]/80 bg-[#FAF9F6]/80 p-4 text-sm leading-relaxed text-[#4B4F57] backdrop-blur-xs sm:text-base dark:border-[#272A30]/80 dark:bg-[#151619]/80 dark:text-[#9A9FA8]">
              {copy.pitch[lang]}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <a
                href="#games"
                className="inline-flex items-center gap-2 rounded-[3px] bg-[#D94612] px-4 py-2.5 font-mono text-xs font-semibold tracking-wide text-[#FAF9F6] uppercase transition hover:brightness-110 dark:bg-[#FF5A1F] dark:text-[#0E0F11]"
              >
                <Gamepad2 className="h-4 w-4" />
                {copy.exploreCta[lang]}
                <ArrowDownRight className="h-4 w-4" />
              </a>

              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6]/90 px-3.5 py-2.5 font-mono text-xs font-medium text-[#141518] backdrop-blur-xs transition hover:border-[#D94612] dark:border-[#272A30] dark:bg-[#151619]/90 dark:text-[#ECEEE9] dark:hover:border-[#FF5A1F]"
              >
                <LinkedInIcon className="h-3.5 w-3.5 text-[#4B4F57] dark:text-[#9A9FA8]" />
                LinkedIn
              </a>

              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6]/90 px-3.5 py-2.5 font-mono text-xs font-medium text-[#141518] backdrop-blur-xs transition hover:border-[#D94612] dark:border-[#272A30] dark:bg-[#151619]/90 dark:text-[#ECEEE9] dark:hover:border-[#FF5A1F]"
              >
                <GitHubIcon className="h-3.5 w-3.5 text-[#4B4F57] dark:text-[#9A9FA8]" />
                GitHub
              </a>

              <a
                href={SOCIAL_LINKS.unityAssetStore}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6]/90 px-3.5 py-2.5 font-mono text-xs font-medium text-[#141518] backdrop-blur-xs transition hover:border-[#D94612] dark:border-[#272A30] dark:bg-[#151619]/90 dark:text-[#ECEEE9] dark:hover:border-[#FF5A1F]"
              >
                <UnityIcon className="h-3.5 w-3.5 text-[#4B4F57] dark:text-[#9A9FA8]" />
                Asset Store
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6]/92 backdrop-blur-sm dark:border-[#272A30] dark:bg-[#151619]/92">
              <div className="flex items-center justify-between border-b border-[#D2CFC5] px-4 py-2 font-mono text-[10px] tracking-wider text-[#70757F] uppercase dark:border-[#272A30] dark:text-[#6E747E]">
                <span>ENGINEER_INSPECTOR</span>
                <span>ID // TCC-SP</span>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[2px] border border-[#D2CFC5] bg-[#E7E5DD] dark:border-[#272A30] dark:bg-[#1B1D21]">
                    <img
                      src="images/perfil.jpg"
                      alt="Tiago C. Costa"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold tracking-tight text-[#141518] dark:text-[#ECEEE9]">
                      Tiago C. Costa
                    </h2>
                    <p className="mt-0.5 font-mono text-xs font-medium text-[#D94612] dark:text-[#FF5A1F]">
                      {copy.role[lang]}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-[#4B4F57] dark:text-[#9A9FA8]">
                      <MapPin className="h-3 w-3 text-[#70757F] dark:text-[#6E747E]" />
                      {copy.location[lang]}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-[#D2CFC5] pt-4 dark:border-[#272A30]">
                  <div className="font-mono text-[10px] tracking-wider text-[#70757F] uppercase dark:text-[#6E747E]">
                    {copy.platformsLabel[lang]}
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {SHIPPED_PLATFORMS.map((platform) => (
                      <span
                        key={platform}
                        className="rounded-[2px] border border-[#D2CFC5] bg-[#E7E5DD]/70 px-2 py-0.5 font-mono text-[11px] text-[#141518] dark:border-[#272A30] dark:bg-[#1B1D21] dark:text-[#ECEEE9]"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-[#D2CFC5] pt-4 dark:border-[#272A30]">
                  <div className="font-mono text-[10px] tracking-wider text-[#70757F] uppercase dark:text-[#6E747E]">
                    CORE_STACK
                  </div>
                  <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-[#4B4F57] dark:text-[#9A9FA8]">
                    Unity3D • C# • .NET Core • Java • AI Pipelines • PlayFab • Firebase
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spec Strip */}
        <div className="mt-10 grid divide-y divide-[#D2CFC5] rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6]/90 backdrop-blur-xs sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-[#272A30] dark:border-[#272A30] dark:bg-[#151619]/90">
          {copy.stats.map((stat) => (
            <div key={stat.key} className="flex items-baseline justify-between gap-4 px-4 py-3">
              <div>
                <span className="block font-mono text-[10px] tracking-wider text-[#70757F] uppercase dark:text-[#6E747E]">
                  {stat.key}
                </span>
                <span className="mt-0.5 block text-xs text-[#4B4F57] dark:text-[#9A9FA8]">
                  {stat.label[lang]}
                </span>
              </div>
              <span className="font-mono text-lg font-semibold tracking-tight text-[#141518] dark:text-[#ECEEE9]">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Interactive Boids Viewport Controls */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[3px] border border-[#D2CFC5] bg-[#E7E5DD]/85 px-3.5 py-2 font-mono text-[11px] backdrop-blur-xs dark:border-[#272A30] dark:bg-[#151619]/85">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#4B4F57] dark:text-[#9A9FA8]">
            <span className="font-semibold text-[#141518] dark:text-[#ECEEE9]">
              {copy.sim.label[lang]}
            </span>
            <span className="text-[#70757F] dark:text-[#6E747E]">•</span>
            <span>
              {simStats.count} {copy.sim.agents[lang]}
            </span>
            <span className="text-[#70757F] dark:text-[#6E747E]">•</span>
            <span>{paused ? 'PAUSED' : `${simStats.fps} FPS`}</span>
            <span className="hidden text-[#70757F] lg:inline dark:text-[#6E747E]">
              — {copy.sim.pointerHint[lang]}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <div className="inline-flex rounded-[2px] border border-[#D2CFC5] bg-[#FAF9F6] p-0.5 dark:border-[#272A30] dark:bg-[#0E0F11]">
              <button
                type="button"
                onClick={() => setInteractionMode('attract')}
                aria-pressed={interactionMode === 'attract'}
                className={`rounded-[2px] px-2 py-0.5 text-[10px] font-medium uppercase transition ${
                  interactionMode === 'attract'
                    ? 'bg-[#D94612] text-[#FAF9F6] dark:bg-[#FF5A1F] dark:text-[#0E0F11]'
                    : 'text-[#4B4F57] hover:text-[#141518] dark:text-[#9A9FA8] dark:hover:text-[#ECEEE9]'
                }`}
              >
                {copy.sim.attract[lang]}
              </button>
              <button
                type="button"
                onClick={() => setInteractionMode('repel')}
                aria-pressed={interactionMode === 'repel'}
                className={`rounded-[2px] px-2 py-0.5 text-[10px] font-medium uppercase transition ${
                  interactionMode === 'repel'
                    ? 'bg-[#D94612] text-[#FAF9F6] dark:bg-[#FF5A1F] dark:text-[#0E0F11]'
                    : 'text-[#4B4F57] hover:text-[#141518] dark:text-[#9A9FA8] dark:hover:text-[#ECEEE9]'
                }`}
              >
                {copy.sim.repel[lang]}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowGizmos((prev) => !prev)}
              aria-pressed={showGizmos}
              className={`inline-flex items-center gap-1 rounded-[2px] border px-2 py-1 text-[10px] font-medium uppercase transition ${
                showGizmos
                  ? 'border-[#D94612]/60 bg-[#D94612]/12 text-[#D94612] dark:border-[#FF5A1F]/60 dark:bg-[#FF5A1F]/15 dark:text-[#FF5A1F]'
                  : 'border-[#D2CFC5] bg-[#FAF9F6] text-[#4B4F57] hover:text-[#141518] dark:border-[#272A30] dark:bg-[#0E0F11] dark:text-[#9A9FA8] dark:hover:text-[#ECEEE9]'
              }`}
            >
              <Crosshair className="h-3 w-3" />
              {copy.sim.gizmos[lang]}
            </button>

            <button
              type="button"
              onClick={() => setPaused((prev) => !prev)}
              aria-pressed={paused}
              className="inline-flex items-center gap-1 rounded-[2px] border border-[#D2CFC5] bg-[#FAF9F6] px-2 py-1 text-[10px] font-medium text-[#141518] uppercase transition hover:border-[#A5A194] dark:border-[#272A30] dark:bg-[#0E0F11] dark:text-[#ECEEE9] dark:hover:border-[#3E434D]"
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
