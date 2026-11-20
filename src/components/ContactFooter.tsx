import { useState } from 'react';
import { Check, Copy, Mail, MapPin } from 'lucide-react';
import {
  getContactEmail,
  Language,
  SOCIAL_LINKS,
  Theme,
  UI_COPY,
} from '../data/portfolio';
import { GitHubIcon, LinkedInIcon, UnityIcon } from './BrandIcons';
import { ParticleFieldCanvas } from './ParticleFieldCanvas';

interface ContactFooterProps {
  lang: Language;
  theme: Theme;
}

export function ContactFooter({ lang, theme }: ContactFooterProps) {
  const [copied, setCopied] = useState(false);
  const copy = UI_COPY.contact;
  const heroCopy = UI_COPY.hero;
  const email = getContactEmail();

  const handleCopyEmail = async () => {
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
        className="border-t border-[#D2CFC5] py-18 sm:py-22 dark:border-[#272A30]"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[3px] border border-[#D2CFC5] bg-[#FAF9F6] p-7 sm:p-10 dark:border-[#272A30] dark:bg-[#151619]">
            <ParticleFieldCanvas theme={theme} />

            <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <p className="font-mono text-xs font-medium tracking-[0.16em] text-[#D94612] uppercase dark:text-[#FF5A1F]">
                  {copy.eyebrow[lang]}
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#141518] dark:text-[#ECEEE9] sm:text-4xl">
                  {copy.title[lang]}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#4B4F57] dark:text-[#9A9FA8] sm:text-base">
                  {copy.subtitle[lang]}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2 rounded-[3px] bg-[#D94612] px-4 py-2.5 font-mono text-xs font-semibold tracking-wide text-[#FAF9F6] uppercase transition hover:brightness-110 dark:bg-[#FF5A1F] dark:text-[#0E0F11]"
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
                    className="inline-flex items-center gap-2 rounded-[3px] border border-[#D2CFC5] bg-[#F2F1EC]/95 px-4 py-2.5 font-mono text-xs font-medium text-[#141518] uppercase backdrop-blur-xs transition hover:border-[#D94612] dark:border-[#272A30] dark:bg-[#1B1D21]/95 dark:text-[#ECEEE9] dark:hover:border-[#FF5A1F]"
                  >
                    <Mail className="h-4 w-4 text-[#D94612] dark:text-[#FF5A1F]" />
                    {copy.sendEmail[lang]}
                  </a>
                </div>
              </div>

              <div className="space-y-3 rounded-[3px] border border-[#D2CFC5] bg-[#F2F1EC]/92 p-5 backdrop-blur-xs lg:col-span-5 dark:border-[#272A30] dark:bg-[#0E0F11]/90">
                <div className="flex items-center justify-between gap-3 border-b border-[#D2CFC5] pb-3 dark:border-[#272A30]">
                  <span className="font-mono text-[11px] tracking-wider text-[#70757F] uppercase dark:text-[#6E747E]">
                    Email
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="font-mono text-xs font-medium text-[#D94612] hover:underline dark:text-[#FF5A1F]"
                  >
                    {email}
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-[#D2CFC5] pb-3 dark:border-[#272A30]">
                  <span className="font-mono text-[11px] tracking-wider text-[#70757F] uppercase dark:text-[#6E747E]">
                    {copy.locationLabel[lang]}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#141518] dark:text-[#ECEEE9]">
                    <MapPin className="h-3.5 w-3.5 text-[#D94612] dark:text-[#FF5A1F]" />
                    {heroCopy.location[lang]}
                  </span>
                </div>

                <div className="pt-1">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={SOCIAL_LINKS.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-[2px] border border-[#D2CFC5] bg-[#FAF9F6] px-3 py-1.5 font-mono text-[11px] font-medium text-[#141518] transition hover:border-[#D94612] dark:border-[#272A30] dark:bg-[#151619] dark:text-[#ECEEE9] dark:hover:border-[#FF5A1F]"
                    >
                      <LinkedInIcon className="h-3.5 w-3.5 text-[#4B4F57] dark:text-[#9A9FA8]" />
                      LinkedIn
                    </a>

                    <a
                      href={SOCIAL_LINKS.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-[2px] border border-[#D2CFC5] bg-[#FAF9F6] px-3 py-1.5 font-mono text-[11px] font-medium text-[#141518] transition hover:border-[#D94612] dark:border-[#272A30] dark:bg-[#151619] dark:text-[#ECEEE9] dark:hover:border-[#FF5A1F]"
                    >
                      <GitHubIcon className="h-3.5 w-3.5 text-[#4B4F57] dark:text-[#9A9FA8]" />
                      GitHub
                    </a>

                    <a
                      href={SOCIAL_LINKS.unityAssetStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-[2px] border border-[#D2CFC5] bg-[#FAF9F6] px-3 py-1.5 font-mono text-[11px] font-medium text-[#141518] transition hover:border-[#D94612] dark:border-[#272A30] dark:bg-[#151619] dark:text-[#ECEEE9] dark:hover:border-[#FF5A1F]"
                    >
                      <UnityIcon className="h-3.5 w-3.5 text-[#4B4F57] dark:text-[#9A9FA8]" />
                      Asset Store
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#D2CFC5] bg-[#E7E5DD]/65 py-7 dark:border-[#272A30] dark:bg-[#0E0F11]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 font-mono text-[11px] text-[#70757F] sm:flex-row sm:px-6 lg:px-8 dark:text-[#6E747E]">
          <p>
            &copy; {new Date().getFullYear()} {copy.copyright[lang]}
          </p>
          <p>ENGINE_UI // REACT + TS + CANVAS_2D</p>
        </div>
      </footer>
    </>
  );
}
