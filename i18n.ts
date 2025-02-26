import { notFound } from "next/navigation";
import { getRequestConfig, GetRequestConfigParams, RequestConfig } from "next-intl/server";

// Supported locales
export const locales = ["en", "hr"];

export default getRequestConfig(async ({ requestLocale }: GetRequestConfigParams): Promise<RequestConfig> => {
  // Await the requestLocale to get its actual value
  const locale = await requestLocale;

  // If locale is undefined or not valid, fallback to 'en'
  if (!locale || !locales.includes(locale)) {
    notFound(); // Show 404 if locale is undefined or not supported
    return {}; // Return an empty object as fallback to prevent errors
  }

  try {
    // Dynamically import translation messages based on the locale
    const messages = (await import(`./messages/${locale}.json`)).default;
    return { messages, locale }; // Return the messages and locale in a valid RequestConfig
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound(); // Show 404 if translations fail to load
    return {}; // Return an empty object as fallback to prevent errors
  }
});
