import { useState } from 'react';
import { Check, Copy, Mail, MapPin } from 'lucide-react';
import {
  getContactEmail,
  Language,
  SOCIAL_LINKS,
  UI_COPY,
} from '../data/portfolio';
import { GitHubIcon, LinkedInIcon, UnityIcon } from './BrandIcons';

interface ContactFooterProps {
  lang: Language;
}

export function ContactFooter({ lang }: ContactFooterProps) {
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
      <section id="contact" className="border-t border-slate-200 py-20 sm:py-24 dark:border-slate-800/70">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-cyan-50/40 p-8 shadow-sm sm:p-12 dark:border-slate-800 dark:bg-gradient-to-br dark:from-[#0F172A] dark:via-[#0B101D] dark:to-[#07090F] dark:shadow-none">
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
                  {copy.eyebrow[lang]}
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  {copy.title[lang]}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                  {copy.subtitle[lang]}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_24px_rgba(6,182,212,0.25)] transition hover:brightness-110 dark:from-cyan-400 dark:to-sky-400 dark:text-slate-950 dark:shadow-[0_0_24px_rgba(34,211,238,0.22)]"
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
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-xs transition hover:border-cyan-500/50 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-cyan-400/50 dark:hover:text-cyan-200"
                  >
                    <Mail className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                    {copy.sendEmail[lang]}
                  </a>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-6 backdrop-blur-sm lg:col-span-5 dark:border-slate-800/90 dark:bg-slate-950/60">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800/80">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Email
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="font-mono text-sm text-cyan-700 hover:underline dark:text-cyan-200"
                  >
                    {email}
                  </a>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800/80">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {copy.locationLabel[lang]}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-200">
                    <MapPin className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-300" />
                    {heroCopy.location[lang]}
                  </span>
                </div>

                <div className="pt-2">
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href={SOCIAL_LINKS.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:border-sky-500/50 hover:text-sky-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-400/50 dark:hover:text-sky-200"
                    >
                      <LinkedInIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                      LinkedIn
                    </a>

                    <a
                      href={SOCIAL_LINKS.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-white"
                    >
                      <GitHubIcon className="h-4 w-4" />
                      GitHub
                    </a>

                    <a
                      href={SOCIAL_LINKS.unityAssetStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:border-indigo-500/50 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-400/50 dark:hover:text-indigo-200"
                    >
                      <UnityIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                      Unity Asset Store
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-100 py-8 dark:border-slate-800/70 dark:bg-[#06080D]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} {copy.copyright[lang]}
          </p>
          <p className="font-mono text-[11px] text-slate-500">
            React • TypeScript • Tailwind CSS
          </p>
        </div>
      </footer>
    </>
  );
}
