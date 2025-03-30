import Footer from "@/components/Footer";
import LoginSignout from "@/components/LoginSigonut";
import FloatingLanguageButton from "@/components/FloatingLanguageButton"; // Import the floating button
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";

// Define supported locales
const supportedLocales = ["en", "hr"];

type LayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

export default async function Layout({ children, params }: LayoutProps) {
  const { locale } = await params; // Ensure params is awaited

  // Validate locale and show 404 if not supported
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  // Fetch translations based on locale
  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.error(`Error loading messages for locale: ${locale}`, error);
    notFound(); // Show 404 if translations fail to load
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="min-h-screen flex flex-col bg-black">
        <Navbar>
          <LoginSignout/>
        </Navbar>

        {/* Add the FloatingLanguageButton to the layout */}
        <FloatingLanguageButton languages={["en", "hr"]} />

        <main className="flex-grow font-work-sans bg-gradient-to-r from-gray-800 to-black">{children}</main>

        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
