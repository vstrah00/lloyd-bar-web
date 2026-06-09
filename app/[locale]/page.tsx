import LandingSection from "@/components/LandingSection";
import LandingContainer from "@/components/LandingContainer";
import CheersSection from "@/components/CheersSection";
import { getTranslations } from "next-intl/server";
import { Beer, Coffee, IceCreamBowl, Waves } from "lucide-react";
import Link from "next/link";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const highlights = [
    { icon: Coffee, title: t("coffeeTitle"), description: t("coffeeDescription"), action: t("coffeeAction"), href: `/${locale}/menu` },
    { icon: Beer, title: t("drinksTitle"), description: t("drinksDescription"), action: t("drinksAction"), href: `/${locale}/menu` },
    { icon: IceCreamBowl, title: t("iceCreamTitle"), description: t("iceCreamDescription"), action: t("iceCreamAction"), href: `/${locale}/menu` },
    { icon: Waves, title: t("seaTitle"), description: t("seaDescription"), action: t("seaAction"), href: `/${locale}/gallery` },
  ];

  return (
    <>
      <LandingSection
          landingContainer={<LandingContainer />}
        />

      <CheersSection/>
      <section className="bg-zinc-100 py-14 text-zinc-950 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{t("highlightsEyebrow")}</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">{t("highlightsHeading")}</h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">{t("highlightsDescription")}</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ icon: Icon, title, description, action, href }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-md border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
                <span className="mt-5 inline-flex text-sm font-bold text-primary underline-offset-4 group-hover:underline">
                  {action}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
