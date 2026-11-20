import { ArrowDownRight, Gamepad2, MapPin } from 'lucide-react';
import {
  Language,
  SHIPPED_PLATFORMS,
  SOCIAL_LINKS,
  UI_COPY,
} from '../data/portfolio';
import { GitHubIcon, LinkedInIcon, UnityIcon } from './BrandIcons';

interface HeroProps {
  lang: Language;
}

export function Hero({ lang }: HeroProps) {
  const copy = UI_COPY.hero;

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-slate-200 bg-studio-grid dark:border-slate-800/70"
    >
      <div className="pointer-events-none absolute inset-0 bg-studio-radial" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-22 lg:px-8 lg:py-26">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-400/30 dark:text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 dark:bg-emerald-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              </span>
              {copy.badge[lang]}
            </div>

            <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300/90">
              Tiago C. Costa • {copy.role[lang]}
            </p>

            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
              {copy.headlinePrefix[lang]}{' '}
              <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent dark:from-cyan-300 dark:via-sky-300 dark:to-indigo-400">
                {copy.headlineHighlight[lang]}
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              {copy.pitch[lang]}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#games"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_24px_rgba(6,182,212,0.28)] transition hover:brightness-110 dark:from-cyan-400 dark:to-sky-400 dark:text-slate-950 dark:shadow-[0_0_28px_rgba(34,211,238,0.28)]"
              >
                <Gamepad2 className="h-4 w-4" />
                {copy.exploreCta[lang]}
                <ArrowDownRight className="h-4 w-4" />
              </a>

              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-xs transition hover:border-cyan-500/50 hover:text-cyan-700 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-cyan-400/50 dark:hover:text-cyan-200"
              >
                <LinkedInIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                LinkedIn
              </a>

              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-xs transition hover:border-slate-400 hover:text-slate-950 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
              >
                <GitHubIcon className="h-4 w-4" />
                GitHub
              </a>

              <a
                href={SOCIAL_LINKS.unityAssetStore}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-xs transition hover:border-indigo-500/50 hover:text-indigo-700 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-indigo-400/50 dark:hover:text-indigo-200"
              >
                <UnityIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                Asset Store
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 sm:max-w-lg sm:gap-4">
              {copy.stats.map((stat) => (
                <div
                  key={stat.value}
                  className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3.5 shadow-xs backdrop-blur-sm dark:border-slate-800/90 dark:bg-slate-900/60"
                >
                  <div className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {stat.label[lang]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur-md dark:border-slate-800 dark:bg-[#0E1422]/90 dark:shadow-2xl dark:shadow-black/50">
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-cyan-500/35 bg-slate-200 shadow-[0_0_24px_rgba(34,211,238,0.16)] dark:border-cyan-400/40 dark:bg-slate-800">
                  <img
                    src="images/perfil.jpg"
                    alt="Tiago C. Costa"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    Tiago C. Costa
                  </h2>
                  <p className="mt-0.5 text-sm font-medium text-cyan-700 dark:text-cyan-300">
                    {copy.role[lang]}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    {copy.location[lang]}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800/90">
                <div className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {copy.platformsLabel[lang]}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SHIPPED_PLATFORMS.map((platform) => (
                    <span
                      key={platform}
                      className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700 dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-slate-200"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/8 via-slate-100/80 to-cyan-500/10 p-4 dark:from-indigo-500/10 dark:via-slate-900/60 dark:to-cyan-500/10">
                <div className="font-mono text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  Core Stack
                </div>
                <p className="mt-1.5 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  Unity3D • C# • .NET Core • Java • AI Pipelines • PlayFab • Firebase
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
