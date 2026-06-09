"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { ChevronDown, ChevronUp, Info, Martini } from "lucide-react";
import { useTranslations } from "next-intl";
import { client } from "@/sanity/lib/client";

const builder = imageUrlBuilder(client);

function urlFor(source: { asset: { _ref: string } }) {
  return builder.image(source);
}

type LocalizedString = {
  en: string;
  hr: string;
};

type Product = {
  _id: string;
  name: LocalizedString;
  price: number;
  description?: LocalizedString;
  image?: {
    asset: {
      _ref: string;
    };
  };
};

type Category = {
  _id: string;
  name: LocalizedString;
  products: Product[];
};

type Locale = "en" | "hr";

type QrMenuClientProps = {
  products?: Category[];
  locale: Locale;
};

const QrMenuClient: React.FC<QrMenuClientProps> = ({ products = [], locale }) => {
  const t = useTranslations("QrMenu");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);

  const categories = useMemo(
    () => products.filter((category) => category.products.length > 0),
    [products],
  );

  useEffect(() => {
    if (!openCategory && categories[0]) {
      setOpenCategory(categories[0]._id);
    }
  }, [categories, openCategory]);

  const selectedCategory = categories.find((category) => category._id === openCategory);

  return (
    <section className="min-h-screen bg-zinc-100 px-3 pb-10 pt-20 text-zinc-950 md:px-6 md:pt-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 rounded-md bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <Martini className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{t("eyebrow")}</p>
              <h1 className="text-xl font-extrabold leading-tight">{t("heading")}</h1>
            </div>
          </div>
          <p className="mt-2 text-sm leading-5 text-zinc-600">{t("description")}</p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-md bg-white p-8 text-center text-zinc-500">{t("empty")}</div>
        ) : (
          <>
            <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories.map((category) => {
                const isOpen = openCategory === category._id;

                return (
                  <button
                    key={category._id}
                    onClick={() => {
                      setOpenCategory(category._id);
                      setActiveProduct(null);
                    }}
                    className={`rounded-md border px-3 py-2 text-left transition ${
                      isOpen
                        ? "border-primary bg-primary text-white shadow-sm"
                        : "border-zinc-200 bg-white text-zinc-800 hover:border-primary/50"
                    }`}
                  >
                    <span className="block text-sm font-bold leading-tight">{category.name[locale]}</span>
                    <span className={`mt-0.5 block text-xs ${isOpen ? "text-white/80" : "text-zinc-500"}`}>
                      {t("items", { count: category.products.length })}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedCategory && (
              <div className="overflow-hidden rounded-md bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-100 p-4">
                  <h2 className="text-xl font-extrabold">{selectedCategory.name[locale]}</h2>
                  <span className="text-sm font-semibold text-zinc-500">
                    {t("items", { count: selectedCategory.products.length })}
                  </span>
                </div>

                <div className="divide-y divide-zinc-100">
                  {selectedCategory.products.map((product) => {
                    const isActive = activeProduct === product._id;
                    const description = product.description?.[locale];

                    return (
                      <article key={product._id} className="p-4">
                        <div className="flex gap-3">
                          {product.image?.asset?._ref && (
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                              <Image
                                src={urlFor(product.image).width(160).height(160).fit("crop").url()}
                                alt={product.name[locale]}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-base font-bold leading-snug">{product.name[locale]}</h3>
                              <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-sm font-extrabold text-zinc-950">
                                {product.price}€
                              </span>
                            </div>

                            {description && (
                              <button
                                onClick={() => setActiveProduct(isActive ? null : product._id)}
                                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                              >
                                <Info className="h-3.5 w-3.5" aria-hidden="true" />
                                {isActive ? t("hideDetails") : t("viewDetails")}
                                {isActive ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                              </button>
                            )}

                            {description && (
                              <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                  isActive ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                                }`}
                              >
                                <p className="mt-3 rounded-md bg-zinc-50 p-3 text-sm leading-6 text-zinc-600">
                                  {description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default QrMenuClient;
