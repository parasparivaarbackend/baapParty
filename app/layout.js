import './globals.css';
import SiteChrome from '@/components/SiteChrome';
import { FilterProvider } from '@/context/FilterContext';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { cookies } from 'next/headers';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'; // यहाँ से इम्पोर्ट किया

export const metadata = {
  title:
    "Bharatiya Avijit Aawaz Party (BAAP) — The People's Voice, The People's Right",
  description:
    "Official website of Bharatiya Avijit Aawaz Party (BAAP) — 18 Resolution for India: a pledge to build a safe, prosperous, just, and dignified India.",
  keywords: ["election", "political party", "India", "campaign", "manifesto"],
  icons: { icon: "/favicon.ico" },

  // 1. Google Search Console Verification यहाँ जुड़ गया है
  verification: {
    google: 'uJcIAunm_VKfP79XaTaBxkgizk1O9iLRvq4keWZN5mI',
  },
};

export default async function RootLayout({ children }) {
  const lang = (await cookies()).get('baap_lang')?.value === 'hi' ? 'hi' : 'en';

  return (
    <html lang={lang}>
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* 2. Google Analytics (GA4) स्क्रिप्ट */}
        <GoogleAnalytics gaId="G-0RNNFT5MMV" />

        {/* 3. Google Tag Manager (GTM) स्क्रिप्ट */}
        <GoogleTagManager gtmId="GTM-5CN972KH" />

      </head>
      <body className="font-body antialiased">
        <LanguageProvider initialLang={lang}>
          <AuthProvider>
            <FilterProvider>
              <SiteChrome>{children}</SiteChrome>
            </FilterProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}