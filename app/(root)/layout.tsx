import Footer from "@/components/Footer";
import LandingSection from "@/components/LandingSection";
import LoginSignout from "@/components/LoginSigonut";
import { ReactNode } from "react";


export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Pass both children to LandingSection */}
      <LandingSection loginSignout={<LoginSignout />}>
        {children} {/* Main content */}
      </LandingSection>

      <main className="flex-grow font-work-sans pt-[90px]">
        {/* Main content will be rendered here */}
      </main>
      <Footer />
    </div>
  );
}