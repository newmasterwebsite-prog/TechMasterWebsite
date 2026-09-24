import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useMediaManager } from '../../context/MediaContext';
import { 
  Globe, Search, Check, Sparkles, FileText, Image as ImageIcon, 
  Code, ShieldCheck, Eye, RefreshCw, Save 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const SEOManager = () => {
  const { db, updateSection } = useDatabase();
  const { openMediaManager } = useMediaManager();
  const [activeTab, setActiveTab] = useState('global');
  const [isSaved, setIsSaved] = useState(false);

  const defaultSEO = {
    metaTitle: "TechMaster — India's Most-Watched Media Production House",
    metaDescription: "Tech Master Digital Pvt Ltd builds and runs a portfolio of high-scale content channels across tech, automobiles, and entertainment with over 1B+ monthly views.",
    keywords: "TechMaster, Arvind Kharra, Tech Youtube, Media Production House, Next Univerz, Master Wheels",
    canonicalUrl: "https://techmaster.in",
    ogImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    twitterCard: "summary_large_image",
    allowIndex: true,
    allowFollow: true,
    robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://techmaster.in/sitemap.xml",
    schemaMarkup: `{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "TechMaster Digital Pvt Ltd",\n  "url": "https://techmaster.in"\n}`
  };

  const seoData = db?.globalSEO || defaultSEO;
  const [formData, setFormData] = useState(seoData);

  const handleSave = (e) => {
    e.preventDefault();
    updateSection('globalSEO', formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-luxury-gold shadow-gold-glow animate-pulse" />
            <h1 className="text-2xl font-serif font-bold tracking-wide uppercase text-white">SEO & Search Control Center</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-light">
            Global Search Engine Optimization, Open Graph Cards, Robots.txt, Canonical URLs & Schema Markup.
          </p>
        </div>

        <Button
          onClick={handleSave}
          variant="gold"
          className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold"
        >
          {isSaved ? <Check className="w-4 h-4 text-black" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'SEO Settings Saved!' : 'Save SEO Settings'}
        </Button>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
        {[
          { id: 'global', label: 'Global Meta Tags', icon: Globe },
          { id: 'opengraph', label: 'Open Graph & Social', icon: ImageIcon },
          { id: 'robots', label: 'Robots & Sitemap', icon: FileText },
          { id: 'schema', label: 'JSON-LD Schema Markup', icon: Code }
        ].map(tab => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content Panel */}
      <form onSubmit={handleSave} className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-xl space-y-6">
        {activeTab === 'global' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Global Meta Title ({formData.metaTitle?.length || 0} / 60 chars)
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-luxury-gold/40"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Meta Description ({formData.metaDescription?.length || 0} / 160 chars)
              </label>
              <textarea
                rows={3}
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-luxury-gold/40"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">Meta Keywords</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="keyword1, keyword2..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-luxury-gold/40"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">Canonical Base URL</label>
              <input
                type="url"
                value={formData.canonicalUrl}
                onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-luxury-gold/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-900">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowIndex}
                  onChange={(e) => setFormData({ ...formData, allowIndex: e.target.checked })}
                  className="rounded border-zinc-800 text-luxury-gold focus:ring-0"
                />
                <span className="text-xs text-zinc-300">Allow Indexing (index)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowFollow}
                  onChange={(e) => setFormData({ ...formData, allowFollow: e.target.checked })}
                  className="rounded border-zinc-800 text-luxury-gold focus:ring-0"
                />
                <span className="text-xs text-zinc-300">Allow Link Following (follow)</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'opengraph' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">OG Share Image</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={formData.ogImage}
                  onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-zinc-200 font-mono focus:outline-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openMediaManager({ onSelect: (url) => setFormData({ ...formData, ogImage: url }) })}
                >
                  Choose Media
                </Button>
              </div>
              {formData.ogImage && (
                <div className="mt-3 aspect-video w-48 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                  <img src={formData.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">Twitter Card Type</label>
              <select
                value={formData.twitterCard}
                onChange={(e) => setFormData({ ...formData, twitterCard: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-200"
              >
                <option value="summary_large_image">summary_large_image (Recommended)</option>
                <option value="summary">summary</option>
                <option value="player">player</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'robots' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">Robots.txt Content</label>
              <textarea
                rows={6}
                value={formData.robotsTxt}
                onChange={(e) => setFormData({ ...formData, robotsTxt: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-200 font-mono focus:outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">JSON-LD Organization Schema</label>
              <textarea
                rows={8}
                value={formData.schemaMarkup}
                onChange={(e) => setFormData({ ...formData, schemaMarkup: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-200 font-mono focus:outline-none"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
