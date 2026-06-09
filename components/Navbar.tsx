"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const locale = pathname.split("/")[1] === "hr" ? "hr" : "en";

  const localizedPathname = (() => {
    const segments = pathname.split("/");
    return segments[1] === "en" || segments[1] === "hr" ? `/${segments.slice(2).join("/")}` : pathname;
  })();
  const isHomePage = localizedPathname === "/";
  const localizeHref = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navItems = [
    { name: t("home"), href: "/" },
    { name: t("priceList"), href: "/menu" },
    { name: t("events"), href: "/events" },
    { name: t("games"), href: "/games" },
    { name: t("gallery"), href: "/gallery" },
    { name: t("blog"), href: "/blogPage" },
    { name: t("about"), href: "/about" },
  ];

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full p-0 transition-all duration-500 ${
        isScrolled ? "bg-black/45 backdrop-blur-md" : "bg-gradient-to-b from-black/35 to-transparent"
      }`}
    >
      <nav
        className={`mx-auto flex items-center justify-between transition-all duration-500 lg:w-[80%] xl:w-[80%] 2xl:w-[80%] ${
          isScrolled ? "px-6 py-3 md:px-10" : "px-6 py-3 md:px-12 md:py-4"
        }`}
      >
        <div className="flex items-center">
          <Link href={`/${locale}`} aria-label="Beach Bar Lloyd">
            <Image
              src="/logo.png"
              alt="Beach Bar Lloyd"
              width={160}
              height={60}
              className={`h-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)] transition-all duration-500 ${
                isScrolled ? `${isHomePage ? "w-20" : "w-16"} md:w-[100px]` : `${isHomePage ? "w-28" : "w-24"} md:w-40`
              }`}
              priority
            />
          </Link>
        </div>

        <div className="hidden items-center gap-1 text-30-bold md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={localizeHref(item.href)}
              className={`nav-link ${
                (item.href === "/" ? localizedPathname === item.href : localizedPathname.startsWith(item.href))
                  ? "active-link"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
          {children}
        </div>

        <button
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label={t("toggleMenu")}
          className="z-50 inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:bg-white/10 md:hidden"
        >
          {isMenuOpen ? <X className="h-7 w-7" aria-hidden="true" /> : <Menu className="h-7 w-7" aria-hidden="true" />}
        </button>
      </nav>

      <div
        className={`fixed inset-0 flex h-screen flex-col items-center justify-center bg-black/85 backdrop-blur-md transition-all duration-500 ${
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={localizeHref(item.href)}
            onClick={() => setIsMenuOpen(false)}
            className={`nav-link text-30-semibold ${
              (item.href === "/" ? localizedPathname === item.href : localizedPathname.startsWith(item.href))
                ? "active-link"
                : "text-gray-400"
            }`}
          >
            {item.name}
          </Link>
        ))}
        {children}
      </div>
    </header>
  );
};

export default Navbar;
