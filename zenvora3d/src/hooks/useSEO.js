import { useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';

export const useSEO = (pageId) => {
  const { db } = useDatabase();

  useEffect(() => {
    const globalSEO = db.globalSEO || {};
    const pageSEO = (db.pageSEO || []).find(p => p.id === pageId) || {};

    const useGlobal = pageSEO.useGlobalSEO !== false; // defaults to true
    
    // Resolve Title
    const title = useGlobal ? (globalSEO.defaultTitle || globalSEO.websiteName) : (pageSEO.metaTitle || globalSEO.defaultTitle);
    if (title) document.title = title;

    // Helper to set meta tag
    const setMeta = (name, content, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Resolve Details
    const desc = useGlobal ? globalSEO.defaultDescription : pageSEO.metaDescription;
    const keywords = useGlobal ? globalSEO.defaultKeywords : pageSEO.keywords;
    
    setMeta('description', desc);
    setMeta('keywords', keywords);

    // OpenGraph
    const ogTitle = useGlobal ? globalSEO.defaultOGTitle : pageSEO.ogTitle;
    const ogDesc = useGlobal ? globalSEO.defaultDescription : pageSEO.ogDescription;
    const ogImage = useGlobal ? globalSEO.defaultOGImage : (pageSEO.ogImage || globalSEO.defaultOGImage);
    const twitterCard = globalSEO.twitterCard || 'summary_large_image';

    setMeta('og:title', ogTitle, true);
    setMeta('og:description', ogDesc, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:type', 'website', true);
    
    setMeta('twitter:card', twitterCard);
    setMeta('twitter:site', globalSEO.twitterSite);
    setMeta('twitter:creator', globalSEO.twitterCreator);

    // Robots
    const robots = pageSEO.robots || 'index, follow';
    setMeta('robots', robots);

    // Canonical
    let link = document.querySelector(`link[rel="canonical"]`);
    const canUrl = pageSEO.canonicalURL || globalSEO.canonicalURL;
    if (canUrl) {
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canUrl);
    }

  }, [pageId, db.globalSEO, db.pageSEO]);
};
