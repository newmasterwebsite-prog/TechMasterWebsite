import React, { useState, useEffect, useRef } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { ConfirmDialog, Dialog } from '../../components/ui/Dialog';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { 
  Newspaper, Search, Plus, Edit2, Trash2, X, Eye, 
  ExternalLink, Calendar, Award, Globe, Link2, LayoutDashboard, Film, Download, Image as ImageIcon,
  CheckCircle, Settings, Filter, GripVertical, FileText, LayoutTemplate, Share2, Music, Video, FileDown, Layers,
  Camera, Users, Mic, Type, FileArchive, Flag, Zap, Upload
} from 'lucide-react';

import { GlobalMediaManager } from '../../components/ui/GlobalMediaManager';

/* =========================================================
   CLOUDINARY UPLOAD TRIGGER
========================================================= */
const CloudinaryUploadTrigger = ({ label, value, onClickTarget }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-3">
        {value && (
          <div className="w-12 h-10 rounded border border-zinc-700 bg-black overflow-hidden flex-shrink-0 flex items-center justify-center relative group">
             {(typeof value === 'string' && value.match(/\.(pdf|zip)$/i)) ? <FileDown className="w-5 h-5 text-zinc-500" /> : <img src={value} className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />}
          </div>
        )}
        <button type="button" onClick={onClickTarget} className="flex-1 border border-dashed border-zinc-700 hover:border-luxury-gold hover:text-luxury-gold bg-zinc-950/50 rounded-lg px-4 py-2.5 text-sm flex items-center justify-center transition-colors text-zinc-400">
          <Upload className="w-4 h-4 mr-2" />
          {value ? 'Replace File (Cloudinary)' : 'Browse & Upload (Cloudinary)'}
        </button>
      </div>
    </div>
  );
};


