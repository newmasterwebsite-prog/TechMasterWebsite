import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { 
  HelpCircle, ChevronDown, Edit2, Trash2, Plus, Search, GripVertical, Check, Save 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultFaqData = {
  settings: {
    badge: "INFORMATION ARCHIVE",
    heading: "Answers &",
    highlightHeading: "Frequently Asked Questions"
  },
  faqs: [
    { id: '1', question: "What is your main service?", answer: "We provide enterprise tech solutions.", category: "General", order: 1 }
  ]
};

export const FAQ = () => {
  const { dbData, localDb, saveToLocalDb, updateSection, apiFetch } = useDatabase();
  const [isPublishing, setIsPublishing] = useState(false);

  const rawData = dbData?.faqPageData || localDb?.faqPageData || {};

  const [settingsForm, setSettingsForm] = useState(rawData.settings || defaultFaqData.settings);
  const [faqs, setFaqs] = useState(rawData.faqs || defaultFaqData.faqs);

  useEffect(() => {
    const fetchLatestFaqs = async () => {
      try {
        if (apiFetch) {
          const res = await apiFetch('/faqs');
          if (res.success && res.data) {
            const data = res.data;
            if (data.settings) setSettingsForm(data.settings);
            if (data.faqs && data.faqs.length > 0) setFaqs(data.faqs);
          }
        }
      } catch (err) {
        console.warn("Could not fetch FAQs from backend:", err);
      }
    };
    fetchLatestFaqs();
  }, []);

  const handleSaveSettings = (newSettings) => {
    setSettingsForm(newSettings);
    const updated = { settings: newSettings, faqs };
    if (updateSection) updateSection('faqPageData', updated);
    saveToLocalDb('faqPageData', updated);
  };

  const handleSaveFaqs = (newFaqs) => {
    setFaqs(newFaqs);
    const updated = { settings: settingsForm, faqs: newFaqs };
    if (updateSection) updateSection('faqPageData', updated);
    saveToLocalDb('faqPageData', updated);
  };

  const handlePublishAll = async () => {
    setIsPublishing(true);
    const payload = { settings: settingsForm, faqs };
    if (updateSection) {
      updateSection('faqPageData', payload);
      updateSection('faqs', payload.faqs);
    }
    saveToLocalDb('faqPageData', payload);

    try {
      if (apiFetch) {
        await apiFetch('/faqs', {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      }
      alert("FAQ Portal Published Live to Website!");
    } catch (err) {
      console.warn("Backend API sync warning:", err);
      alert("Published locally! Backend notice: " + (err.message || "Saved"));
    } finally {
      setIsPublishing(false);
    }
  };

  const [activeTab, setActiveTab] = useState('hero');
  const [expandedPreviewId, setExpandedPreviewId] = useState(null);

  const saveHeroSettings = () => {
    handleSaveSettings(settingsForm);
  };

  // FAQ Editor State
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({ id: '', question: '', answer: '', category: '' });

  const openFaqEditor = (faq = null) => {
    if (faq) {
      setEditingFaq(faq.id);
      setFaqForm(faq);
    } else {
      setEditingFaq('new');
      setFaqForm({ id: `faq-${Date.now()}`, question: '', answer: '', category: 'General', order: faqs.length + 1 });
    }
  };

  const saveFaq = () => {
    if (!faqForm.question) return;
    let newFaqs = [...faqs];
    if (editingFaq === 'new') {
      newFaqs.push(faqForm);
    } else {
      newFaqs = newFaqs.map(f => f.id === editingFaq ? faqForm : f);
    }
    handleSaveFaqs(newFaqs);
    setEditingFaq(null);
  };

  const deleteFaq = (id) => {
    handleSaveFaqs(faqs.filter(f => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 pb-24">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-serif text-white">FAQ Manager</h1>
            <span className="px-3 py-1 bg-gold/20 text-gold border border-gold/30 rounded-full text-xs font-mono">1:1 REPLICA CMS</span>
          </div>
          <p className="text-gray-400 text-sm">Exact visual mirror of the TechMaster website FAQ section with instant live preview.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handlePublishAll}
            disabled={isPublishing}
            className="flex items-center gap-2 px-6 py-2 bg-gold hover:bg-yellow-500 text-black font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isPublishing ? 'Publishing...' : 'Publish Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Admin Editors */}
        <div className="space-y-6">
          
          {/* Editor Tabs */}
          <div className="flex gap-2 p-1 bg-zinc-900 border border-white/5 rounded-xl inline-flex">
            <button 
              onClick={() => setActiveTab('hero')} 
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'hero' ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Hero Section
            </button>
            <button 
              onClick={() => setActiveTab('faqs')} 
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'faqs' ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'}`}
            >
              FAQ Accordion
            </button>
          </div>

          {/* Hero Editor */}
          {activeTab === 'hero' && (
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-serif text-white mb-6">Edit Hero Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Small Label (Badge)</label>
                  <input 
                    type="text" 
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold outline-none"
                    value={settingsForm.badge}
                    onChange={(e) => setSettingsForm({...settingsForm, badge: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Main Heading</label>
                  <input 
                    type="text" 
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold outline-none"
                    value={settingsForm.heading}
                    onChange={(e) => setSettingsForm({...settingsForm, heading: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Highlight Word</label>
                  <input 
                    type="text" 
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold outline-none"
                    value={settingsForm.highlightHeading}
                    onChange={(e) => setSettingsForm({...settingsForm, highlightHeading: e.target.value})}
                  />
                </div>
                <button 
                  onClick={saveHeroSettings}
                  className="w-full mt-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-white/10"
                >
                  Apply to Preview
                </button>
              </div>
            </div>
          )}

          {/* FAQ Editor */}
          {activeTab === 'faqs' && (
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-serif text-white">Manage Questions</h3>
                <button 
                  onClick={() => openFaqEditor()}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm border border-white/10"
                >
                  <Plus className="w-4 h-4" /> Add FAQ
                </button>
              </div>
              
              {editingFaq ? (
                <div className="p-4 bg-black/50 border border-gold/30 rounded-xl space-y-4 mb-6">
                  <h4 className="text-sm font-bold text-gold uppercase tracking-wider">{editingFaq === 'new' ? 'New FAQ' : 'Edit FAQ'}</h4>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Question</label>
                    <input 
                      type="text" 
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold outline-none"
                      value={faqForm.question}
                      onChange={(e) => setFaqForm({...faqForm, question: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Answer</label>
                    <textarea 
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold outline-none h-24"
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={saveFaq} className="flex-1 py-2 bg-gold hover:bg-yellow-500 text-black font-semibold rounded-lg">Save FAQ</button>
                    <button onClick={() => setEditingFaq(null)} className="px-4 py-2 bg-zinc-800 text-white rounded-lg">Cancel</button>
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                {faqs.map(faq => (
                  <div key={faq.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl hover:border-gold/30 transition-all">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-gray-600 cursor-grab" />
                      <div>
                        <p className="text-sm font-bold text-white line-clamp-1">{faq.question}</p>
                        <p className="text-[10px] text-gray-500 font-mono uppercase mt-1">{faq.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openFaqEditor(faq)} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-gray-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteFaq(faq.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Live 1:1 Preview */}
        <div className="bg-[#060606] border border-white/10 rounded-3xl overflow-hidden relative min-h-[700px] shadow-2xl flex flex-col">
          
          {/* Browser Bar Mockup */}
          <div className="h-12 bg-zinc-900 border-b border-white/5 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="mx-auto px-4 py-1 bg-black rounded-md text-[10px] text-gray-500 font-mono flex items-center gap-2">
               techmaster.com/faq <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
            </div>
          </div>

          {/* Actual 1:1 Render Area */}
          <div className="flex-1 overflow-y-auto relative p-8">
            
            {/* Background Glows (Same as website) */}
            <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-purple-600/20 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[150px] h-[150px] bg-yellow-600/10 blur-[80px] pointer-events-none" />

            {/* Hero Section Preview */}
            <div className="text-left mb-10 relative z-10">
              <div className="inline-block px-3 py-1 mb-4 border border-gold/30 bg-gold/5 text-gold text-[10px] uppercase tracking-[3px] font-bold rounded-sm">
                {settingsForm.badge || "INFORMATION ARCHIVE"}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
                {settingsForm.heading} <br />
                <span className="text-gold italic font-bold">{settingsForm.highlightHeading}</span>.
              </h1>
            </div>

            {/* FAQ Accordion Preview */}
            <div className="flex flex-col gap-5 relative z-10">
              {faqs.map(faq => {
                const isExpanded = expandedPreviewId === faq.id;
                return (
                  <div key={faq.id} className="bg-white/[0.02] backdrop-blur-md rounded-3xl overflow-hidden border border-white/5 hover:border-gold/25 transition-all duration-300">
                    <button 
                      onClick={() => setExpandedPreviewId(isExpanded ? null : faq.id)}
                      className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold shrink-0">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-white leading-relaxed">{faq.question}</h3>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-0 text-sm text-gray-400 font-light leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
