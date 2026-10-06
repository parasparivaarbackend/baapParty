import './globals.css';
import SiteChrome from '@/components/SiteChrome';
import { FilterProvider } from '@/context/FilterContext';
import { AuthProvider } from '@/context/AuthContext';


export const metadata = {
  title: "Bharatiya Avijit Aawaz Party — Sankalp 2026",
  description: "Official campaign website of Bharatiya Avijit Aawaz Party — Rozgar, Kisan Samman, Shiksha aur Swasthya ke liye ek naya sankalp.",
  keywords: ["election", "political party", "India", "campaign", "manifesto"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <FilterProvider>
            <SiteChrome>{children}</SiteChrome>
          </FilterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
