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
                onClick={handleLinkClick}
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
