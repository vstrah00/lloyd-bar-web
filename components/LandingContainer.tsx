"use client";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function LandingContainer() {
  const pathname = usePathname();

  // Function to normalize the pathname
  const normalizePathname = (pathname: string) => {
    // Remove locale (e.g., "/en/menu" => "/menu")
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "hr") {
      pathname = "/" + segments.slice(2).join("/");
    }

    // Remove trailing slash (e.g., "/menu/" => "/menu")
    if (pathname.endsWith("/") && pathname.length > 1) {
      pathname = pathname.slice(0, -1);
    }

    return pathname;
  };

  const normalizedPathname = normalizePathname(pathname);
  const page = normalizedPathname === "/" ? "home" : normalizedPathname.replace("/", "");

  // Fetch translations for the current page
  const tHome = useTranslations("Home");
  const tMenu = useTranslations("Menu");
  const tAbout = useTranslations("About");
  const tQrmenu = useTranslations("Qrmenu");

  switch (page) {
    case "menu":
      return (
        <section className="landing_container">
          <h1 className="heading">{tMenu("heading")}</h1>
          <p className="sub-heading">
            {tMenu("subheading")}
          </p>
        </section>
      );
    case "about":
      return (
        <section className="landing_container">
          <h1 className="heading">{tAbout("heading")}</h1>
          <p className="sub-heading">
            {tAbout("subheading")}
          </p>
        </section>
      );
    case "qr":
      return (
        <section className="landing_container">
          <h1 className="heading">{tQrmenu("heading")}</h1>
          <p className="sub-heading">
            {tQrmenu("subheading")}
          </p>
        </section>
      );
    default:
      return (
        <section className="landing_container">
          <h1 className="heading">{tHome("welcome")}</h1>
          <p className="sub-heading">
            {tHome("subheading")}
          </p>
        </section>
      );
  }
}