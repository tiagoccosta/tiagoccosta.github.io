import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Language, Theme, UI_COPY } from '../data/portfolio';

interface NavbarProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  theme: Theme;
  onToggleTheme: () => void;
  hasExperience: boolean;
}

export function Navbar({
  lang,
  onChangeLang,
  theme,
  onToggleTheme,
  hasExperience,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-colors dark:border-slate-800/70 dark:bg-[#07090F]/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="group flex items-center gap-2.5 text-slate-900 focus:outline-none dark:text-slate-100"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/35 bg-gradient-to-br from-cyan-500/15 to-indigo-500/15 font-display text-sm font-bold tracking-tight text-cyan-700 transition group-hover:border-cyan-500/60 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] dark:border-cyan-400/35 dark:from-cyan-500/20 dark:to-indigo-500/20 dark:text-cyan-300">
            TC
          </span>
          <div className="leading-tight">
            <span className="block font-display text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Tiago C. Costa
            </span>
            <span className="block font-mono text-[11px] text-slate-500 dark:text-slate-400">
              Unity • C# • Porting
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div
            role="group"
            aria-label="Language switcher"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-900/90"
          >
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              aria-pressed={lang === 'en'}
              className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition ${
                lang === 'en'
                  ? 'bg-white text-cyan-700 shadow-xs ring-1 ring-cyan-500/30 dark:bg-cyan-400/20 dark:text-cyan-200 dark:shadow-inner dark:ring-cyan-400/40'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('pt')}
              aria-pressed={lang === 'pt'}
              className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition ${
                lang === 'pt'
                  ? 'bg-white text-cyan-700 shadow-xs ring-1 ring-cyan-500/30 dark:bg-cyan-400/20 dark:text-cyan-200 dark:shadow-inner dark:ring-cyan-400/40'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              PT
            </button>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'light'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-300" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white md:hidden"
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
          className="border-t border-slate-200 bg-white/95 px-4 py-4 dark:border-slate-800/80 dark:bg-[#0A0E18]/95 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-cyan-700 dark:text-slate-200 dark:hover:bg-slate-800/60 dark:hover:text-cyan-300"
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
