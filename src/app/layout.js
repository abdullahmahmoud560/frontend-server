import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VideoBackground from "../components/VideoBackground";
import { AuthProvider } from "../contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://bishacci.org.sa'),
  title: {
    default: "غرفة بيشة التجارية | Bisha Chamber of Commerce",
    template: "%s | غرفة بيشة التجارية"
  },
  description: "غرفة بيشة التجارية - نمثل القطاع التجاري والصناعي في منطقة بيشة. نقدم خدمات الأعضاء، برنامج مزايا، فرص التوظيف، والاستشارات التجارية.",
  keywords: [
    "غرفة بيشة",
    "غرفة بيشة التجارية",
    "Bisha Chamber",
    "بيشة",
    "التجارة",
    "الصناعة",
    "برنامج مزايا",
    "السجل التجاري",
    "الاستثمار في بيشة",
    "فرص عمل بيشة",
    "Bisha Commerce",
    "Saudi Chamber"
  ],
  authors: [{ name: "Bisha Chamber of Commerce" }],
  creator: "Bisha Chamber of Commerce",
  publisher: "Bisha Chamber of Commerce",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://bishacci.org.sa',
    siteName: 'غرفة بيشة التجارية',
    title: 'غرفة بيشة التجارية | Bisha Chamber of Commerce',
    description: 'غرفة بيشة التجارية - نمثل القطاع التجاري والصناعي في منطقة بيشة',
    images: [
      {
        url: '/bisha-chamber-logo.png',
        width: 1200,
        height: 630,
        alt: 'Bisha Chamber Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'غرفة بيشة التجارية | Bisha Chamber of Commerce',
    description: 'غرفة بيشة التجارية - نمثل القطاع التجاري والصناعي في منطقة بيشة',
    images: ['/bisha-chamber-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/bisha-chamber-logo.png',
    shortcut: '/bisha-chamber-logo.png',
    apple: '/bisha-chamber-logo.png',
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: 'https://bishacci.org.sa',
    languages: {
      'ar-SA': 'https://bishacci.org.sa',
      'en-US': 'https://bishacci.org.sa/en',
    },
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "غرفة بيشة التجارية",
    "alternateName": "Bisha Chamber of Commerce",
    "url": "https://bishacci.org.sa",
    "logo": "https://bishacci.org.sa/bisha-chamber-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966-550843313",
      "contactType": "customer service",
      "areaServed": "SA",
      "availableLanguage": ["Arabic", "English"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "بيشة",
      "addressRegion": "عسير",
      "addressCountry": "SA"
    },
    "sameAs": [
      "https://twitter.com/bishachamber",
      "https://www.linkedin.com/company/bisha-chamber"
    ]
  };

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#003366" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://bishacci.org.sa" />
        <meta name="google" content="notranslate" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <VideoBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
