import Footer from "@/components/Footer";
import LandingSection from "@/components/LandingSection";
import LoginSignout from "@/components/LoginSigonut";
import { ReactNode } from "react";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Hero Section with Pink Container */}
      <LandingSection
        loginSignout={<LoginSignout />}
        pinkContainer={
          <section className="pink_container">
            <h1 className="heading">Good Drinks, Good Vibes</h1>
            <p className="sub-heading">
              Relax with the best cocktails <br />
              by the beach, only at Beach Bar.
            </p>
          </section>
        }
      />

      {/* Main Content Below the Hero Section */}
      <main className="flex-grow font-work-sans bg-white">{children}</main>

      <Footer />
    </div>
  );
}
