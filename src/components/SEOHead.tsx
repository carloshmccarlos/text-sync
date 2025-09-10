import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

export function SEOHead({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
}: SEOHeadProps) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    } else {
      document.title = t("seo.title");
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description || t("seo.description"));
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords || t("seo.keywords"));
    }

    // Update Open Graph tags
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) {
      ogTitleTag.setAttribute("content", ogTitle || title || t("seo.ogTitle"));
    }

    const ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionTag) {
      ogDescriptionTag.setAttribute("content", ogDescription || description || t("seo.ogDescription"));
    }

    // Update Twitter tags
    const twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleTag) {
      twitterTitleTag.setAttribute("content", twitterTitle || title || t("seo.twitterTitle"));
    }

    const twitterDescriptionTag = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescriptionTag) {
      twitterDescriptionTag.setAttribute("content", twitterDescription || description || t("seo.twitterDescription"));
    }

    // Update HTML lang attribute
    document.documentElement.lang = i18n.language === 'zh' ? 'zh-CN' : 'en';

  }, [title, description, keywords, ogTitle, ogDescription, twitterTitle, twitterDescription, t, i18n.language]);

  return null; // This component doesn't render anything
}