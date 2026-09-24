import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog, Dialog } from '../../components/ui/Dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Search, Settings, Save, AlertCircle, RefreshCw, 
  FileText, CheckCircle, ExternalLink, Image, Code, Trash2, Plus, LayoutTemplate, Layers, Database,
  Link, Edit2, GripVertical, Download, Server
} from 'lucide-react';

export const SEOManagement = () => {
  const { db, updateSection, updateItem, deleteItem, addItem } = useDatabase();
  
  // Data State
  const globalSEO = db.globalSEO || {};
  const pageSEO = db.pageSEO || [];
  
  // Tab State
  const [activeTab, setActiveTab] = useState('global'); // 'global', 'meta', 'files', 'redirects'
  
  // Local Draft for Global SEO
  const [globalDraft, setGlobalDraft] = useState(globalSEO);

  // Sync Draft when DB updates
  useEffect(() => {
    setGlobalDraft(db.globalSEO || {});
  }, [db.globalSEO]);

  // Social Links Modal State (inside Global SEO)
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState(null);
  const [socialForm, setSocialForm] = useState({});

  // Meta tag State (Page SEO Tab)
  const [selectedPageId, setSelectedPageId] = useState('');
  const [pageDraft, setPageDraft] = useState({});

  // Initialize Page Draft
  useEffect(() => {
    if (pageSEO.length > 0 && !selectedPageId) {
      setSelectedPageId(pageSEO[0].id);
    }
  }, [pageSEO]);

  useEffect(() => {
    if (selectedPageId) {
      const page = pageSEO.find(p => p.id === selectedPageId);
      if (page) setPageDraft(page);
    }
  }, [selectedPageId, pageSEO]);


  // Redirects State
  const [redirectsList, setRedirectsList] = useState([
    { id: 'redir-1', fromPath: '/old-journey', toPath: '/founder-journey', code: '301 Permanent' },
    { id: 'redir-2', fromPath: '/vogue-collab', toPath: '/brand-collaborations', code: '301 Permanent' },
    { id: 'redir-3', fromPath: '/contact-us', toPath: '/contact', code: '302 Temporary' }
  ]);
  const [newRedirect, setNewRedirect] = useState({ fromPath: '', toPath: '', code: '301 Permanent' });
  const [redirectSearch, setRedirectSearch] = useState('');
  const [redirectFilter, setRedirectFilter] = useState('All');

  const handleAddRedirect = (e) => {
    e.preventDefault();
    if (!newRedirect.fromPath.trim() || !newRedirect.toPath.trim()) return;
    setRedirectsList([...redirectsList, { id: `redir-${Date.now()}`, ...newRedirect }]);
    setNewRedirect({ fromPath: '', toPath: '', code: '301 Permanent' });
    showToast('Redirect Rule Added');
  };

  // UI States
  const [toast, setToast] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'social', 'redirect'

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // Handlers
  const handleSaveGlobal = (e) => {
    if(e) e.preventDefault();
    updateSection('globalSEO', null, globalDraft);
    showToast('Global SEO Settings Saved!');
  };

  const handleSavePage = (e) => {
    if(e) e.preventDefault();
    updateSection('pageSEO', null, pageSEO.map(p => p.id === pageDraft.id ? pageDraft : p));
    showToast('Page SEO Saved!');
  };

  const handleOpenSocial = (item = null) => {
    setEditingSocial(item);
    setSocialForm(item || { platform: 'Instagram', url: '', order: (globalDraft.socialLinks?.length || 0) + 1 });
    setIsSocialModalOpen(true);
  };

  const handleSaveSocial = (e) => {
    e.preventDefault();
    const list = globalDraft.socialLinks || [];
    let updatedList;
    if (editingSocial) {
      updatedList = list.map(s => s.id === editingSocial.id ? { ...socialForm, id: s.id } : s);
    } else {
      updatedList = [...list, { ...socialForm, id: `gsl-${Date.now()}` }];
    }
    const newDraft = { ...globalDraft, socialLinks: updatedList };
    setGlobalDraft(newDraft);
    updateSection('globalSEO', null, newDraft);
    setIsSocialModalOpen(false);
    showToast('Social Link Saved!');
  };

  const handleDeleteConfirm = () => {
    if (deleteType === 'social') {
      const newDraft = { ...globalDraft, socialLinks: (globalDraft.socialLinks || []).filter(s => s.id !== deleteId) };
      setGlobalDraft(newDraft);
      updateSection('globalSEO', null, newDraft);
    } else if (deleteType === 'redirect') {
      // Assuming redirects is stored in a separate collection or we can mock it
    }
    setDeleteId(null); setDeleteType(null); showToast('Deleted successfully');
  };

  // SEO Score Algorithm
  const calculateSEOScore = () => {
    let score = 100;
    const details = [];
    
    // Resolve active fields based on inheritance
    const activeTitle = pageDraft.useGlobalSEO ? globalDraft.defaultTitle : pageDraft.metaTitle;
    const activeDesc = pageDraft.useGlobalSEO ? globalDraft.defaultDescription : pageDraft.metaDescription;
    const activeKeywords = pageDraft.useGlobalSEO ? globalDraft.defaultKeywords : pageDraft.keywords;
    const activeOgImg = pageDraft.useGlobalSEO ? globalDraft.defaultOGImage : (pageDraft.ogImage || globalDraft.defaultOGImage);

    if (!activeTitle) { score -= 20; details.push({ ok: false, text: "Title is missing." }); }
    else if (activeTitle.length < 30) { score -= 10; details.push({ ok: false, text: "Title is too short." }); }
    else if (activeTitle.length > 65) { score -= 10; details.push({ ok: false, text: "Title is too long." }); }
    else { details.push({ ok: true, text: "Title length is optimal." }); }

    if (!activeDesc) { score -= 20; details.push({ ok: false, text: "Description is missing." }); }
    else if (activeDesc.length < 110) { score -= 10; details.push({ ok: false, text: "Description is too short." }); }
    else if (activeDesc.length > 160) { score -= 10; details.push({ ok: false, text: "Description is too long." }); }
    else { details.push({ ok: true, text: "Description length is optimal." }); }

    if (!activeKeywords) { score -= 10; details.push({ ok: false, text: "No focus keywords found." }); }
    else { details.push({ ok: true, text: "Focus keywords present." }); }

    if (!activeOgImg) { score -= 15; details.push({ ok: false, text: "Missing OG Image." }); }
    else { details.push({ ok: true, text: "OG Image configured." }); }

    if (globalDraft.globalToggles?.enableSchema) { details.push({ ok: true, text: "Structured Data Schema Enabled." }); }
    else { score -= 10; details.push({ ok: false, text: "Structured Data Disabled." }); }

    return { score: Math.max(0, score), details };
  };

  const { score: seoScore, details: seoDetails } = calculateSEOScore();

  return (
    <div className="flex flex-col gap-6 text-left relative min-h-screen pb-20">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-zinc-900 border border-luxury-gold/50 text-luxury-gold px-6 py-3 rounded-full shadow-gold-glow flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-wide text-zinc-100 flex items-center gap-3">
            <Globe className="w-7 h-7 text-luxury-gold" /> Enterprise SEO CMS
          </h1>
          <p className="text-sm text-zinc-500 mt-2">Centralized indexing, metadata, and OpenGraph architecture.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => showToast('SEO Cache Cleared')}>Clear Cache</Button>
          <Button onClick={() => window.open(globalDraft.websiteUrl || '#', '_blank')}>Preview Site</Button>
        </div>
      </div>

      <div className="flex border-b border-zinc-900/60 gap-2 overflow-x-auto pb-4">
        {[
          { id: 'global', label: 'Global SEO Settings', icon: Globe },
          { id: 'meta', label: 'Page SEO', icon: Layers },
          { id: 'files', label: 'Robots & Sitemap', icon: FileText },
          { id: 'redirects', label: 'Redirects', icon: Link }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[1.5px] border transition-all flex items-center gap-2 ${activeTab === tab.id ? "bg-luxury-gold border-luxury-gold text-black shadow-gold-glow-sm" : "bg-zinc-950 border-zinc-800/50 text-zinc-400 hover:border-zinc-700 hover:text-white"}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* --- TAB 1: GLOBAL SEO SETTINGS --- */}
      {activeTab === 'global' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
          
          <div className="flex justify-end sticky top-24 z-40 bg-black/80 backdrop-blur-md py-4 border-b border-zinc-800 -mx-6 px-6">
             <Button size="lg" onClick={handleSaveGlobal} className="shadow-gold-glow"><Save className="w-5 h-5 mr-2"/> Save Global SEO</Button>
          </div>

          <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="1. Global Toggles">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <Switch label="Enable Global SEO" checked={globalDraft.globalToggles?.enableSEO !== false} onChange={v => setGlobalDraft(p => ({...p, globalToggles: {...p.globalToggles, enableSEO: v}}))} />
              <Switch label="Allow Search Engine Indexing" checked={globalDraft.globalToggles?.allowIndexing !== false} onChange={v => setGlobalDraft(p => ({...p, globalToggles: {...p.globalToggles, allowIndexing: v}}))} />
              <Switch label="Generate Sitemap Auto" checked={globalDraft.globalToggles?.autoSitemap !== false} onChange={v => setGlobalDraft(p => ({...p, globalToggles: {...p.globalToggles, autoSitemap: v}}))} />
              <Switch label="Generate Robots Auto" checked={globalDraft.globalToggles?.autoRobots !== false} onChange={v => setGlobalDraft(p => ({...p, globalToggles: {...p.globalToggles, autoRobots: v}}))} />
              <Switch label="Force HTTPS Canonical" checked={globalDraft.globalToggles?.forceHTTPS !== false} onChange={v => setGlobalDraft(p => ({...p, globalToggles: {...p.globalToggles, forceHTTPS: v}}))} />
              <Switch label="Enable Structured Data (Schema)" checked={globalDraft.globalToggles?.enableSchema !== false} onChange={v => setGlobalDraft(p => ({...p, globalToggles: {...p.globalToggles, enableSchema: v}}))} />
            </div>
          </Card>

          <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="2. Website Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input label="Website Name" value={globalDraft.websiteName || ''} onChange={e => setGlobalDraft(p => ({...p, websiteName: e.target.value}))} />
              <Input label="Website URL" value={globalDraft.websiteUrl || ''} onChange={e => setGlobalDraft(p => ({...p, websiteUrl: e.target.value}))} />
              <Input label="Default Title" value={globalDraft.defaultTitle || ''} onChange={e => setGlobalDraft(p => ({...p, defaultTitle: e.target.value}))} />
              <Input label="Default Canonical URL" value={globalDraft.canonicalURL || ''} onChange={e => setGlobalDraft(p => ({...p, canonicalURL: e.target.value}))} />
            </div>
            <div className="mt-4"><Input label="Default Meta Description" textarea rows={2} value={globalDraft.defaultDescription || ''} onChange={e => setGlobalDraft(p => ({...p, defaultDescription: e.target.value}))} /></div>
            <div className="mt-4"><Input label="Default Keywords (comma separated)" value={globalDraft.defaultKeywords || ''} onChange={e => setGlobalDraft(p => ({...p, defaultKeywords: e.target.value}))} /></div>
          </Card>

          <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="3. Default Open Graph">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input label="Default OG Title" value={globalDraft.defaultOGTitle || ''} onChange={e => setGlobalDraft(p => ({...p, defaultOGTitle: e.target.value}))} />
              <Input label="Twitter Card Type" value={globalDraft.twitterCard || ''} onChange={e => setGlobalDraft(p => ({...p, twitterCard: e.target.value}))} />
              <Input label="Twitter Site" value={globalDraft.twitterSite || ''} onChange={e => setGlobalDraft(p => ({...p, twitterSite: e.target.value}))} />
              <Input label="Twitter Creator" value={globalDraft.twitterCreator || ''} onChange={e => setGlobalDraft(p => ({...p, twitterCreator: e.target.value}))} />
            </div>
            <div className="mt-4"><Input label="Default OG Description" textarea rows={2} value={globalDraft.defaultOGDescription || ''} onChange={e => setGlobalDraft(p => ({...p, defaultOGDescription: e.target.value}))} /></div>
            <div className="mt-4"><Input label="Default SEO Fallback Image URL" value={globalDraft.defaultOGImage || ''} onChange={e => setGlobalDraft(p => ({...p, defaultOGImage: e.target.value}))} /></div>
          </Card>

          <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="4. Analytics & Tracking Scripts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input label="Google Analytics ID" value={globalDraft.analytics?.googleAnalyticsId || ''} onChange={e => setGlobalDraft(p => ({...p, analytics: {...p.analytics, googleAnalyticsId: e.target.value}}))} />
              <Input label="Google Tag Manager ID" value={globalDraft.analytics?.gtmId || ''} onChange={e => setGlobalDraft(p => ({...p, analytics: {...p.analytics, gtmId: e.target.value}}))} />
              <Input label="Meta Pixel ID" value={globalDraft.analytics?.metaPixelId || ''} onChange={e => setGlobalDraft(p => ({...p, analytics: {...p.analytics, metaPixelId: e.target.value}}))} />
              <Input label="Microsoft Clarity ID" value={globalDraft.analytics?.clarityId || ''} onChange={e => setGlobalDraft(p => ({...p, analytics: {...p.analytics, clarityId: e.target.value}}))} />
              <Input label="LinkedIn Insight Tag" value={globalDraft.analytics?.linkedinInsight || ''} onChange={e => setGlobalDraft(p => ({...p, analytics: {...p.analytics, linkedinInsight: e.target.value}}))} />
            </div>
            <div className="mt-4"><Input label="Custom Header Script" textarea rows={3} placeholder="<script>...</script>" value={globalDraft.analytics?.customHeaderScript || ''} onChange={e => setGlobalDraft(p => ({...p, analytics: {...p.analytics, customHeaderScript: e.target.value}}))} /></div>
            <div className="mt-4"><Input label="Custom Footer Script" textarea rows={3} placeholder="<script>...</script>" value={globalDraft.analytics?.customFooterScript || ''} onChange={e => setGlobalDraft(p => ({...p, analytics: {...p.analytics, customFooterScript: e.target.value}}))} /></div>
          </Card>

          <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="5. Organization Social Links">
             <div className="flex justify-end mb-4"><Button size="sm" onClick={() => handleOpenSocial()}><Plus className="w-4 h-4 mr-1"/> Add Social Profile</Button></div>
             <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/20">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider">
                    <tr><th className="p-3 w-10">Order</th><th className="p-3">Platform</th><th className="p-3">URL</th><th className="p-3 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {(globalDraft.socialLinks || []).sort((a,b)=>(a.order||0)-(b.order||0)).map(s => (
                      <tr key={s.id} className="hover:bg-zinc-900/30 text-zinc-300">
                        <td className="p-3"><GripVertical className="w-3 h-3 inline text-zinc-500"/> {s.order}</td>
                        <td className="p-3 font-semibold">{s.platform}</td>
                        <td className="p-3 font-mono text-[10px] text-zinc-500">{s.url}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => handleOpenSocial(s)} className="text-zinc-400 hover:text-luxury-gold p-1"><Edit2 className="w-4 h-4"/></button>
                          <button onClick={() => { setDeleteId(s.id); setDeleteType('social'); }} className="text-rose-500 hover:text-rose-400 p-1 ml-2"><Trash2 className="w-4 h-4"/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </Card>

          <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="6. Business Information (Local SEO)">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <Input label="Business Name" value={globalDraft.businessInformation?.name || ''} onChange={e => setGlobalDraft(p => ({...p, businessInformation: {...p.businessInformation, name: e.target.value}}))} />
              <Input label="Business Type" value={globalDraft.businessInformation?.type || ''} onChange={e => setGlobalDraft(p => ({...p, businessInformation: {...p.businessInformation, type: e.target.value}}))} />
              <Input label="Email" value={globalDraft.businessInformation?.email || ''} onChange={e => setGlobalDraft(p => ({...p, businessInformation: {...p.businessInformation, email: e.target.value}}))} />
              <Input label="Phone" value={globalDraft.businessInformation?.phone || ''} onChange={e => setGlobalDraft(p => ({...p, businessInformation: {...p.businessInformation, phone: e.target.value}}))} />
              <Input label="Address" value={globalDraft.businessInformation?.address || ''} onChange={e => setGlobalDraft(p => ({...p, businessInformation: {...p.businessInformation, address: e.target.value}}))} />
              <Input label="City" value={globalDraft.businessInformation?.city || ''} onChange={e => setGlobalDraft(p => ({...p, businessInformation: {...p.businessInformation, city: e.target.value}}))} />
              <Input label="State" value={globalDraft.businessInformation?.state || ''} onChange={e => setGlobalDraft(p => ({...p, businessInformation: {...p.businessInformation, state: e.target.value}}))} />
              <Input label="Country" value={globalDraft.businessInformation?.country || ''} onChange={e => setGlobalDraft(p => ({...p, businessInformation: {...p.businessInformation, country: e.target.value}}))} />
              <Input label="Postal Code" value={globalDraft.businessInformation?.postalCode || ''} onChange={e => setGlobalDraft(p => ({...p, businessInformation: {...p.businessInformation, postalCode: e.target.value}}))} />
              <Input label="Latitude" value={globalDraft.businessInformation?.latitude || ''} onChange={e => setGlobalDraft(p => ({...p, businessInformation: {...p.businessInformation, latitude: e.target.value}}))} />
              <Input label="Longitude" value={globalDraft.businessInformation?.longitude || ''} onChange={e => setGlobalDraft(p => ({...p, businessInformation: {...p.businessInformation, longitude: e.target.value}}))} />
              <Input label="Business Logo URL" value={globalDraft.businessInformation?.logo || ''} onChange={e => setGlobalDraft(p => ({...p, businessInformation: {...p.businessInformation, logo: e.target.value}}))} />
            </div>
          </Card>
          
          <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="7. Search Console Verification">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input label="Google Verification Code" value={globalDraft.verificationCodes?.google || ''} onChange={e => setGlobalDraft(p => ({...p, verificationCodes: {...p.verificationCodes, google: e.target.value}}))} />
              <Input label="Bing Verification" value={globalDraft.verificationCodes?.bing || ''} onChange={e => setGlobalDraft(p => ({...p, verificationCodes: {...p.verificationCodes, bing: e.target.value}}))} />
              <Input label="Yandex Verification" value={globalDraft.verificationCodes?.yandex || ''} onChange={e => setGlobalDraft(p => ({...p, verificationCodes: {...p.verificationCodes, yandex: e.target.value}}))} />
              <Input label="Pinterest Verification" value={globalDraft.verificationCodes?.pinterest || ''} onChange={e => setGlobalDraft(p => ({...p, verificationCodes: {...p.verificationCodes, pinterest: e.target.value}}))} />
            </div>
          </Card>
          
        </motion.div>
      )}

      {/* --- TAB 2: PAGE SEO --- */}
      {activeTab === 'meta' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-3 flex flex-col gap-4">
            
            <div className="flex justify-between items-center bg-black/80 backdrop-blur-md py-4 border-b border-zinc-800 sticky top-24 z-40">
              <Select 
                label="" 
                options={pageSEO.map(item => ({ value: item.id, label: `${item.pageName} ( ${item.slug} )` }))}
                value={selectedPageId}
                onChange={e => setSelectedPageId(e.target.value)}
              />
              <Button onClick={handleSavePage} className="shadow-gold-glow"><Save className="w-4 h-4 mr-2"/> Save Page SEO</Button>
            </div>

            <div className="glass-panel border border-zinc-800/80 rounded-lg p-5 bg-zinc-950/20">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
                 <h2 className="text-sm font-semibold text-zinc-200">Page Meta Configuration</h2>
                 <Switch label="Use Global SEO" checked={pageDraft.useGlobalSEO !== false} onChange={v => setPageDraft(p => ({...p, useGlobalSEO: v}))} />
              </div>
              
              {pageDraft.useGlobalSEO ? (
                 <div className="bg-zinc-900/40 border border-zinc-800 rounded p-6 text-center">
                    <Globe className="w-10 h-10 text-zinc-600 mx-auto mb-3"/>
                    <h3 className="text-sm font-bold text-zinc-300">Global Inheritance Active</h3>
                    <p className="text-xs text-zinc-500 mt-2">This page is automatically pulling SEO settings from the Global SEO tab. Toggle 'Use Global SEO' off to set custom metadata.</p>
                 </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Input label="Meta Title" value={pageDraft.metaTitle || ''} onChange={e => setPageDraft(p => ({...p, metaTitle: e.target.value}))} />
                  <Input label="Meta Description" textarea rows={3} value={pageDraft.metaDescription || ''} onChange={e => setPageDraft(p => ({...p, metaDescription: e.target.value}))} />
                  <Input label="Keywords" value={pageDraft.keywords || ''} onChange={e => setPageDraft(p => ({...p, keywords: e.target.value}))} />
                  <Input label="Canonical URL Override" value={pageDraft.canonicalURL || ''} onChange={e => setPageDraft(p => ({...p, canonicalURL: e.target.value}))} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-900 pt-4">
                    <Input label="OG Title" value={pageDraft.ogTitle || ''} onChange={e => setPageDraft(p => ({...p, ogTitle: e.target.value}))} />
                    <Input label="OG Image URL" value={pageDraft.ogImage || ''} onChange={e => setPageDraft(p => ({...p, ogImage: e.target.value}))} />
                  </div>
                  <Input label="OG Description" textarea rows={2} value={pageDraft.ogDescription || ''} onChange={e => setPageDraft(p => ({...p, ogDescription: e.target.value}))} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-900 pt-4">
                     <Select label="Robots" options={[{value:'index, follow', label:'Index, Follow'}, {value:'noindex, nofollow', label:'NoIndex, NoFollow'}, {value:'noindex, follow', label:'NoIndex, Follow'}]} value={pageDraft.robots || 'index, follow'} onChange={e => setPageDraft(p => ({...p, robots: e.target.value}))} />
                     <Input label="Sitemap Priority (0.0 - 1.0)" value={pageDraft.priority || '0.5'} onChange={e => setPageDraft(p => ({...p, priority: e.target.value}))} />
                     <Select label="Change Frequency" options={[{value:'always',label:'Always'},{value:'hourly',label:'Hourly'},{value:'daily',label:'Daily'},{value:'weekly',label:'Weekly'},{value:'monthly',label:'Monthly'},{value:'never',label:'Never'}]} value={pageDraft.changeFrequency || 'monthly'} onChange={e => setPageDraft(p => ({...p, changeFrequency: e.target.value}))} />
                     <Input label="Last Modified (YYYY-MM-DD)" value={pageDraft.lastModified || ''} onChange={e => setPageDraft(p => ({...p, lastModified: e.target.value}))} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-panel border border-zinc-800/80 rounded-lg p-5 bg-zinc-950/20 text-left">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-4">
                 <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5"><Search className="w-4 h-4 text-zinc-500" /> Google Live Snippet</h3>
                 <span className="text-[10px] font-bold text-luxury-gold">SCORE: {seoScore}/100</span>
              </div>
              <div className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-lg flex flex-col gap-1.5 overflow-hidden">
                <div className="text-[11px] text-zinc-500 font-sans truncate">{globalDraft.websiteUrl} {pageDraft.slug}</div>
                <h4 className="text-blue-400 hover:underline text-sm font-medium leading-snug cursor-pointer line-clamp-2">
                  {pageDraft.useGlobalSEO ? globalDraft.defaultTitle : pageDraft.metaTitle || "Meta Title Missing"}
                </h4>
                <p className="text-[11px] text-zinc-400 leading-normal line-clamp-3">
                  {pageDraft.useGlobalSEO ? globalDraft.defaultDescription : pageDraft.metaDescription || "Add description text..."}
                </p>
              </div>
            </div>

            <div className="glass-panel border border-zinc-800/80 rounded-lg p-5 bg-zinc-950/20 text-left">
              <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-2 mb-4 flex items-center gap-1.5"><Image className="w-4 h-4 text-zinc-500" /> Social Card Preview</h3>
              <div className="border border-zinc-800 bg-zinc-950/50 rounded overflow-hidden">
                <div className="h-32 bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                   <img src={pageDraft.useGlobalSEO ? globalDraft.defaultOGImage : (pageDraft.ogImage || globalDraft.defaultOGImage)} alt="OG Card" className="w-full h-full object-cover" />
                </div>
                <div className="p-3 border-t border-zinc-900 text-left">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block">{globalDraft.websiteUrl}</span>
                  <span className="font-serif text-xs font-bold text-zinc-300 line-clamp-1 mt-0.5">{pageDraft.useGlobalSEO ? globalDraft.defaultOGTitle : pageDraft.ogTitle}</span>
                  <span className="text-[10px] text-zinc-500 line-clamp-1 leading-normal mt-0.5">{pageDraft.useGlobalSEO ? globalDraft.defaultDescription : pageDraft.ogDescription}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel border border-zinc-800/80 rounded-lg p-5 bg-zinc-950/20 text-left">
              <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-2 mb-3">SEO Audit Metrics</h3>
              <div className="flex flex-col gap-2 mt-2">
                {seoDetails.map((det, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${det.ok ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span className={det.ok ? 'text-zinc-450' : 'text-zinc-300'}>{det.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: ROBOTS & SITEMAP --- */}
      {activeTab === 'files' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 max-w-4xl">
           <Card className="border-zinc-800 p-6 bg-zinc-950/40" title="Crawler Directives">
              <div className="flex justify-end gap-3 mb-4">
                 <Button variant="secondary" onClick={() => showToast('Robots.txt Reset to Default')}><RefreshCw className="w-4 h-4 mr-2"/> Reset Robots.txt</Button>
                 <Button onClick={() => showToast('Sitemap Regenerated Successfully!')}><Server className="w-4 h-4 mr-2"/> Regenerate Sitemap</Button>
              </div>
              <div className="flex flex-col gap-4">
                 <Input label="Sitemap XML URL" value={globalDraft.sitemapSettings || ''} onChange={e => setGlobalDraft(p => ({...p, sitemapSettings: e.target.value}))} />
                 <div className="flex flex-col gap-1.5">
                   <label className="text-xs font-semibold text-zinc-400">Robots.txt Content</label>
                   <textarea rows={8} value={globalDraft.robotsSettings || ''} onChange={e => setGlobalDraft(p => ({...p, robotsSettings: e.target.value}))} className="w-full bg-zinc-900 border border-zinc-800 rounded p-4 font-mono text-xs text-zinc-300 focus:border-luxury-gold outline-none" />
                 </div>
                 <div className="flex justify-end mt-4"><Button onClick={handleSaveGlobal} className="shadow-gold-glow"><Save className="w-4 h-4 mr-2"/> Save Directives</Button></div>
              </div>
           </Card>
        </motion.div>
      )}


      {/* --- TAB 4: REDIRECTS --- */}
      {activeTab === 'redirects' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start text-left">
          
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="glass-panel border border-zinc-800/80 rounded-lg overflow-hidden bg-zinc-950/5">
              <h2 className="text-sm font-semibold text-zinc-200 p-4 border-b border-zinc-900 bg-zinc-950/20 flex items-center justify-between">
                <span>Active 301/302 Redirect Maps</span>
                <Badge variant="gold" className="text-[9px]">{redirectsList.length} Active Rules</Badge>
              </h2>
              
              <div className="p-4 border-b border-zinc-900 flex gap-4">
                 <div className="relative flex-1">
                   <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                   <input type="text" placeholder="Search paths..." value={redirectSearch} onChange={e => setRedirectSearch(e.target.value)} className="w-full bg-zinc-900/60 border border-zinc-800 rounded pl-9 pr-3 py-2 text-xs text-zinc-200 focus:outline-none" />
                 </div>
                 <select value={redirectFilter} onChange={e => setRedirectFilter(e.target.value)} className="bg-zinc-900/60 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none">
                    <option value="All">All Types</option>
                    <option value="301 Permanent">301 Permanent</option>
                    <option value="302 Temporary">302 Temporary</option>
                 </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/30 text-zinc-500 font-mono uppercase tracking-wider text-[9px] border-b border-zinc-900">
                    <tr>
                      <th className="p-3.5 pl-5">Origin (From Path)</th>
                      <th className="p-3.5">Destination (To Path)</th>
                      <th className="p-3.5">Status Code</th>
                      <th className="p-3.5 pr-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60 text-zinc-350">
                    {redirectsList.filter(r => (redirectFilter === 'All' || r.code === redirectFilter) && (r.fromPath.includes(redirectSearch) || r.toPath.includes(redirectSearch))).map(rule => (
                      <tr key={rule.id} className="hover:bg-zinc-950/10">
                        <td className="p-3.5 pl-5 font-mono text-[11px] text-zinc-400">{rule.fromPath}</td>
                        <td className="p-3.5 font-mono text-[11px] text-luxury-gold">{rule.toPath}</td>
                        <td className="p-3.5"><Badge variant={rule.code.startsWith('301') ? 'success' : 'default'} className="text-[10px]">{rule.code}</Badge></td>
                        <td className="p-3.5 pr-5 text-right">
                          <button onClick={() => { setDeleteId(rule.id); setDeleteType('redirect'); }} className="p-1 rounded hover:bg-zinc-850 text-zinc-550 hover:text-rose-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="glass-panel border border-zinc-800/80 rounded-lg p-5 bg-zinc-950/20">
              <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-luxury-gold border-b border-zinc-900 pb-2 mb-4 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-luxury-gold" />
                Add Redirect Mapping
              </h3>
              <form onSubmit={handleAddRedirect} className="flex flex-col gap-3">
                <Input label="From Old Path URL" placeholder="e.g. /shoot-gallery" value={newRedirect.fromPath} onChange={e => setNewRedirect({ ...newRedirect, fromPath: e.target.value })} required />
                <Input label="To New Destination Path" placeholder="e.g. /portfolio" value={newRedirect.toPath} onChange={e => setNewRedirect({ ...newRedirect, toPath: e.target.value })} required />
                <Select label="Redirect Status Code" options={[{ value: '301 Permanent', label: '301 Moved Permanently' }, { value: '302 Temporary', label: '302 Moved Temporarily' }]} value={newRedirect.code} onChange={e => setNewRedirect({ ...newRedirect, code: e.target.value })} />
                <Button type="submit" variant="primary" className="w-full text-black font-semibold text-xs py-2.5 mt-2 flex items-center justify-center gap-1.5">Register Redirect Rule</Button>
              </form>
            </div>
          </div>
        </div>
      )}


      {/* Modals */}
      <Dialog isOpen={isSocialModalOpen} onClose={() => setIsSocialModalOpen(false)} title={editingSocial ? "Edit Social Profile" : "Add Social Profile"} size="sm">
        <form onSubmit={handleSaveSocial} className="flex flex-col gap-4 mt-2">
          <Input label="Platform Name (e.g. Instagram)" value={socialForm.platform || ''} onChange={e => setSocialForm(p => ({...p, platform: e.target.value}))} required />
          <Input label="Profile URL" value={socialForm.url || ''} onChange={e => setSocialForm(p => ({...p, url: e.target.value}))} required />
          <Input label="Sort Order" type="number" value={socialForm.order || ''} onChange={e => setSocialForm(p => ({...p, order: parseInt(e.target.value)}))} required />
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-900"><Button type="button" variant="secondary" onClick={() => setIsSocialModalOpen(false)}>Cancel</Button><Button type="submit">Save Profile</Button></div>
        </form>
      </Dialog>
      <ConfirmDialog isOpen={deleteId !== null} onClose={() => { setDeleteId(null); setDeleteType(null); }} onConfirm={handleDeleteConfirm} />

    </div>
  );
};
