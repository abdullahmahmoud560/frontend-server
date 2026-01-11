"use client";

import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export default function SEO({
  title = "غرفة بيشة التجارية | Bisha Chamber of Commerce",
  description = "غرفة بيشة التجارية - نمثل القطاع التجاري والصناعي في منطقة بيشة. نقدم خدمات الأعضاء، برنامج مزايا، فرص التوظيف، والاستشارات التجارية.",
  keywords = [],
  ogImage = "/bisha-chamber-logo.png",
  canonicalUrl,
}: SEOProps) {
  useEffect(() => {
    const baseUrl = "https://bishahcc.org";
    const fullTitle = title.includes('غرفة بيشة') ? title : `${title} | غرفة بيشة التجارية`;
    
    // Update title
    document.title = fullTitle;
    
    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', [...keywords, "غرفة بيشة", "Bisha Chamber", "بيشة"].join(', '));
    
    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', `${baseUrl}${ogImage}`, true);
    updateMetaTag('og:url', canonicalUrl || baseUrl, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', 'غرفة بيشة التجارية', true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', `${baseUrl}${ogImage}`);
    
    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl || baseUrl;
  }, [title, description, keywords, ogImage, canonicalUrl]);

  return null;
}

