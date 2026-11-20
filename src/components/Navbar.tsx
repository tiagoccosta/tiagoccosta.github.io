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
    <header className="sticky top-0 z-40 border-b border-[#D2CFC5] bg-[#F2F1EC]/92 backdrop-blur-md transition-colors dark:border-[#272A30] dark:bg-[#0E0F11]/92">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="group flex items-center gap-3 text-[#141518] focus:outline-none dark:text-[#ECEEE9]"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6] font-mono text-xs font-semibold tracking-tight text-[#141518] transition group-hover:border-[#D94612] dark:border-[#272A30] dark:bg-[#151619] dark:text-[#ECEEE9] dark:group-hover:border-[#FF5A1F]">
            TC
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-[1px] bg-[#D94612] dark:bg-[#FF5A1F]" />
          </span>
          <div className="leading-tight">
            <span className="block font-mono text-xs font-semibold tracking-wider text-[#141518] uppercase dark:text-[#ECEEE9]">
              TIAGO_COSTA
            </span>
            <span className="block font-mono text-[10px] tracking-wider text-[#70757F] dark:text-[#6E747E]">
              UNITY / C# / PORTING
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-xs font-medium tracking-wide text-[#4B4F57] transition hover:text-[#D94612] dark:text-[#9A9FA8] dark:hover:text-[#FF5A1F]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Language switcher"
            className="inline-flex items-center rounded-[3px] border border-[#D2CFC5] bg-[#E7E5DD] p-0.5 dark:border-[#272A30] dark:bg-[#151619]"
          >
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              aria-pressed={lang === 'en'}
              className={`rounded-[2px] px-2 py-1 font-mono text-[11px] font-medium transition ${
                lang === 'en'
                  ? 'bg-[#FAF9F6] text-[#D94612] ring-1 ring-[#D94612]/40 dark:bg-[#1B1D21] dark:text-[#FF5A1F] dark:ring-[#FF5A1F]/45'
                  : 'text-[#4B4F57] hover:text-[#141518] dark:text-[#6E747E] dark:hover:text-[#ECEEE9]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('pt')}
              aria-pressed={lang === 'pt'}
              className={`rounded-[2px] px-2 py-1 font-mono text-[11px] font-medium transition ${
                lang === 'pt'
                  ? 'bg-[#FAF9F6] text-[#D94612] ring-1 ring-[#D94612]/40 dark:bg-[#1B1D21] dark:text-[#FF5A1F] dark:ring-[#FF5A1F]/45'
                  : 'text-[#4B4F57] hover:text-[#141518] dark:text-[#6E747E] dark:hover:text-[#ECEEE9]'
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
            className="inline-flex h-8 items-center gap-1.5 rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6] px-2.5 font-mono text-[11px] font-medium text-[#4B4F57] transition hover:border-[#A5A194] hover:text-[#141518] dark:border-[#272A30] dark:bg-[#151619] dark:text-[#9A9FA8] dark:hover:border-[#3E434D] dark:hover:text-[#ECEEE9]"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5 text-[#D4A338]" />
                <span className="hidden sm:inline">LIGHT</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-[#141518]" />
                <span className="hidden sm:inline">DARK</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6] text-[#4B4F57] transition hover:border-[#A5A194] hover:text-[#141518] dark:border-[#272A30] dark:bg-[#151619] dark:text-[#9A9FA8] dark:hover:border-[#3E434D] dark:hover:text-[#ECEEE9] md:hidden"
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
          className="border-t border-[#D2CFC5] bg-[#FAF9F6] px-4 py-3 dark:border-[#272A30] dark:bg-[#151619] md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className="rounded-[2px] px-3 py-2 font-mono text-xs font-medium text-[#4B4F57] transition hover:bg-[#E7E5DD] hover:text-[#D94612] dark:text-[#9A9FA8] dark:hover:bg-[#1B1D21] dark:hover:text-[#FF5A1F]"
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
