"use client";
import { usePathname } from "next/navigation";

export default function LandingContainer() {
  const pathname = usePathname();
  const page = pathname === "/" ? "home" : pathname.replace("/", "");

  switch (page) {
    case "menu":
      return (
        <section className="landing_container">
          <h1 className="heading">Check what drinks and icecream&apos;s we offer!</h1>
          <p className="sub-heading">
            Discover a wide range of <br />
            crafted with passion and precision.
          </p>
        </section>
      );
    case "info":
      return (
        <section className="landing_container">
          <h1 className="heading">About Beach Bar</h1>
          <p className="sub-heading">
            Learn about our story, our values, <br />
            and what makes us unique.
          </p>
        </section>
      );
    default:
      return (
        <section className="landing_container">
          <h1 className="heading">Welcome to Beach Bar</h1>
          <p className="sub-heading">
            Enjoy the finest drinks and vibes <br />
            by the beach.
          </p>
        </section>
      );
  }
}