import { ReactNode } from "react";
import Navbar from "../../components/Navbar";
import Footer from "@/components/Footer";

export default function Layout({children}: Readonly<{children: ReactNode}>){
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow font-work-sans pt-[90px]">
                {children}
            </main>
            <Footer />
        </div>
    );
}