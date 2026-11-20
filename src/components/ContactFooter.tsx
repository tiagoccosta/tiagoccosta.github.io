import { MouseEvent, useState } from 'react';
import { Check, Copy, Mail, MapPin } from 'lucide-react';
import {
  getContactEmail,
  Language,
  SOCIAL_LINKS,
  Theme,
  UI_COPY,
} from '../data/portfolio';
import { triggerBurstFromElement } from '../utils/fxBus';
import { GitHubIcon, LinkedInIcon, UnityIcon } from './BrandIcons';
import { ParticleFieldCanvas } from './ParticleFieldCanvas';

interface ContactFooterProps {
  lang: Language;
  theme: Theme;
  showParticles: boolean;
  microBurstsEnabled: boolean;
}

export function ContactFooter({
  lang,
  theme,
  showParticles,
  microBurstsEnabled,
}: ContactFooterProps) {
  const [copied, setCopied] = useState(false);
  const copy = UI_COPY.contact;
  const heroCopy = UI_COPY.hero;
  const email = getContactEmail();

  const handleCopyEmail = async (event: MouseEvent<HTMLButtonElement>) => {
    const buttonEl = event.currentTarget;
    if (microBurstsEnabled) {
      triggerBurstFromElement(buttonEl, 'brand', 20);
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <>
      <section
        id="contact"
        className="border-t border-slate-200/80 py-16 sm:py-22 dark:border-white/8"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 dark:border-white/10 dark:bg-[#16191D]">
            <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-[#2563EB] via-[#0D9488] to-[#2563EB]" />
            {showParticles && <ParticleFieldCanvas theme={theme} />}

            <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <p className="text-xs font-semibold tracking-widest text-[#2563EB] uppercase dark:text-[#14B8A6]">
                  {copy.eyebrow[lang]}
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#11151B] sm:text-4xl dark:text-[#F3F5F7]">
                  {copy.title[lang]}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                  {copy.subtitle[lang]}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#0D9488] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        {copy.copied[lang]}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        {copy.copyEmail[lang]}
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${email}`}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 bg-white/90 px-4 py-2.5 text-sm font-medium text-slate-700 backdrop-blur-xs transition hover:border-[#2563EB]/60 hover:text-[#2563EB] dark:border-white/12 dark:bg-[#111418]/90 dark:text-slate-200 dark:hover:border-[#14B8A6]/60 dark:hover:text-white"
                  >
                    <Mail className="h-4 w-4 text-[#2563EB] dark:text-[#14B8A6]" />
                    {copy.sendEmail[lang]}
                  </a>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200 bg-[#F7F8FA]/92 p-5 backdrop-blur-xs lg:col-span-5 dark:border-white/10 dark:bg-[#101214]/90">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-white/8">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Email
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="text-sm font-medium text-[#2563EB] hover:underline dark:text-[#60A5FA]"
                  >
                    {email}
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-white/8">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {copy.locationLabel[lang]}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-[#11151B] dark:text-[#F3F5F7]">
                    <MapPin className="h-3.5 w-3.5 text-[#0D9488] dark:text-[#14B8A6]" />
                    {heroCopy.location[lang]}
                  </span>
                </div>

                <div className="pt-1">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={SOCIAL_LINKS.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-[#2563EB]/60 hover:text-[#2563EB] dark:border-white/10 dark:bg-[#16191D] dark:text-slate-200 dark:hover:border-[#3B82F6]/60 dark:hover:text-white"
                    >
                      <LinkedInIcon className="h-3.5 w-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
                      LinkedIn
                    </a>

                    <a
                      href={SOCIAL_LINKS.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950 dark:border-white/10 dark:bg-[#16191D] dark:text-slate-200 dark:hover:border-white/30 dark:hover:text-white"
                    >
                      <GitHubIcon className="h-3.5 w-3.5" />
                      GitHub
                    </a>

                    <a
                      href={SOCIAL_LINKS.unityAssetStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-[#0D9488]/60 hover:text-[#0D9488] dark:border-white/10 dark:bg-[#16191D] dark:text-slate-200 dark:hover:border-[#14B8A6]/60 dark:hover:text-white"
                    >
                      <UnityIcon className="h-3.5 w-3.5 text-[#0D9488] dark:text-[#14B8A6]" />
                      Asset Store
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 bg-[#F7F8FA] py-7 dark:border-white/8 dark:bg-[#101214]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8 dark:text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} {copy.copyright[lang]}
          </p>
          <p>São Paulo, Brasil</p>
        </div>
      </footer>
    </>
  );
}
