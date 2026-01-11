// src/app/layout.js
import localFont from 'next/font/local';
import "./globals.css";
import VideoBackground from "../components/VideoBackground";
import { AuthProvider } from "../contexts/AuthContext";

const PRIMARY_COLOR = '#003366';
const SITE_URL = 'https://bishahcc.org';
const SITE_NAME = 'غرفة بيشة التجارية';
const SITE_DESCRIPTION =
  'غرفة بيشة التجارية - نمثل القطاع التجاري والصناعي في منطقة بيشة. نقدم خدمات الأعضاء، برنامج مزايا، فرص التوظيف، والاستشارات التجارية.';

  import { Tajawal } from 'next/font/google';

const tajawal = Tajawal({
  weight: ['300', '400', '500', '700'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-tajawal',
});
  

export const metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'ar_SA',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  themeColor: PRIMARY_COLOR,
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/images/og-image.jpg`],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content={PRIMARY_COLOR} />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <VideoBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
