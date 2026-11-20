import { useEffect, useState } from 'react';
import { AboutSkillsSection } from './components/AboutSkillsSection';
import { ContactFooter } from './components/ContactFooter';
import { EducationCertsSection } from './components/EducationCertsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { GamesSection } from './components/GamesSection';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { ParticleBurstOverlay } from './components/ParticleBurstOverlay';
import { ProjectsSection } from './components/ProjectsSection';
import { EXPERIENCE_ITEMS, Language, PAGE_TITLES, Theme } from './data/portfolio';
import { DEFAULT_FX_SETTINGS, FxSettings } from './utils/fxBus';

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
  const [fx, setFx] = useState<FxSettings>(DEFAULT_FX_SETTINGS);

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
      metaTheme.setAttribute('content', isDark ? '#101214' : '#F7F8FA');
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

  const handleToggleFx = (key: keyof FxSettings) => {
    setFx((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSetAllFx = (enabled: boolean) => {
    setFx({
      boidsTrailsObstacles: enabled,
      springMesh: enabled,
      signalNetwork: enabled,
      microBursts: enabled,
      contactParticles: enabled,
    });
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F7F8FA] text-[#11151B] transition-colors duration-200 dark:bg-[#101214] dark:text-[#F3F5F7]">
      <ParticleBurstOverlay theme={theme} enabled={fx.microBursts} />
      <Navbar
        lang={lang}
        onChangeLang={setLang}
        theme={theme}
        onToggleTheme={toggleTheme}
        hasExperience={EXPERIENCE_ITEMS.length > 0}
        fx={fx}
        onToggleFx={handleToggleFx}
        onSetAllFx={handleSetAllFx}
      />
      <main>
        <Hero
          lang={lang}
          theme={theme}
          enableTrailsAndObstacles={fx.boidsTrailsObstacles}
        />
        <GamesSection lang={lang} microBurstsEnabled={fx.microBursts} />
        <ExperienceSection lang={lang} />
        <AboutSkillsSection
          lang={lang}
          theme={theme}
          showSpringMesh={fx.springMesh}
        />
        <ProjectsSection
          lang={lang}
          theme={theme}
          showSignalNetwork={fx.signalNetwork}
        />
        <EducationCertsSection lang={lang} />
      </main>
      <ContactFooter
        lang={lang}
        theme={theme}
        showParticles={fx.contactParticles}
        microBurstsEnabled={fx.microBursts}
      />
    </div>
  );
}

export default App;
