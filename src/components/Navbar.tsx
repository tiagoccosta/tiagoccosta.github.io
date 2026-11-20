import { useEffect, useRef, useState } from 'react';
import { Menu, Moon, Sparkles, Sun, X } from 'lucide-react';
import { Language, Theme, UI_COPY } from '../data/portfolio';
import { FxSettings } from '../utils/fxBus';

interface NavbarProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  theme: Theme;
  onToggleTheme: () => void;
  hasExperience: boolean;
  fx: FxSettings;
  onToggleFx: (key: keyof FxSettings) => void;
  onSetAllFx: (enabled: boolean) => void;
}

const FX_KEYS: Array<keyof FxSettings> = [
  'boidsTrailsObstacles',
  'springMesh',
  'signalNetwork',
  'microBursts',
  'contactParticles',
];

export function Navbar({
  lang,
  onChangeLang,
  theme,
  onToggleTheme,
  hasExperience,
  fx,
  onToggleFx,
  onSetAllFx,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fxOpen, setFxOpen] = useState(false);
  const fxContainerRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { href: '#games', label: UI_COPY.nav.games[lang] },
    ...(hasExperience
      ? [{ href: '#experience', label: UI_COPY.nav.experience[lang] }]
      : []),
    { href: '#about', label: UI_COPY.nav.about[lang] },
    { href: '#projects', label: UI_COPY.nav.projects[lang] },
    { href: '#education', label: UI_COPY.nav.education[lang] },
    { href: '#contact', label: UI_COPY.nav.contact[lang] },
  ];

  useEffect(() => {
    if (!fxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFxOpen(false);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (fxContainerRef.current && target && !fxContainerRef.current.contains(target)) {
        setFxOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [fxOpen]);

  const activeCount = FX_KEYS.filter((k) => fx[k]).length;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#F7F8FA]/85 backdrop-blur-xl transition-colors dark:border-white/8 dark:bg-[#101214]/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="group flex items-center gap-3 text-[#11151B] focus:outline-none dark:text-[#F3F5F7]"
        >
          <img
            src="images/perfil.jpg"
            alt="Tiago C. Costa"
            className="h-8 w-8 rounded-full border border-slate-300 object-cover transition group-hover:border-[#2563EB] dark:border-white/15 dark:group-hover:border-[#14B8A6]"
          />
          <div className="leading-tight">
            <span className="block font-display text-sm font-bold tracking-tight text-[#11151B] dark:text-[#F3F5F7]">
              Tiago Costa
            </span>
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Game Developer
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-[#2563EB] dark:text-slate-300 dark:hover:text-[#14B8A6]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Language switcher"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-white/10 dark:bg-[#16191D]"
          >
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              aria-pressed={lang === 'en'}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                lang === 'en'
                  ? 'bg-white text-[#2563EB] shadow-xs dark:bg-[#232830] dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('pt')}
              aria-pressed={lang === 'pt'}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                lang === 'pt'
                  ? 'bg-white text-[#2563EB] shadow-xs dark:bg-[#232830] dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              PT
            </button>
          </div>

          <div ref={fxContainerRef} className="relative">
            <button
              type="button"
              onClick={() => setFxOpen((prev) => !prev)}
              aria-expanded={fxOpen}
              aria-label={UI_COPY.fx.title[lang]}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition ${
                fxOpen || activeCount > 0
                  ? 'border-[#2563EB]/40 bg-white text-[#2563EB] dark:border-[#14B8A6]/40 dark:bg-[#16191D] dark:text-[#14B8A6]'
                  : 'border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-[#16191D] dark:text-slate-400'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{UI_COPY.fx.button[lang]}</span>
            </button>

            {fxOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-white/12 dark:bg-[#16191D]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-sm font-bold text-[#11151B] dark:text-[#F3F5F7]">
                      {UI_COPY.fx.title[lang]}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {UI_COPY.fx.subtitle[lang]}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-2 border-t border-slate-200 pt-3 dark:border-white/8">
                  {FX_KEYS.map((key) => {
                    const checked = fx[key];
                    return (
                      <label
                        key={key}
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                      >
                        <span>{UI_COPY.fx.items[key][lang]}</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleFx(key)}
                          className="h-4 w-4 accent-[#2563EB] dark:accent-[#14B8A6]"
                        />
                      </label>
                    );
                  })}
                </div>

                <div className="mt-3 flex gap-2 border-t border-slate-200 pt-3 dark:border-white/8">
                  <button
                    type="button"
                    onClick={() => onSetAllFx(true)}
                    className="flex-1 rounded-md bg-gradient-to-r from-[#2563EB] to-[#0D9488] px-2.5 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
                  >
                    {UI_COPY.fx.allOn[lang]}
                  </button>
                  <button
                    type="button"
                    onClick={() => onSetAllFx(false)}
                    className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-[#111418] dark:text-slate-300 dark:hover:bg-white/5"
                  >
                    {UI_COPY.fx.allOff[lang]}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'light'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-[#16191D] dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-[#C9A24D]" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-[#16191D] dark:text-slate-300 dark:hover:border-white/20 dark:hover:text-white md:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-slate-200 bg-[#F7F8FA] px-4 py-3 dark:border-white/10 dark:bg-[#14171B] md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200/70 hover:text-[#2563EB] dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-[#14B8A6]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