/* =========================================================
   TILT CARD COMPONENT
========================================================= */
const TiltCard = ({ children, className = '', maxTilt = 10, glowColor = 'rgba(212, 175, 55, 0.12)', ...props }) => {
  const cardRef = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rotateX.set(-((y / rect.height) - 0.5) * maxTilt);
    rotateY.set(((x / rect.width) - 0.5) * maxTilt);
    setGlowPos({ x, y });
  };

  return (
    <motion.div
      ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => { setIsHovered(false); rotateX.set(0); rotateY.set(0); }}
      style={{ transformStyle: 'preserve-3d', rotateX: smoothRotateX, rotateY: smoothRotateY }}
      animate={{ scale: isHovered ? 1.015 : 1, z: isHovered ? 30 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`glass-panel rounded-lg shadow-card-glow border border-zinc-800/80 relative overflow-hidden transition-all duration-300 ${className}`}
      {...props}
    >
      {isHovered && <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle 120px at ${glowPos.x}px ${glowPos.y}px, ${glowColor}, transparent 80%)`, mixBlendMode: 'screen', zIndex: 1 }} />}
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }} className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};

export const MediaCoverage = () => {
  const { db, updateSection } = useDatabase();
  
  // Data Collections
  const mediaHero = db?.mediaHero || {};
  const mediaFilters = db?.mediaFilters || [];
  const mediaCategories = db?.mediaCategories || [];
  const mediaShowreels = db?.mediaShowreels || [];
  const mediaDownloads = db?.mediaDownloads || [];
  const mediaGallery = db?.mediaGallery || [];

  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  // MAIN CATEGORIES (Matching Visitor Site)
  const VISITOR_CATEGORIES = [
    'Photos', 'Videos', 'Behind The Scenes', 'Campaign Images', 'Events', 
    'Celebrity Moments', 'Awards', 'Travel', 'Lifestyle', 'Interviews', 
    'Press Releases', 'Podcasts', 'TV Features', 'Magazine Features'
  ];

  // Main UI State
  const [activeNavTab, setActiveNavTab] = useState('Overview'); 
  
  // Section Edit States
  const [heroDraft, setHeroDraft] = useState(mediaHero);
  
  // Form Editor States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingType, setEditingType] = useState(null); 
  const [editingId, setEditingId] = useState(null);
  const [draftItem, setDraftItem] = useState({});
  const [activeFormTab, setActiveFormTab] = useState('General'); 

  // Media Manager State
  const [isMediaManagerOpen, setIsMediaManagerOpen] = useState(false);
  const [mediaManagerTarget, setMediaManagerTarget] = useState(null);

  const handleMediaSelect = (url, mediaObj) => {
    if (mediaManagerTarget === 'thumbnail') {
       setDraftItem(p => ({...p, thumbnail: url}));
    } else if (mediaManagerTarget === 'mediaFile') {
       setDraftItem(p => ({...p, mediaFile: url}));
    } else if (mediaManagerTarget === 'albumFiles') {
       const fileObj = mediaObj || { url, type: 'image', caption: 'Media File', id: Date.now() };
       setDraftItem(p => ({ ...p, albumFiles: [...(p.albumFiles || []), fileObj] }));
    } else if (mediaManagerTarget === 'heroBgImage') {
       setHeroDraft(p => ({...p, bgImageUrl: url}));
    } else if (mediaManagerTarget === 'heroBgVideo') {
       setHeroDraft(p => ({...p, bgVideoUrl: url}));
    }
    setIsMediaManagerOpen(false);
  };
  
  // Array inputs
  const [tagInput, setTagInput] = useState('');

  // Bulk and Delete
  const [deletingType, setDeletingType] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const SUPPORTED_MEDIA_TYPES = [
    "Single Image", "Multiple Images", "Single Video", "Multiple Videos", "Podcast Audio", 
    "YouTube Video", "Vimeo Video", "Instagram Reel", "Facebook Video", "TV Interview", 
    "TV Feature", "Magazine Cover", "Magazine PDF", "Press Release PDF", "Event Album", 
    "Campaign Album", "Celebrity Photos", "Behind The Scenes", "Awards Gallery", 
    "Lifestyle Gallery", "Travel Gallery", "Interview Gallery", "Brand Collaboration Gallery", 
    "Commercial Shoot Gallery", "Client Work Gallery", "Portfolio Images", "Portfolio Videos"
  ];

  /* ===========================
        STATISTICS
  =========================== */
  const stats = {
    gallery: mediaGallery.length,
    showreels: mediaShowreels.length,
    downloads: mediaDownloads.length,
    total: mediaGallery.length + mediaShowreels.length + mediaDownloads.length
  };

  /* ===========================
        HERO HANDLER
  =========================== */
  const handleSaveHero = () => {
    updateSection('mediaHero', null, heroDraft);
    showToast("✅ Media Hero Settings Saved!");
  };

  /* ===========================
        EDITOR HANDLERS
  =========================== */
  const handleStartAdd = (type, categoryOverride = null) => {
    setEditingType(type);
    setEditingId(null);
    setActiveFormTab('General');
    let initialDraft = { status: 'Published', order: 1, tags: [], albumFiles: [] };
    
    if (type === 'Gallery') {
       initialDraft = { ...initialDraft, mediaType: 'Single Image', status: 'Published', albumFiles: [] };
       if (categoryOverride) {
          initialDraft.category = categoryOverride;
          // Smart Defaults based on category
          if (categoryOverride === 'Podcasts') initialDraft.mediaType = 'Podcast Audio';
          if (categoryOverride === 'Videos' || categoryOverride === 'TV Features') initialDraft.mediaType = 'Single Video';
          if (categoryOverride === 'Press Releases') initialDraft.mediaType = 'Press Release PDF';
          if (categoryOverride === 'Magazine Features') initialDraft.mediaType = 'Magazine PDF';
          if (categoryOverride === 'Events' || categoryOverride === 'Campaign Images') initialDraft.mediaType = 'Multiple Images';
       }
    }
    if (type === 'Showreel') initialDraft = { ...initialDraft, active: true, duration: '01:00' };
    if (type === 'Download') initialDraft = { ...initialDraft, active: true, fileType: 'PDF' };
    
    setDraftItem(initialDraft);
    setIsEditorOpen(true);
  };

  const handleStartEdit = (type, item) => {
    setEditingType(type);
    setEditingId(item.id);
    setActiveFormTab('General');
    setDraftItem({ ...item, tags: item.tags || [], albumFiles: item.albumFiles || [], files: item.files || [] });
    setIsEditorOpen(true);
  };

  const handleSaveItem = () => {
    if (!draftItem.title) return showToast("❌ Title is required.");
    const collectionKey = editingType === 'Gallery' ? 'mediaGallery' : editingType === 'Showreel' ? 'mediaShowreels' : 'mediaDownloads';
    const currentList = db[collectionKey] || [];
    
    let nextList = [];
    if (editingId) {
      nextList = currentList.map(item => item.id === editingId ? { ...draftItem, id: item.id, updatedAt: new Date().toISOString() } : item);
      showToast(`✅ ${editingType} updated successfully.`);
    } else {
      nextList = [...currentList, { ...draftItem, id: `${editingType.toLowerCase()}-${Date.now()}`, createdAt: new Date().toISOString() }];
      showToast(`✅ New ${editingType} created.`);
    }
    updateSection(collectionKey, null, nextList);
    setIsEditorOpen(false);
  };

  const handleDeleteItem = () => {
    const collectionKey = deletingType === 'Gallery' ? 'mediaGallery' : deletingType === 'Showreel' ? 'mediaShowreels' : 'mediaDownloads';
    const currentList = db[collectionKey] || [];
    updateSection(collectionKey, null, currentList.filter(item => item.id !== deletingId));
    setDeletingId(null);
    setDeletingType(null);
    showToast("✅ Record deleted.");
  };

  const handleArrayAdd = (field, input, setInput) => {
    if (input.trim() && !draftItem[field]?.includes(input.trim())) {
      setDraftItem(prev => ({ ...prev, [field]: [...(prev[field] || []), input.trim()] }));
      setInput('');
    }
  };
  const handleArrayRemove = (field, val) => {
    setDraftItem(prev => ({ ...prev, [field]: (prev[field] || []).filter(i => i !== val) }));
  };
  const handleRemoveAlbumFile = (id) => {
    setDraftItem(prev => ({ ...prev, albumFiles: (prev.albumFiles || []).filter(i => i.id !== id) }));
  };

  /* ===========================
        TAXONOMY MANAGER
  =========================== */
  const [taxDraft, setTaxDraft] = useState({ name: '', slug: '', isVisible: true, order: 1 });
  const [editingTaxId, setEditingTaxId] = useState(null);
  const [activeTaxTab, setActiveTaxTab] = useState('Filters');

  const handleSaveTax = () => {
    if (!taxDraft.name) return;
    const collection = activeTaxTab === 'Filters' ? 'mediaFilters' : 'mediaCategories';
    const list = db[collection] || [];
    let nextList = [];
    if (editingTaxId) {
      nextList = list.map(item => item.id === editingTaxId ? { ...taxDraft, id: item.id } : item);
    } else {
      nextList = [...list, { ...taxDraft, id: `tax-${Date.now()}` }];
    }
    updateSection(collection, null, nextList);
    setTaxDraft({ name: '', slug: '', isVisible: true, order: 1 });
    setEditingTaxId(null);
    showToast(`✅ ${activeTaxTab} updated.`);
  };
  const handleDeleteTax = (id, collection) => {
    updateSection(collection, null, (db[collection] || []).filter(i => i.id !== id));
    showToast("✅ Deleted.");
  };

  /* ===========================
        RENDER HELPERS
  =========================== */
  const renderDashboardCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-zinc-950/40 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-center items-center">
        <ImageIcon className="w-5 h-5 text-blue-400 mb-2" />
        <span className="text-2xl font-serif text-white">{stats.gallery}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">Universal Assets</span>
      </div>
      <div className="bg-zinc-950/40 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-center items-center">
        <Film className="w-5 h-5 text-rose-400 mb-2" />
        <span className="text-2xl font-serif text-white">{stats.showreels}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">Showreels</span>
      </div>
      <div className="bg-zinc-950/40 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-center items-center">
        <Download className="w-5 h-5 text-emerald-400 mb-2" />
        <span className="text-2xl font-serif text-white">{stats.downloads}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">Downloads</span>
      </div>
      <div className="bg-luxury-gold/10 border border-luxury-gold/30 p-4 rounded-xl flex flex-col justify-center items-center shadow-gold-glow-sm">
        <Award className="w-5 h-5 text-luxury-gold mb-2" />
        <span className="text-2xl font-serif text-luxury-gold">{stats.total}</span>
        <span className="text-[10px] uppercase tracking-wider text-luxury-gold/70">Total Assets</span>
      </div>
    </div>
  );

  const renderTable = (list, type) => (
    <div className="bg-zinc-950/40 border border-zinc-800/50 rounded-2xl overflow-x-auto w-full">
      <table className="w-full text-left text-sm text-zinc-400 whitespace-nowrap">
        <thead className="bg-zinc-900/50 border-b border-zinc-850 text-[10px] uppercase tracking-wider font-semibold">
          <tr>
            <th className="px-5 py-4 w-10"><input type="checkbox" className="rounded border-zinc-700 bg-black cursor-pointer" /></th>
            <th className="px-5 py-4">Title & Thumbnail</th>
            <th className="px-5 py-4">Category / Type</th>
            <th className="px-5 py-4">Status / Features</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-850/50">
          {list.length === 0 && <tr><td colSpan="5" className="px-5 py-8 text-center text-zinc-500 italic">No items found.</td></tr>}
          {list.map((item, idx) => (
            <tr key={item.id} className="hover:bg-zinc-900/20 transition-colors group">
              <td className="px-5 py-4"><input type="checkbox" className="rounded border-zinc-700 bg-black cursor-pointer" /></td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {item.thumbnail ? <img src={item.thumbnail} className="w-12 h-8 rounded-md object-cover border border-zinc-800" /> : <div className="w-12 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center"><ImageIcon className="w-3 h-3 text-zinc-600"/></div>}
                  </div>
                  <div className="flex flex-col"><span className="text-zinc-200 font-medium truncate max-w-[200px]">{item.title}</span><span className="text-[10px] text-zinc-500 truncate max-w-[200px]">{item.subtitle}</span></div>
                </div>
              </td>
              <td className="px-5 py-4"><div className="flex flex-col gap-1"><span className="text-zinc-300 text-xs">{item.category || item.mediaOutlet}</span><span className="text-[10px] text-zinc-500">{item.format || item.mediaType || item.fileType}</span></div></td>
              <td className="px-5 py-4">
                 <div className="flex flex-col gap-1.5 items-start">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-medium border ${item.status === 'Published' || item.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{item.status || (item.active ? 'Published' : 'Draft')}</span>
                    {item.isFeatured && <span className="text-[9px] text-luxury-gold flex items-center gap-1"><Zap className="w-2.5 h-2.5"/> Featured</span>}
                 </div>
              </td>
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button onClick={() => handleStartEdit(type, item)} className="p-1.5 hover:bg-zinc-900 rounded text-zinc-400 hover:text-luxury-gold" title="Edit"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => { setDeletingType(type); setDeletingId(item.id); }} className="p-1.5 hover:bg-zinc-900 rounded text-rose-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 text-left relative min-h-screen pb-20 overflow-x-hidden">
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-zinc-900 border border-luxury-gold/50 text-luxury-gold px-6 py-3 rounded-full shadow-gold-glow flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm tracking-wide">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      {!isEditorOpen && (
        <>
          <div className="border-b border-zinc-800/80 pb-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-medium tracking-wide text-zinc-100 flex items-center gap-3">
                <Globe className="w-7 h-7 text-luxury-gold" /> Media & Coverage CMS
              </h1>
              <p className="text-sm text-zinc-500 mt-2">Centralized command center mapping exactly to your visitor website.</p>
            </div>
          </div>

          {/* TAILORED MAIN NAV - MATCHING VISITOR SITE */}
          <div className="flex flex-wrap gap-2 mb-2 pb-4 border-b border-zinc-800/50">
            {['Overview', ...VISITOR_CATEGORIES, 'Showreels', 'Press Kits', 'Taxonomy'].map(tab => (
              <button key={tab} onClick={() => setActiveNavTab(tab)} className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[1.5px] border transition-all ${activeNavTab === tab ? "bg-luxury-gold border-luxury-gold text-black shadow-gold-glow-sm" : "bg-zinc-950 border-zinc-800/50 text-zinc-400 hover:border-zinc-700 hover:text-white"}`}>
                {tab}
              </button>
            ))}
          </div>
        </>
      )}

      {/* -------------------- OVERVIEW TAB -------------------- */}
      {!isEditorOpen && activeNavTab === 'Overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
          {renderDashboardCards()}
          <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif text-white">Media Hero Settings</h3>
              <div className="flex items-center gap-4">
                 <span className="text-xs text-zinc-500">Overlay En/Dis</span>
                 <Switch checked={heroDraft.overlayEnabled || false} onChange={v => setHeroDraft(p => ({...p, overlayEnabled: v}))} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Hero Badge" value={heroDraft.badge || ''} onChange={e => setHeroDraft(p => ({...p, badge: e.target.value}))} />
              <Input label="Hero Status" value={heroDraft.status || ''} onChange={e => setHeroDraft(p => ({...p, status: e.target.value}))} />
              <Input label="Main Title Line 1" value={heroDraft.titleLine1 || ''} onChange={e => setHeroDraft(p => ({...p, titleLine1: e.target.value}))} />
              <Input label="Main Title Line 2" value={heroDraft.titleLine2 || ''} onChange={e => setHeroDraft(p => ({...p, titleLine2: e.target.value}))} />
              <div className="md:col-span-2"><Input label="Description" textarea rows={2} value={heroDraft.description || ''} onChange={e => setHeroDraft(p => ({...p, description: e.target.value}))} /></div>
              <CloudinaryUploadTrigger label="Background Image (Upload)" value={heroDraft.bgImageUrl || ''} onClickTarget={() => { setMediaManagerTarget('heroBgImage'); setIsMediaManagerOpen(true); }} />
              <CloudinaryUploadTrigger label="Background Video (Upload)" value={heroDraft.bgVideoUrl || ''} onClickTarget={() => { setMediaManagerTarget('heroBgVideo'); setIsMediaManagerOpen(true); }} />
            </div>
            <div className="flex justify-end mt-6 gap-3">
              <Button onClick={() => setHeroDraft(mediaHero)} variant="secondary">Reset</Button>
              <Button onClick={handleSaveHero} variant="primary" className="bg-luxury-gold text-black">Save Hero</Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* -------------------- TAXONOMY TAB -------------------- */}
      {!isEditorOpen && activeNavTab === 'Taxonomy' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
           <div className="flex gap-2">
              <button onClick={() => setActiveTaxTab('Filters')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTaxTab === 'Filters' ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-500 hover:text-white'}`}>Media Filters (Tabs)</button>
              <button onClick={() => setActiveTaxTab('Categories')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTaxTab === 'Categories' ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-500 hover:text-white'}`}>Internal Categories</button>
           </div>
           <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-black/40 p-4 rounded-xl border border-zinc-800 mb-6">
                <div className="md:col-span-1"><Input label="Name" value={taxDraft.name || ''} onChange={e => setTaxDraft(p => ({...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')}))} /></div>
                <div className="md:col-span-1"><Input label="Slug" value={taxDraft.slug || ''} onChange={e => setTaxDraft(p => ({...p, slug: e.target.value}))} /></div>
                <div className="md:col-span-1"><Input label="Order" type="number" value={taxDraft.order || ''} onChange={e => setTaxDraft(p => ({...p, order: e.target.value}))} /></div>
                <div className="md:col-span-1 flex flex-col gap-1.5"><label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Visibility</label><Switch checked={taxDraft.isVisible !== false} onChange={v => setTaxDraft(p => ({...p, isVisible: v}))} /></div>
                <div className="md:col-span-1 flex justify-end"><Button onClick={handleSaveTax} variant="primary" className="bg-luxury-gold text-black w-full">{editingTaxId ? 'Update' : 'Add'}</Button></div>
              </div>
              <div className="flex flex-col gap-2">
                {(activeTaxTab === 'Filters' ? mediaFilters : mediaCategories).sort((a,b)=> (a.order||0)-(b.order||0)).map(f => (
                  <div key={f.id} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-4 h-4 text-zinc-600" />
                      <span className="font-bold text-zinc-200">{f.name}</span>
                      <span className="text-xs text-zinc-500 font-mono">/{f.slug}</span>
                      <span className={`px-2 py-0.5 text-[10px] rounded-full border ${f.isVisible !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>{f.isVisible !== false ? 'Visible' : 'Hidden'}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setTaxDraft(f); setEditingTaxId(f.id); }} className="p-1.5 text-zinc-400 hover:text-luxury-gold"><Edit2 className="w-4 h-4"/></button>
                      <button onClick={() => handleDeleteTax(f.id, activeTaxTab === 'Filters' ? 'mediaFilters' : 'mediaCategories')} className="p-1.5 text-zinc-400 hover:text-rose-500"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </motion.div>
      )}

      {/* -------------------- DYNAMIC CATEGORY TABLES -------------------- */}
      {!isEditorOpen && VISITOR_CATEGORIES.includes(activeNavTab) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
           <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl text-white">Manage {activeNavTab}</h3>
              <Button onClick={() => handleStartAdd('Gallery', activeNavTab)} className="bg-luxury-gold text-black border border-luxury-gold shadow-gold-glow-sm">
                Add {activeNavTab.replace(/s$/, '')} Item
              </Button>
           </div>
           {renderTable(mediaGallery.filter(item => item.category === activeNavTab), 'Gallery')}
        </motion.div>
      )}

      {!isEditorOpen && activeNavTab === 'Showreels' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
           <div className="flex justify-between items-center"><h3 className="font-serif text-xl">Manage Video Showreels</h3><Button onClick={() => handleStartAdd('Showreel')} className="bg-luxury-gold text-black">Add Showreel</Button></div>
           {renderTable(mediaShowreels, 'Showreel')}
        </motion.div>
      )}

      {!isEditorOpen && activeNavTab === 'Press Kits' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
           <div className="flex justify-between items-center"><h3 className="font-serif text-xl">Manage Download Assets</h3><Button onClick={() => handleStartAdd('Download')} className="bg-luxury-gold text-black">Add Download Asset</Button></div>
           {renderTable(mediaDownloads, 'Download')}
        </motion.div>
      )}


      {/* =========================================================
          MEGA MULTI-TYPE EDITOR (TAILORED SMART FIELDS)
      ========================================================= */}
      {isEditorOpen && (
        <div className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-140px)]">
          <div className="w-full lg:w-2/3 bg-zinc-950/40 border border-luxury-gold/20 p-6 rounded-2xl shadow-gold-glow-lg flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800/80 z-20">
              <h2 className="text-xl font-serif text-white flex items-center gap-2">
                 <Edit2 className="w-5 h-5 text-luxury-gold"/> 
                 {editingId ? `Edit ${draftItem.category || editingType}` : `Create New ${draftItem.category || editingType}`}
              </h2>
              <button onClick={() => { if(window.confirm("Discard changes?")) setIsEditorOpen(false); }} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
            </div>

            <div className="flex gap-4 border-b border-zinc-800 pt-4 mb-4">
              {['General', 'Media', 'Taxonomy', 'SEO'].map(tab => (
                <button key={tab} onClick={() => setActiveFormTab(tab)} className={`pb-2 text-sm font-medium uppercase tracking-wider transition-colors border-b-2 ${activeFormTab === tab ? 'border-luxury-gold text-luxury-gold' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>{tab}</button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6">
              
              {/* GENERAL TAB */}
              {activeFormTab === 'General' && (
                <div className="flex flex-col gap-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div className="md:col-span-2"><Input label="Record Title *" value={draftItem.title || ''} onChange={(e) => setDraftItem(p => ({...p, title: e.target.value}))} /></div>
                      
                      {editingType === 'Gallery' && (
                        <>
                           <div className="md:col-span-2"><Input label="Subtitle / Short Excerpt" value={draftItem.subtitle || ''} onChange={(e) => setDraftItem(p => ({...p, subtitle: e.target.value}))} /></div>
                           
                           {/* Show full article body only for written content */}
                           {['Press Releases', 'Magazine Features', 'Interviews', 'TV Features'].includes(draftItem.category) ? (
                              <div className="md:col-span-2"><Input label="Full Article / Content Body" textarea rows={6} value={draftItem.description || ''} onChange={(e) => setDraftItem(p => ({...p, description: e.target.value}))} /></div>
                           ) : (
                              <div className="md:col-span-2"><Input label="Description / Caption" textarea rows={3} value={draftItem.description || ''} onChange={(e) => setDraftItem(p => ({...p, description: e.target.value}))} /></div>
                           )}
                           
                           {/* ROLES SECTION */}
                           <div className="md:col-span-2 mt-4 pt-4 border-t border-zinc-800">
                             <h4 className="text-sm font-bold text-luxury-gold mb-4 flex items-center gap-2"><Users className="w-4 h-4"/> Roles & Attribution</h4>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input label="Author / Journalist" value={draftItem.author || ''} onChange={(e) => setDraftItem(p => ({...p, author: e.target.value}))} />
                                <Input label="Photographer" value={draftItem.photographer || ''} onChange={(e) => setDraftItem(p => ({...p, photographer: e.target.value}))} />
                                <Input label="Videographer / Director" value={draftItem.videographer || ''} onChange={(e) => setDraftItem(p => ({...p, videographer: e.target.value}))} />
                             </div>
                           </div>

                           {/* ASSET SPECS SECTION */}
                           <div className="md:col-span-2 mt-2 pt-4 border-t border-zinc-800">
                             <h4 className="text-sm font-bold text-luxury-gold mb-4 flex items-center gap-2"><Settings className="w-4 h-4"/> Specifications</h4>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['Podcasts', 'Videos', 'TV Features', 'Interviews'].includes(draftItem.category) && (
                                   <Input label="Media Duration (e.g. 15:30)" value={draftItem.mediaDuration || ''} onChange={(e) => setDraftItem(p => ({...p, mediaDuration: e.target.value}))} />
                                )}
                                <Input label="Resolution (e.g. 4K)" value={draftItem.resolution || ''} onChange={(e) => setDraftItem(p => ({...p, resolution: e.target.value}))} />
                                <Input label="Publish Date" type="date" value={draftItem.publishDate || ''} onChange={(e) => setDraftItem(p => ({...p, publishDate: e.target.value}))} />
                             </div>
                           </div>
                        </>
                      )}

                      {editingType === 'Showreel' && (
                        <>
                           <Input label="Duration (e.g. 02:45)" value={draftItem.duration || ''} onChange={(e) => setDraftItem(p => ({...p, duration: e.target.value}))} />
                           <Input label="Youtube URL" value={draftItem.youtubeUrl || ''} onChange={(e) => setDraftItem(p => ({...p, youtubeUrl: e.target.value}))} />
                           <div className="md:col-span-2"><Input label="Description" textarea rows={3} value={draftItem.description || ''} onChange={(e) => setDraftItem(p => ({...p, description: e.target.value}))} /></div>
                        </>
                      )}
                      {editingType === 'Download' && (
                        <>
                           <Input label="File Size (e.g. 15MB)" value={draftItem.fileSize || ''} onChange={(e) => setDraftItem(p => ({...p, fileSize: e.target.value}))} />
                           <Input label="Button Text" value={draftItem.buttonText || ''} onChange={(e) => setDraftItem(p => ({...p, buttonText: e.target.value}))} />
                           <div className="md:col-span-2"><Input label="Description" textarea rows={2} value={draftItem.description || ''} onChange={(e) => setDraftItem(p => ({...p, description: e.target.value}))} /></div>
                        </>
                      )}
                   </div>
                </div>
              )}

              {/* MEDIA TAB (SMART RENDERING) */}
              {activeFormTab === 'Media' && (
                <div className="flex flex-col gap-6">
                   <h4 className="text-sm font-bold text-luxury-gold mb-2 border-b border-zinc-800 pb-2 flex items-center gap-2"><Upload className="w-4 h-4"/> Direct File Uploads</h4>
                   
                   <CloudinaryUploadTrigger label="Primary Thumbnail Upload" value={draftItem.thumbnail || ''} onClickTarget={() => { setMediaManagerTarget('thumbnail'); setIsMediaManagerOpen(true); }} />
                   
                   {/* SHOW SPECIFIC UPLOADERS BASED ON CATEGORY */}
                   {editingType === 'Gallery' && (
                      <div className="mt-4">
                         {draftItem.category === 'Podcasts' && (
                            <CloudinaryUploadTrigger label="Upload Podcast Audio (MP3/WAV)" value={draftItem.mediaFile || ''} onClickTarget={() => { setMediaManagerTarget('mediaFile'); setIsMediaManagerOpen(true); }} />
                         )}
                         {['Videos', 'TV Features', 'Interviews'].includes(draftItem.category) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <CloudinaryUploadTrigger label="Upload Source Video (MP4)" value={draftItem.mediaFile || ''} onClickTarget={() => { setMediaManagerTarget('mediaFile'); setIsMediaManagerOpen(true); }} />
                               <Input label="OR External URL (Youtube/Vimeo)" value={draftItem.mediaUrl || ''} onChange={(e) => setDraftItem(p => ({...p, mediaUrl: e.target.value}))} />
                            </div>
                         )}
                         {['Press Releases', 'Magazine Features'].includes(draftItem.category) && (
                            <CloudinaryUploadTrigger label="Upload Document (PDF)" value={draftItem.mediaFile || ''} onClickTarget={() => { setMediaManagerTarget('mediaFile'); setIsMediaManagerOpen(true); }} />
                         )}
                      </div>
                   )}

                   {/* BULK ALBUM BUILDER WITH DRAG & DROP (Show mostly for Images/Events/Campaigns) */}
                   {editingType === 'Gallery' && !['Podcasts', 'Press Releases'].includes(draftItem.category) && (
                     <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60 mt-4">
                        <div className="flex justify-between items-center mb-4">
                           <h4 className="text-sm font-bold text-luxury-gold flex items-center gap-2"><Layers className="w-4 h-4"/> Bulk Album / Gallery Builder</h4>
                           <span className="text-xs text-zinc-500 font-mono">{(draftItem.albumFiles || []).length} / 100 Files</span>
                        </div>
                        
                        <div className="border-2 border-dashed border-zinc-700 bg-zinc-950/40 rounded-xl p-8 text-center hover:border-luxury-gold hover:bg-luxury-gold/5 transition-colors cursor-pointer mb-6" onClick={() => { setMediaManagerTarget('albumFiles'); setIsMediaManagerOpen(true); }}>
                          <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
                          <p className="text-sm text-zinc-300 font-medium">Click to open Cloudinary Media Manager</p>
                          <p className="text-xs text-zinc-500 mt-1">Select or upload bulk Images & Videos</p>
                        </div>

                        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                           {(!draftItem.albumFiles || draftItem.albumFiles.length === 0) && <p className="text-xs text-zinc-600 italic text-center py-4">No album files added.</p>}
                           {(draftItem.albumFiles || []).map((file, i) => (
                             <div key={file.id || i} className="flex justify-between items-center bg-zinc-900 p-2 rounded border border-zinc-800">
                                <div className="flex items-center gap-3 w-[80%]">
                                   <div className="w-10 h-10 rounded bg-black flex items-center justify-center border border-zinc-700 overflow-hidden">
                                     {file.type?.toLowerCase() === 'video' ? <Film className="w-4 h-4 text-zinc-500"/> : <img src={file.url} className="w-full h-full object-cover" />}
                                   </div>
                                   <div className="flex flex-col overflow-hidden w-full"><span className="text-xs text-zinc-300 truncate">{file.caption || file.title || 'Media File'}</span><span className="text-[10px] text-zinc-500 truncate uppercase">{file.type}</span></div>
                                </div>
                                <button onClick={() => handleRemoveAlbumFile(file.id)} className="text-rose-400 p-1.5 hover:bg-rose-500/10 rounded"><Trash2 className="w-4 h-4"/></button>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}
                </div>
              )}

              {/* TAXONOMY TAB */}
              {activeFormTab === 'Taxonomy' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                   <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Category</label>
                      <select value={draftItem.category || ''} onChange={e => setDraftItem(p => ({...p, category: e.target.value}))} className="bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 disabled:opacity-50" disabled>
                         <option value={draftItem.category}>{draftItem.category}</option>
                      </select>
                      <span className="text-[10px] text-luxury-gold/70">Category is locked to current section.</span>
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Specific Media Format</label>
                      <select value={draftItem.mediaType || ''} onChange={e => setDraftItem(p => ({...p, mediaType: e.target.value}))} className="bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100">
                         {SUPPORTED_MEDIA_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                   </div>

                   <div className="md:col-span-2 flex flex-col gap-2 mt-2">
                     <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tags</label>
                     <div className="flex gap-2"><input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if(e.key==='Enter'){ e.preventDefault(); handleArrayAdd('tags', tagInput, setTagInput);}}} placeholder="Type tag..." className="flex-1 bg-black/40 border border-zinc-800 rounded-lg px-4 py-2 text-sm" /><Button onClick={() => handleArrayAdd('tags', tagInput, setTagInput)} variant="secondary">Add</Button></div>
                     <div className="flex flex-wrap gap-2 mt-1">{draftItem.tags?.map(t => <span key={t} className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded-full text-xs text-zinc-300 flex items-center gap-1">{t} <X className="w-3 h-3 cursor-pointer" onClick={() => handleArrayRemove('tags', t)}/></span>)}</div>
                   </div>

                   <div className="md:col-span-2 mt-4 pt-4 border-t border-zinc-800">
                     <h4 className="text-sm font-bold text-luxury-gold mb-4 flex items-center gap-2"><Flag className="w-4 h-4"/> Feature Toggles</h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
                        <div className="flex items-center gap-3"><Switch checked={draftItem.isFeatured || draftItem.featured || false} onChange={v => setDraftItem(p => ({...p, isFeatured: v, featured: v}))} /><span className="text-xs text-zinc-300">Featured</span></div>
                        <div className="flex items-center gap-3"><Switch checked={draftItem.isTrending || false} onChange={v => setDraftItem(p => ({...p, isTrending: v}))} /><span className="text-xs text-zinc-300">Trending</span></div>
                        <div className="flex items-center gap-3"><Switch checked={draftItem.isLatest || false} onChange={v => setDraftItem(p => ({...p, isLatest: v}))} /><span className="text-xs text-zinc-300">Latest</span></div>
                        <div className="flex items-center gap-3"><Switch checked={draftItem.isPinned || false} onChange={v => setDraftItem(p => ({...p, isPinned: v}))} /><span className="text-xs text-zinc-300">Pinned</span></div>
                     </div>
                   </div>

                   <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Publish Status</label><select value={draftItem.status || (draftItem.active ? 'Published' : 'Draft')} onChange={e => setDraftItem(p => ({...p, status: e.target.value, active: e.target.value === 'Published'}))} className="bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100"><option value="Published">Published</option><option value="Draft">Draft</option><option value="Hidden">Hidden</option><option value="Archived">Archived</option><option value="Scheduled">Scheduled</option></select></div>
                   <Input label="Sort / Display Order" type="number" value={draftItem.order || 1} onChange={e => setDraftItem(p => ({...p, order: e.target.value}))} />
                </div>
              )}

              {/* SEO TAB */}
              {activeFormTab === 'SEO' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                   <Input label="SEO Meta Title" value={draftItem.seoTitle || ''} onChange={e => setDraftItem(p => ({...p, seoTitle: e.target.value}))} />
                   <Input label="URL Slug" value={draftItem.slug || ''} onChange={e => setDraftItem(p => ({...p, slug: e.target.value}))} />
                   <div className="md:col-span-2"><Input label="SEO Meta Description" textarea rows={2} value={draftItem.seoDescription || ''} onChange={e => setDraftItem(p => ({...p, seoDescription: e.target.value}))} /></div>
                   <div className="md:col-span-2"><Input label="Meta Keywords (Comma separated)" value={draftItem.seoKeywords || ''} onChange={e => setDraftItem(p => ({...p, seoKeywords: e.target.value}))} /></div>
                   <Input label="Open Graph Image URL" value={draftItem.ogImage || ''} onChange={e => setDraftItem(p => ({...p, ogImage: e.target.value}))} />
                   <Input label="Twitter Image URL" value={draftItem.twitterImage || ''} onChange={e => setDraftItem(p => ({...p, twitterImage: e.target.value}))} />
                   <Input label="Canonical URL" value={draftItem.canonicalUrl || ''} onChange={e => setDraftItem(p => ({...p, canonicalUrl: e.target.value}))} />
                   <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Schema Type</label><select value={draftItem.schemaType || 'Article'} onChange={e => setDraftItem(p => ({...p, schemaType: e.target.value}))} className="bg-black/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100"><option value="Article">Article</option><option value="ImageGallery">ImageGallery</option><option value="VideoObject">VideoObject</option><option value="AudioObject">AudioObject</option></select></div>
                </div>
              )}

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/80 mt-auto bg-zinc-950/90 z-20">
              <Button onClick={() => { if(window.confirm("Discard changes?")) setIsEditorOpen(false); }} variant="secondary">Cancel</Button>
              <Button onClick={handleSaveItem} variant="primary" className="bg-luxury-gold text-black font-bold px-8">Save Asset</Button>
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW */}
          <div className="hidden lg:flex lg:w-1/3 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden items-center justify-center">
             <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest"><Eye className="w-4 h-4"/> Visitor Preview</div>
             <div className="w-full max-w-[400px]">
                <TiltCard maxTilt={8}>
                  <div className="flex flex-col h-full justify-between p-4">
                    <div>
                      <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/5 mb-4 relative bg-zinc-900 flex items-center justify-center">
                        {draftItem.thumbnail ? <img src={draftItem.thumbnail} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" /> : <ImageIcon className="w-8 h-8 text-zinc-700" />}
                        <div className="absolute top-3 left-3 bg-black/85 border border-white/10 px-2 py-1 rounded text-[9px] uppercase tracking-[1px] font-mono text-luxury-gold/90">{draftItem.category}</div>
                        
                        {/* Smart Overlay Icons */}
                        {draftItem.category === 'Videos' || draftItem.category === 'TV Features' ? <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center"><Film className="w-5 h-5 text-white"/></div></div> : null}
                        {draftItem.category === 'Podcasts' ? <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center"><Mic className="w-5 h-5 text-white"/></div></div> : null}
                        {draftItem.category === 'Press Releases' || draftItem.category === 'Magazine Features' ? <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur border border-white/20 flex items-center justify-center"><FileText className="w-5 h-5 text-white"/></div></div> : null}
                        
                        {draftItem.albumFiles?.length > 1 && <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur border border-white/10 px-2 py-1 rounded text-[9px] font-mono text-white flex items-center gap-1"><Layers className="w-3 h-3"/> +{draftItem.albumFiles.length}</div>}
                      </div>
                      <h3 className="font-serif text-xl text-white font-medium mb-1">{draftItem.title || 'Asset Title'}</h3>
                      {draftItem.subtitle && <h4 className="text-xs text-luxury-gold mb-2 font-mono uppercase tracking-wider">{draftItem.subtitle}</h4>}
                      <p className="text-zinc-400 text-xs font-light leading-relaxed mb-4 line-clamp-3">{draftItem.description || draftItem.shortDescription || 'Asset description preview goes here...'}</p>
                    </div>
                  </div>
                </TiltCard>
             </div>
          </div>
        </div>
      )}

      {/* POPUPS */}
      <ConfirmDialog isOpen={deletingId !== null} onClose={() => { setDeletingId(null); setDeletingType(null); }} title={`Delete Asset`} message="Are you sure you want to permanently delete this record? This action cannot be undone." confirmText="Delete Permanently" cancelText="Cancel" onConfirm={handleDeleteItem} />
    {isMediaManagerOpen && (
        <GlobalMediaManager 
           onClose={() => setIsMediaManagerOpen(false)} 
           onSelect={handleMediaSelect} 
           defaultTypeFilter="All"
        />
      )}
    </div>
  );
}
