import Image from "next/image";
import { getTranslations } from "next-intl/server";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { GALLERY_QUERY } from "@/sanity/lib/queries";

const galleryImages = [
  { src: "/bg1-hero.webp", key: "sunset", wide: true },
  { src: "/bg2-hero.webp", key: "terrace", wide: false },
  { src: "/bg3-hero.webp", key: "sea", wide: false },
  { src: "/bg4-hero.webp", key: "evening", wide: false },
  { src: "/bg5-hero.webp", key: "summer", wide: true },
];

const builder = imageUrlBuilder(client);

type LocalizedString = {
  en?: string;
  hr?: string;
};

type GalleryImage = {
  _id: string;
  title?: LocalizedString;
  caption?: LocalizedString;
  eventDate?: string;
  image?: {
    asset?: {
      _ref: string;
    };
  };
};

type GalleryImageWithAsset = GalleryImage & {
  image: {
    asset: {
      _ref: string;
    };
  };
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

function hasImageAsset(item: GalleryImage): item is GalleryImageWithAsset {
  return Boolean(item.image?.asset?._ref);
}

function formatGalleryDate(date: string | undefined, locale: "en" | "hr") {
  if (!date) {
    return undefined;
  }

  return new Intl.DateTimeFormat(locale === "hr" ? "hr-HR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export const revalidate = 60;

export default async function GalleryPage({ params }: PageProps) {
  const { locale: stringLocale } = await params;
  const locale = stringLocale === "hr" ? "hr" : "en";
  const t = await getTranslations({ locale, namespace: "Gallery" });
  const sanityImages = await client.fetch<GalleryImage[]>(GALLERY_QUERY);
  const images = sanityImages.length > 0
    ? sanityImages
        .filter(hasImageAsset)
        .map((item, index) => ({
          src: builder.image(item.image).width(1400).height(index % 4 === 0 ? 760 : 900).fit("crop").url(),
          alt: item.title?.[locale] || item.title?.en || t("fallbackAlt"),
          caption: item.caption?.[locale] || item.caption?.en || item.title?.[locale] || item.title?.en || t("fallbackAlt"),
          date: formatGalleryDate(item.eventDate, locale),
          wide: index % 5 === 0 || index % 5 === 4,
        }))
    : galleryImages.map((item) => ({
        src: item.src,
        alt: t(item.key),
        caption: t(item.key),
        date: undefined,
        wide: item.wide,
      }));

  return (
    <section className="bg-zinc-950 px-4 pb-16 pt-28 text-white md:px-8 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">{t("eyebrow")}</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-6xl">{t("heading")}</h1>
          <p className="mt-4 text-base leading-7 text-zinc-300 md:text-lg">{t("description")}</p>
        </div>

        <div className="mt-10 grid auto-rows-[220px] gap-4 md:grid-cols-3 md:auto-rows-[280px]">
          {images.map((image) => (
            <figure
              key={image.src}
              className={`group relative overflow-hidden rounded-md bg-zinc-900 ${
                image.wide ? "md:col-span-2" : ""
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={image.wide ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-sm font-bold">
                {image.date && (
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
                    {image.date}
                  </span>
                )}
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
