import { useEffect, useState } from 'react';
import { AboutSkillsSection } from './components/AboutSkillsSection';
import { ContactFooter } from './components/ContactFooter';
import { EducationCertsSection } from './components/EducationCertsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { GamesSection } from './components/GamesSection';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { ProjectsSection } from './components/ProjectsSection';
import { EXPERIENCE_ITEMS, Language, PAGE_TITLES, Theme } from './data/portfolio';

const LANG_STORAGE_KEY = 'portfolio_lang';
const THEME_STORAGE_KEY = 'portfolio_theme';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'pt') {
      return saved;
    }
  } catch {
    // Ignore storage access errors in restricted browsers.
  }
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    // Ignore storage access errors in restricted browsers.
  }
  return 'dark';
}

export function App() {
  const [lang, setLang] = useState<Language>(getInitialLanguage);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = PAGE_TITLES[lang];
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage access errors.
    }
  }, [lang]);

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', isDark ? '#0E0F11' : '#F2F1EC');
    }
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage access errors.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-[#F2F1EC] text-[#141518] transition-colors duration-200 dark:bg-[#0E0F11] dark:text-[#ECEEE9]">
      <Navbar
        lang={lang}
        onChangeLang={setLang}
        theme={theme}
        onToggleTheme={toggleTheme}
        hasExperience={EXPERIENCE_ITEMS.length > 0}
      />
      <main>
        <Hero lang={lang} theme={theme} />
        <GamesSection lang={lang} />
        <ExperienceSection lang={lang} />
        <AboutSkillsSection lang={lang} />
        <ProjectsSection lang={lang} />
        <EducationCertsSection lang={lang} />
      </main>
      <ContactFooter lang={lang} theme={theme} />
    </div>
  );
}

export default App;
