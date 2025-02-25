import Footer from "@/components/Footer";
import LandingSection from "@/components/LandingSection";
import LandingContainer from "@/components/LandingContainer";
import LoginSignout from "@/components/LoginSigonut";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Get the current page from pathname */}
      <LandingSection
        loginSignout={<LoginSignout />}
        landingContainer={<LandingContainer />}
      />

      <main className="flex-grow font-work-sans bg-white">{children}</main>

      <Footer />
    </div>
  );
}
