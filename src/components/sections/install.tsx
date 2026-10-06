"use client";

import { Plus } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Spectrum } from "@/components/ui/spectrum";
import { SplitReveal } from "@/components/ui/split-reveal";
import { fill } from "@/i18n/fill";
import { useI18n } from "@/i18n/provider";

/** Install in three steps, the requirements, and the questions people ask. */
export function Install() {
  const { locale, t } = useI18n();
  const install = t.install;
  const version = { version: site.version };

  return (
    <section id="install" className="border-t border-paper/10 px-5 py-24 md:px-10 md:py-32">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <p className="kicker">{install.kicker}</p>
          <SplitReveal lines={install.title} className="display mt-6 text-[clamp(2.8rem,6vw,6rem)] lang-id:text-[clamp(2.6rem,5vw,5rem)] lang-ja:text-[clamp(2.2rem,4.4vw,4.5rem)]" />
          <Reveal delay={0.15} className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={site.links.download} size="lg">
              {fill(install.download, version)}
            </Button>
            <Button href={site.links.guide[locale]} variant="ghost" size="lg">
              {install.guide}
            </Button>
          </Reveal>
          <Reveal delay={0.25}>
            <dl className="mt-12 divide-y divide-paper/10 border-y border-paper/10">
              {install.requirements.map((row) => (
                <div key={row.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3.5 text-sm">
                  <dt className="font-mono text-[11px] leading-5 tracking-[0.16em] text-mute uppercase">{row.label}</dt>
                  <dd className="text-paper/85">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
          <ol>
            {install.steps.map((step, i) => (
              <li key={i} className="border-t border-paper/12 py-9 first:border-t-0 first:pt-0 md:py-12">
                <Reveal className="grid gap-5 sm:grid-cols-[7rem_1fr]">
                  <span lang="en" className="display text-outline text-[5.5rem] leading-[0.8] [--outline:rgb(254_84_77/0.8)] md:text-[7rem]">{i + 1}</span>
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight md:text-3xl">{step.title}</h3>
                    <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mute md:text-base">{fill(step.body, version)}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal className="flex items-center gap-4 rounded-2xl bg-ink-2 px-5 py-4 ring-1 ring-paper/8">
            <Spectrum className="h-4 text-coral" />
            <p className="text-[15px] text-paper/85">{install.done}</p>
          </Reveal>

          <div className="mt-20">
            <h3 className="kicker">{install.faqTitle}</h3>
            <div className="mt-6 border-b border-paper/12">
              {install.faq.map((item, i) => (
                <details key={i} className="faq group border-t border-paper/12">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium tracking-tight transition-colors hover:text-coral md:text-xl">
                    {item.q}
                    <Plus className="size-5 shrink-0 transition-transform duration-500 ease-out-expo group-open:rotate-45" />
                  </summary>
                  <p className="max-w-xl pb-6 text-[15px] leading-relaxed text-mute">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
