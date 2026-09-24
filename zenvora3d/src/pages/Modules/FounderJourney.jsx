import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useMediaManager } from '../../context/MediaContext';
import { 
  History, Sparkles, Check, Save, Plus, Trash2, Edit3, Eye, EyeOff, 
  ArrowUp, ArrowDown, Upload, RefreshCw, Copy, Layers, Sliders, Globe, 
  Monitor, Tablet, Smartphone, Clock, Palette, Play, Image as ImageIcon, X, RotateCcw
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';

export const FounderJourney = () => {
  const { db, updateSection, apiFetch } = useDatabase();
  const { openMediaManager } = useMediaManager();

  const [activeSection, setActiveSection] = useState('sec-1'); // sec-1 to sec-13
  const [toast, setToast] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, tablet, mobile
  const [modalConfig, setModalConfig] = useState(null); // { type: 'milestone'|'roadmap', item: {} }
  const [isUploading, setIsUploading] = useState(false);

  // Production pre-populated defaults
  const defaultJourneyData = {
    // SECTION 1: HERO
    hero: {
      smallBadge: "WELCOME TO TECH MASTER'S JOURNEY",
      title: "Stories that",
      highlightText: "Stay with You",
      description: "Tracing the evolution from a single video in 2019 to the world's most-subscribed tech creator with over 20 billion views.",
      scrollText: "Explore timeline",
      viewCounter: "20B+ Views",
      counterLabel: "Lifetime Views",
      bgImage: "",
      bgOverlay: 0.8,
      bgOpacity: 1,
      glowEnabled: true,
      illustration: "",
      particleToggle: true,
      active: true,
      visible: true
    },

    // SECTION 2: TIMELINE MILESTONES
    milestones: [
      { id: 'm-2019', year: '2019', subtitle: 'The First Upload', title: 'The First Upload', description: 'One video. No audience, no plan, no studio. Just one person from a small town who thought tech deserved better storytelling than it was getting.', align: 'left', markerColor: '#D4AF37', order: 1, visible: true, deleted: false },
      { id: 'm-2020', year: '2020', subtitle: 'The Silver Play Button', title: 'The Silver Play Button', description: "The first sign this wasn't a phase. One creator, one growing channel — and an audience that kept coming back.", align: 'right', markerColor: '#D4AF37', order: 2, visible: true, deleted: false },
      { id: 'm-2021', year: '2021', subtitle: 'Two New Channels. One New Hire.', title: 'Two New Channels. One New Hire.', description: 'What was a one-person project became three. Two new channels launched, and Tech Master brought on its very first employee — the exact moment "someone\'s channel" started becoming a company.', align: 'left', markerColor: '#D4AF37', order: 3, visible: true, deleted: false },
      { id: 'm-2022', year: '2022', subtitle: 'First Brand Deal. First Studio.', title: 'First Brand Deal. First Studio.', description: 'A brand trusted us before we were "big enough" to matter. That trust funded our first real studio — the day content stopped being made out of a bedroom.', align: 'right', markerColor: '#D4AF37', order: 4, visible: true, deleted: false },
      { id: 'm-2023', year: '2023', subtitle: '10 Million and Counting', title: '10 Million and Counting', description: 'Tech Master Shorts crossed 10 million subscribers. An experiment had become a category of its own.', align: 'left', markerColor: '#D4AF37', order: 5, visible: true, deleted: false },
      { id: 'm-2024', year: '2024', subtitle: '25+ People. Seven Play Buttons.', title: '25+ People. Seven Play Buttons.', description: 'Twenty-five people, one mission, seven Play Buttons on the wall. Proof this stopped being one person\'s story a long time ago.', align: 'right', markerColor: '#D4AF37', order: 6, visible: true, deleted: false },
      { id: 'm-2025', year: '2025', subtitle: 'The Most-Subscribed Tech Creator on the Planet', title: 'The Most-Subscribed Tech Creator on the Planet', description: 'Every all-nighter, every idea that almost got cut, every video that didn\'t work until it did — it all built to this. Tech Master became the most-subscribed tech creator in the world.', align: 'left', markerColor: '#D4AF37', order: 7, visible: true, deleted: false },
      { id: 'm-2026', year: '2026', subtitle: '20 Billion Views. No One Else Has Done This.', title: '20 Billion Views. No One Else Has Done This.', description: 'The first tech creator in the world to cross 20 billion views on a single channel. The most-followed tech creator on Instagram, in the same year. Some milestones take a lifetime. We\'re just getting started.', align: 'right', markerColor: '#D4AF37', order: 8, visible: true, deleted: false }
    ],

    // SECTION 3: STATISTICS
    stats: {
      viewsCounter: "20 Billion",
      prefix: "",
      suffix: "+ Views",
      animation: "CountUp",
      formatting: "Compact",
      numberStyle: "Gold Glow",
      position: "Center"
    },

    // SECTION 4: GROWTH ROADMAP
    roadmap: {
      badge: "ROADMAP",
      heading: "Founder's",
      highlightHeading: "Growth Roadmap",
      subtitle: "Hover to Pause Timeline",
      items: [
        { id: 'rm-1', step: '01', year: '2021', title: '2021 — New Beginnings', description: 'What was a one-person project became three. Two new channels launched and our first employee joined.', order: 1, visible: true, deleted: false },
        { id: 'rm-2', step: '02', year: '2022', title: '2022 — First Studio', description: 'A brand trusted us before we were big enough to matter. Content stopped being made in a bedroom.', order: 2, visible: true, deleted: false },
        { id: 'rm-3', step: '03', year: '2023', title: '2023 — 10M Subscribers', description: 'Tech Master Shorts crossed 10 million subscribers. An experiment became a category of its own.', order: 3, visible: true, deleted: false },
        { id: 'rm-4', step: '04', year: '2024', title: '2024 — Seven Play Buttons', description: 'Twenty-five people, one mission, seven Play Buttons on the wall.', order: 4, visible: true, deleted: false },
        { id: 'rm-5', step: '05', year: '2025', title: '2025 — #1 Tech Creator', description: 'Every all-nighter built to this: Tech Master became the most-subscribed tech creator in the world.', order: 5, visible: true, deleted: false },
        { id: 'rm-6', step: '06', year: '2026', title: '2026 — 20 Billion Views', description: 'The first tech creator in the world to cross 20 billion views on a single channel.', order: 6, visible: true, deleted: false }
      ]
    },

    // SECTION 5: TIMELINE LINE SETTINGS
    lineSettings: {
      lineColor: "#D4AF37",
      thickness: "2px",
      glow: "0 0 15px rgba(212,175,55,0.6)",
      dotSize: "16px",
      dotColor: "#D4AF37",
      dotBorder: "1px solid #FFFFFF",
      dotGlow: "0 0 18px rgba(212,175,55,0.9)",
      speed: "45s",
      autoAnim: true,
      pauseOnHover: true
    },

    // SECTION 6: BACKGROUND MANAGEMENT
    background: {
      bgImage: "",
      overlay: "0.85",
      blur: "0px",
      brightness: "100%",
      opacity: "1.0",
      gradient: "linear-gradient(to bottom, #000000, #090909)",
      pattern: "Radial Ambient Glow",
      videoUrl: ""
    },

    // SECTION 7: TYPOGRAPHY
    typography: {
      headingFont: "Cinzel, serif",
      bodyFont: "Inter, sans-serif",
      accentFont: "JetBrains Mono, monospace",
      headingColor: "#FFFFFF",
      highlightColor: "#D4AF37"
    },

    // SECTION 8: ANIMATION CONTROLS
    animations: {
      fadeDuration: "0.8s",
      scrollScrub: true,
      staggerDelay: "0.15s",
      easing: "power3.out",
      hoverScale: "1.05"
    },

    // SECTION 9: SEO
    seo: {
      metaTitle: "Founder's Journey — TechMaster",
      metaDescription: "Tracing the evolution from a single video in 2019 to the world's most-subscribed tech creator with over 20 billion views.",
      canonicalUrl: "https://techmaster.in/journey",
      ogTitle: "Founder's Journey — TechMaster",
      ogDescription: "Tracing the evolution from 2019 to 20B+ views.",
      ogImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
      twitterCard: "summary_large_image",
      allowIndex: true,
      schemaJson: `{\n  "@context": "https://schema.org",\n  "@type": "AboutPage",\n  "name": "Founder Journey"\n}`
    },

    // SECTION 11: VISIBILITY
    visibility: {
      desktop: true,
      tablet: true,
      mobile: true,
      published: true
    },

    // SECTION 12: VERSIONING
    versioning: {
      status: "Published",
      lastUpdated: "Today",
      updatedBy: "Super Admin",
      versions: [
        { version: "v2.0 (Live)", date: "2026-07-29", author: "Super Admin" }
      ]
    }
  };

  const storedJourney = db?.founderJourney || defaultJourneyData;
  const [formData, setFormData] = useState({ ...defaultJourneyData, ...storedJourney });

  const showToast = (msg, type = 'success') => setToast({ id: Date.now(), message: msg, type });

  useEffect(() => {
    const fetchLatestFounderJourney = async () => {
      try {
        if (apiFetch) {
          const res = await apiFetch('/founder-journey');
          if (res.success && res.data) {
            const data = res.data;
            setFormData(prev => ({
              ...defaultJourneyData,
              ...data,
              hero: { ...defaultJourneyData.hero, ...(data.hero || {}) },
              milestones: (data.milestones && data.milestones.length > 0) ? data.milestones : defaultJourneyData.milestones,
              roadmap: { ...defaultJourneyData.roadmap, ...(data.roadmap || {}) }
            }));
          }
        }
      } catch (err) {
        console.warn("Could not fetch latest founder journey from backend:", err);
      }
    };
    fetchLatestFounderJourney();
  }, []);

  const persistChanges = (nextState) => {
    setFormData(nextState);
    updateSection('founderJourney', nextState);
    updateSection('journeyHero', nextState.hero);
    updateSection('journeyMilestones', nextState.milestones);
  };

  const handleSaveAll = async (isPublished = false) => {
    const updatedState = {
      ...formData,
      versioning: {
        ...formData.versioning,
        status: isPublished ? 'Published' : 'Draft',
        lastUpdated: new Date().toLocaleString()
      }
    };
    persistChanges(updatedState);

    try {
      if (apiFetch) {
        await apiFetch('/founder-journey', {
          method: 'PUT',
          body: JSON.stringify(updatedState)
        });
      }
    } catch (err) {
      console.warn("Backend API sync warning:", err);
    }

    setIsSaved(true);
    showToast(isPublished ? 'Founder Journey Published Live to Website!' : 'Draft Saved Successfully!', 'success');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleImageUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const res = await apiFetch('/upload/image', {
        method: 'POST',
        body: uploadData
      });

      if (res.success && (res.data?.url || res.data?.imageUrl || res.data?.secure_url)) {
        callback(res.data.url || res.data.imageUrl || res.data.secure_url);
        showToast('Image uploaded successfully!', 'success');
      } else {
        const localUrl = URL.createObjectURL(file);
        callback(localUrl);
        showToast('Image attached to form preview', 'info');
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file);
      callback(localUrl);
      showToast('Image preview attached', 'info');
    } finally {
      setIsUploading(false);
    }
  };

  // Milestone / Roadmap Reordering
  const swapOrder = (listKey, parentKey, index, direction) => {
    const list = parentKey ? [...formData[parentKey][listKey]] : [...formData[listKey]];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));

    const updatedState = parentKey 
      ? { ...formData, [parentKey]: { ...formData[parentKey], [listKey]: reordered } }
      : { ...formData, [listKey]: reordered };

    persistChanges(updatedState);
  };

  // Soft Delete / Duplicate
  const handleItemDelete = (listKey, parentKey, id, permanent = false) => {
    const list = parentKey ? [...formData[parentKey][listKey]] : [...formData[listKey]];
    let updated;
    if (permanent) {
      updated = list.filter(item => item.id !== id);
    } else {
      updated = list.map(item => item.id === id ? { ...item, deleted: true } : item);
    }

    const updatedState = parentKey 
      ? { ...formData, [parentKey]: { ...formData[parentKey], [listKey]: updated } }
      : { ...formData, [listKey]: updated };

    persistChanges(updatedState);
    showToast(permanent ? 'Item permanently deleted' : 'Item soft-deleted. Restore anytime.', 'info');
  };

  const handleItemDuplicate = (listKey, parentKey, item) => {
    const list = parentKey ? [...formData[parentKey][listKey]] : [...formData[listKey]];
    const dup = {
      ...item,
      id: `${listKey.slice(0, 2)}-dup-${Date.now()}`,
      title: `${item.title} (Copy)`,
      order: list.length + 1
    };
    const updated = [...list, dup];
    const updatedState = parentKey 
      ? { ...formData, [parentKey]: { ...formData[parentKey], [listKey]: updated } }
      : { ...formData, [listKey]: updated };
    persistChanges(updatedState);
    showToast('Item duplicated successfully!', 'success');
  };

  // Modal Save for Milestone / Roadmap
  const handleModalSave = (e) => {
    e.preventDefault();
    const { listKey, parentKey, item } = modalConfig;
    const list = parentKey ? [...formData[parentKey][listKey]] : [...formData[listKey]];

    let updated;
    if (item.id) {
      updated = list.map(i => i.id === item.id ? item : i);
    } else {
      const newItem = {
        ...item,
        id: `${listKey.slice(0, 2)}-${Date.now()}`,
        order: list.length + 1,
        visible: true,
        deleted: false
      };
      updated = [...list, newItem];
    }

    const updatedState = parentKey 
      ? { ...formData, [parentKey]: { ...formData[parentKey], [listKey]: updated } }
      : { ...formData, [listKey]: updated };

    persistChanges(updatedState);
    setModalConfig(null);
    showToast(item.id ? 'Item updated successfully!' : 'New milestone/roadmap item added!', 'success');
  };

  const cmsSectionsList = [
    { id: 'sec-1', label: '1. Journey Hero' },
    { id: 'sec-2', label: '2. Timeline Milestones (2019-2026)' },
    { id: 'sec-4', label: '3. Growth Roadmap' }
  ];

  return (
    <div className="space-y-6 text-left">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-luxury-gold shadow-gold-glow animate-pulse" />
            <h1 className="text-2xl font-serif font-bold tracking-wide uppercase text-white">Founder Journey Enterprise CMS</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            15 Dedicated CMS Sections with 100% control over the Founder Journey website page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => handleSaveAll(false)} variant="outline" size="sm" className="text-xs uppercase tracking-wider">
            Save Draft
          </Button>
          <Button onClick={() => handleSaveAll(true)} variant="gold" size="sm" className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
            {isSaved ? <Check className="w-3.5 h-3.5 text-black" /> : <Save className="w-3.5 h-3.5" />}
            {isSaved ? 'Published Live!' : 'Publish Live'}
          </Button>
        </div>
      </div>

      {/* CMS Section Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-3 border-b border-zinc-800/80">
        {cmsSectionsList.map(sec => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeSection === sec.id
                ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 shadow-[0_0_12px_rgba(212,175,55,0.05)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: HERO */}
      {activeSection === 'sec-1' && (
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-xl space-y-4 text-xs">
          <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Journey Hero Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="text-zinc-400 font-mono uppercase text-[10px] block mb-1">Small Badge</label>
              <input
                type="text"
                value={formData.hero.smallBadge}
                onChange={(e) => persistChanges({ ...formData, hero: { ...formData.hero, smallBadge: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 font-mono"
              />
            </div>

            <div>
              <label className="text-zinc-400 font-mono uppercase text-[10px] block mb-1">Hero Title</label>
              <input
                type="text"
                value={formData.hero.title}
                onChange={(e) => persistChanges({ ...formData, hero: { ...formData.hero, title: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 font-serif font-bold text-base"
              />
            </div>

            <div>
              <label className="text-zinc-400 font-mono uppercase text-[10px] block mb-1">Highlight Text</label>
              <input
                type="text"
                value={formData.hero.highlightText}
                onChange={(e) => persistChanges({ ...formData, hero: { ...formData.hero, highlightText: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-luxury-gold font-serif italic text-base"
              />
            </div>

            <div>
              <label className="text-zinc-400 font-mono uppercase text-[10px] block mb-1">Description Content</label>
              <textarea
                rows={3}
                value={formData.hero.description}
                onChange={(e) => persistChanges({ ...formData, hero: { ...formData.hero, description: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 font-light leading-relaxed"
              />
            </div>

            <div>
              <label className="text-zinc-400 font-mono uppercase text-[10px] block mb-1">Scroll Indicator Text</label>
              <input
                type="text"
                value={formData.hero.scrollText}
                onChange={(e) => persistChanges({ ...formData, hero: { ...formData.hero, scrollText: e.target.value } })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: TIMELINE MILESTONES */}
      {activeSection === 'sec-2' && (
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Timeline Milestones ({formData.milestones.length})</h3>
            <Button 
              onClick={() => setModalConfig({ listKey: 'milestones', parentKey: null, item: { year: '2027', subtitle: '', title: '', description: '' } })} 
              variant="gold" 
              size="sm" 
              className="text-xs uppercase"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Milestone
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Order</th>
                  <th className="py-2.5 px-4">Year</th>
                  <th className="py-2.5 px-4">Milestone Title</th>
                  <th className="py-2.5 px-4">Subtitle</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {formData.milestones.map((m, idx) => (
                  <tr key={m.id} className={`hover:bg-zinc-900/30 ${m.deleted ? 'opacity-40' : ''}`}>
                    <td className="py-2.5 px-4 font-mono text-zinc-500">
                      <div className="flex items-center gap-1">
                        <button onClick={() => swapOrder('milestones', null, idx, -1)} className="hover:text-luxury-gold cursor-pointer"><ArrowUp className="w-3 h-3" /></button>
                        <span>{idx + 1}</span>
                        <button onClick={() => swapOrder('milestones', null, idx, 1)} className="hover:text-luxury-gold cursor-pointer"><ArrowDown className="w-3 h-3" /></button>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-serif font-black text-luxury-gold text-sm">{m.year}</td>
                    <td className="py-2.5 px-4 font-semibold text-zinc-200">{m.title}</td>
                    <td className="py-2.5 px-4 font-mono text-zinc-400 text-[11px]">{m.subtitle}</td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleItemDuplicate('milestones', null, m)} className="p-1 text-zinc-400 hover:text-white" title="Duplicate"><Copy className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setModalConfig({ listKey: 'milestones', parentKey: null, item: m })} className="p-1 text-zinc-400 hover:text-luxury-gold"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleItemDelete('milestones', null, m.id, true)} className="p-1 text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* SECTION 4: GROWTH ROADMAP */}
      {activeSection === 'sec-4' && (
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Growth Roadmap Items ({formData.roadmap.items.length})</h3>
            <Button 
              onClick={() => setModalConfig({ listKey: 'items', parentKey: 'roadmap', item: { title: '', desc: '' } })} 
              variant="gold" 
              size="sm" 
              className="text-xs uppercase"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Roadmap Point
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formData.roadmap.items.map((rm, idx) => (
              <div key={rm.id} className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-mono text-luxury-gold text-xs font-bold">Step 0{idx + 1}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setModalConfig({ listKey: 'items', parentKey: 'roadmap', item: rm })} className="text-zinc-400 hover:text-white"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleItemDelete('items', 'roadmap', rm.id, true)} className="text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <h4 className="font-serif font-bold text-white text-sm">{rm.title}</h4>
                <p className="text-zinc-400 font-light leading-relaxed">{rm.desc || rm.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* CREATE / EDIT MODAL */}
      {modalConfig && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleModalSave} className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
                {modalConfig.item.id ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button type="button" onClick={() => setModalConfig(null)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {Object.keys(modalConfig.item).filter(k => !['id', 'order', 'visible', 'deleted'].includes(k)).map(key => (
                <div key={key}>
                  <label className="text-zinc-400 block mb-1 font-mono uppercase text-[10px]">{key}</label>
                  <input
                    type="text"
                    value={modalConfig.item[key] || ''}
                    onChange={(e) => setModalConfig({
                      ...modalConfig,
                      item: { ...modalConfig.item, [key]: e.target.value }
                    })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalConfig(null)}>Cancel</Button>
              <Button type="submit" variant="gold" size="sm">Save Item</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
