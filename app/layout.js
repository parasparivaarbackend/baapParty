import './globals.css';
import SiteChrome from '@/components/SiteChrome';
import { FilterProvider } from '@/context/FilterContext';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { cookies } from 'next/headers';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

export const metadata = {
  // ✅ metadataBase yahan add kiya gaya hai
  metadataBase: new URL('https://bharatiyaavijitaawazparty.com'),

  title:
    "Bharatiya Avijit Aawaz Party | Political Party for Public Welfare in Delhi & Punjab, India",
  description:
    "Bharatiya Avijit Aawaz Party (BAAP Party) promotes education, employment, equality and social justice in Delhi, Punjab and across India.",
  keywords: [
    "Bharatiya Avijit Aawaz Party",
    "BAAP Party",
    "BAAP Party India",
    "Baap Party Punjab",
    "BAAP Party Official Website",
    "Avijit Aawaz Party",
    "BAAP Party Delhi",
    "BAAP Party Leadership",
    "BAAP Political Party",
    "Join BAAP Party",
    "Political Party in India",
    "Indian Political Party",
    "Election Campaign India",
    "Political Manifesto India",
    "Indian Democracy",
    "Public Welfare",
    "Social Justice",
    "National Development",
    "Political Leadership India",
    "Citizen Participation"
  ],

  icons: { icon: "/favicon.ico" },

  verification: {
    google: 'uJcIAunm_VKfP79XaTaBxkgizk1O9iLRvq4keWZN5mI',
  },
};

export default async function RootLayout({ children }) {
  const lang = (await cookies()).get('baap_lang')?.value === 'hi' ? 'hi' : 'en';

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Google Analytics (GA4) स्क्रिप्ट */}
        <GoogleAnalytics gaId="G-0RNNFT5MMV" />

        {/* Google Tag Manager (GTM) स्क्रिप्ट */}
        <GoogleTagManager gtmId="GTM-5CN972KH" />

      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
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