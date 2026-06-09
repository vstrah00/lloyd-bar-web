// src/components/CheersSection.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Clock, Instagram, MapPin, Utensils } from 'lucide-react';

const CheersSection = () => {
  const t = useTranslations('CheersSection');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] === 'hr' ? 'hr' : 'en';

  const actions = [
    {
      href: `/${locale}/menu`,
      icon: Utensils,
      title: t('menuTitle'),
      description: t('menuDescription'),
    },
    {
      href: 'https://www.google.com/maps/search/?api=1&query=Beach%20Bar%20Lloyd%20Okrug%20Donji',
      icon: MapPin,
      title: t('locationTitle'),
      description: t('locationDescription'),
    },
    {
      href: 'https://instagram.com/beach_bar_lloyd',
      icon: Instagram,
      title: t('instagramTitle'),
      description: t('instagramDescription'),
    },
  ];

  return (
    <section className="bg-zinc-950 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-sm font-semibold text-sky-100">
              <Clock className="h-4 w-4 text-amber-300" aria-hidden="true" />
              {t('season')}
            </div>
            <h2 className="max-w-xl text-3xl font-bold leading-tight text-white md:text-5xl">
              {t('heading')}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-300 md:text-lg">
              {t('description')}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {actions.map(({ href, icon: Icon, title, description }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-md border border-white/10 bg-white/[0.04] p-4 text-white transition hover:border-amber-300/60 hover:bg-white/[0.08]"
              >
                <Icon className="mb-4 h-6 w-6 text-amber-300" aria-hidden="true" />
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheersSection;
