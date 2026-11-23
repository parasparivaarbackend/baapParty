'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import TopBar from "./TopBar";
import GlobalFilterBar from './GlobalFilterBar';
import ScrollProgress from './ScrollProgress';
import ScrollTop from "@/components/ScrollToTop";
import ReportFab from './ReportFab';
import PageLoader from './PageLoader';
import WelcomeDialog from './WelcomeDialog';

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    // The admin panel has its own layout/navigation (see app/admin/layout.js).
    return <>{children}</>;
  }

  return (
    <>
      <PageLoader />
      <WelcomeDialog />
      <ScrollTop />
      <ScrollProgress />
      <Navbar />
      <TopBar />
      {/* <GlobalFilterBar /> */}
      <main>{children}</main>
      <ReportFab />
      <Footer />
    </>
  );
}
