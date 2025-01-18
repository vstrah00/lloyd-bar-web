import { ReactNode } from "react";
import Navbar from "../../components/Navbar";
import Footer from "@/components/Footer";
import LoginSignout from "@/components/LoginSigonut";

export default function Layout({children}: Readonly<{children: ReactNode}>){
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar>
                <LoginSignout />
            </Navbar>
            <main className="flex-grow font-work-sans pt-[90px]">
                {children}
            </main>
            <Footer />
        </div>
    );
}