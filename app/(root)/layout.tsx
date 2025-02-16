import { ReactNode } from "react";
import Footer from "@/components/Footer";
import LandingSection from "@/components/LandingSection"

export default function Layout({children}: Readonly<{children: ReactNode}>){
    return (
        <div className="min-h-screen flex flex-col bg-black">
            <LandingSection>
                {children}
            </LandingSection>
            <main className="flex-grow font-work-sans pt-[90px]">
                
            </main>
            <Footer />
        </div>
    );
}