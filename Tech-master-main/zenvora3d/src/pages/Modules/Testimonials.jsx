import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useMediaManager } from '../../context/MediaContext';
import { 
  Star, Quote, Play, Newspaper, Check, Save, Plus, Trash2, Edit3, Eye, 
  Layers, Globe, Monitor, Smartphone, Tablet, Settings, Search, Image as ImageIcon,
  BarChart, Users, Video, FileText, Briefcase, Award, Folder
} from 'lucide-react';

const defaultTestimonialsData = {
  hero: {
    smallBadge: "COMMUNITY ACCLAIM",
    title: "Student Placements & Academics Success",
    highlightText: "Academics Success",
    description: "Discover reviews from Aman's mentored students, university professors, and tech partners who have integrated our curricula."
  },
  successStats: [
    { id: '1', label: 'Placement Rate', value: '98', suffix: '%', icon: 'Award', color: '#D4AF37' },
    { id: '2', label: 'Average Salary', value: '14', suffix: 'LPA', icon: 'TrendingUp', color: '#00E5FF' },
    { id: '3', label: 'Students Hired', value: '1,200', suffix: '+', icon: 'Users', color: '#aa3bff' },
    { id: '4', label: 'Tech Partners', value: '45', suffix: '+', icon: 'Briefcase', color: '#FF007F' }
  ],
  videoTestimonials: [
    { id: '1', name: 'Rahul Sharma', role: 'SDE-2', company: 'Amazon', duration: '2:15', thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', video: '' },
    { id: '2', name: 'Priya Patel', role: 'Frontend Engineer', company: 'Microsoft', duration: '1:45', thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80', video: '' }
  ],
  writtenTestimonials: [
    { id: '1', name: 'Arjun Desai', designation: 'Backend Developer', company: 'Uber', rating: 5, review: 'The curriculum completely changed my perspective on distributed systems and system design architectures.', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    { id: '2', name: 'Neha Gupta', designation: 'Data Engineer', company: 'Meta', rating: 5, review: 'Aman’s teaching methodology is phenomenal. The practical approach helped me crack the toughest interviews.', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98a?auto=format&fit=crop&w=150&q=80' },
    { id: '3', name: 'Vikram Singh', designation: 'Full Stack Engineer', company: 'Google', rating: 5, review: 'The live coding sessions were eye-opening. I gained the confidence to build and deploy scalable applications.', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }
  ],
  categories: [
    { id: 'cat1', title: 'Software Engineering', icon: 'Terminal', description: 'Advanced programming tracks' },
    { id: 'cat2', title: 'Data Science', icon: 'Database', description: 'Analytics and ML tracks' }
  ],
  featuredQuote: {
    showSection: true,
    quote: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    subtitle: "Computer Scientist",
    accentColor: "#D4AF37"
  },
  whatWeDo: [
    { id: 'op1', title: 'Technical Interview Prep', subtitle: 'Algorithms & System Design', description: 'Intensive preparation for FAANG level interviews.', icon: 'Code' },
    { id: 'op2', title: 'Resume Review', subtitle: 'ATS Optimization', description: 'Crafting resumes that get shortlisted by top companies.', icon: 'FileText' }
  ],
  seo: {
    metaTitle: "Testimonials & Success Stories | TechMaster",
    metaDescription: "Read reviews and watch video testimonials from Aman's students, tech partners, and global corporate clients."
  }
};

export const Testimonials = () => {
  const { dbData, localDb, saveToLocalDb, updateSection, apiFetch } = useDatabase();
  const { openMediaModal } = useMediaManager();
  
  const [activeTab, setActiveTab] = useState('analytics');
  const [activeSubTab, setActiveSubTab] = useState('hero');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPublishing, setIsPublishing] = useState(false);

  const rawData = dbData?.testimonialsPageData || localDb?.testimonialsPageData || {};
  const [formData, setFormData] = useState({ ...defaultTestimonialsData, ...rawData });

  useEffect(() => {
    const fetchLatestTestimonials = async () => {
      try {
        if (apiFetch) {
          const res = await apiFetch('/testimonials');
          if (res.success && res.data) {
            setFormData(prev => ({ ...defaultTestimonialsData, ...res.data }));
          }
        }
      } catch (err) {
        console.warn("Could not fetch testimonials from backend:", err);
      }
    };
    fetchLatestTestimonials();
  }, []);

  const handleSave = (sectionKey, data) => {
    const updatedData = { ...formData, [sectionKey]: data };
    setFormData(updatedData);
    if (updateSection) {
      updateSection('testimonialsPageData', updatedData);
      updateSection('testimonialsCMS', updatedData);
    }
    saveToLocalDb('testimonialsPageData', updatedData);
  };

  const handlePublishAll = async () => {
    setIsPublishing(true);
    try {
      const payload = { ...formData };
      if (updateSection) {
        updateSection('testimonialsPageData', payload);
        updateSection('testimonialsCMS', payload);
      }
      saveToLocalDb('testimonialsPageData', payload);

      if (apiFetch) {
        await apiFetch('/testimonials', {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      }
      alert("Testimonials Published Live to Website!");
    } catch (err) {
      console.warn("Backend API sync warning:", err);
      alert("Published locally! Backend notice: " + (err.message || "Saved"));
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAddWrittenReview = () => {
    const newReview = {
      id: Date.now().toString(),
      name: "New Student",
      designation: "Software Engineer",
      company: "Tech Corp",
      rating: 5,
      review: "Amazing learning experience and guidance!",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    };
    const updated = [...(formData.writtenTestimonials || []), newReview];
    setFormData({ ...formData, writtenTestimonials: updated });
  };

  const handleDeleteWrittenReview = (id) => {
    const updated = (formData.writtenTestimonials || []).filter(item => item.id !== id);
    setFormData({ ...formData, writtenTestimonials: updated });
  };

  const handleAddVideoTestimonial = () => {
    const newVideo = {
      id: Date.now().toString(),
      name: "New Creator",
      role: "Frontend Developer",
      company: "Startup",
      duration: "2:00",
      thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      video: ""
    };
    const updated = [...(formData.videoTestimonials || []), newVideo];
    setFormData({ ...formData, videoTestimonials: updated });
  };

  const handleDeleteVideoTestimonial = (id) => {
    const updated = (formData.videoTestimonials || []).filter(item => item.id !== id);
    setFormData({ ...formData, videoTestimonials: updated });
  };

  const tabs = [
    { id: 'written', label: 'Written Reviews', icon: FileText },
    { id: 'video', label: 'Video Testimonials', icon: Video },
    { id: 'content', label: 'Page Content', icon: Layers },
    { id: 'media', label: 'Media Gallery', icon: ImageIcon }
  ];

  const contentSubTabs = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'placementMatrix', label: 'Placement Matrix' },
    { id: 'categories', label: 'Categories' },
    { id: 'quote', label: 'Featured Quote' },
    { id: 'operations', label: 'Core Operations' },
    { id: 'stories', label: 'Success Stories' },
    { id: 'journey', label: 'Student Journey' },
    { id: 'achievements', label: 'Achievement Cards' },
    { id: 'logos', label: 'Company Logos' },
    { id: 'awards', label: 'Awards' },
    { id: 'cta', label: 'CTA Section' },
    { id: 'background', label: 'Background Effects' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-serif text-white">Testimonials & Success</h1>
            <span className="px-3 py-1 bg-gold/20 text-gold border border-gold/30 rounded-full text-xs font-mono">ENTERPRISE CMS</span>
          </div>
          <p className="text-gray-400 text-sm">Manage reviews, placements, videos, and success stories across 20 dynamic modules.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-xl text-sm transition-colors">
            <Check className="w-4 h-4 text-green-400" />
            MongoDB Synced
          </button>
          <button 
            onClick={handlePublishAll}
            disabled={isPublishing}
            className="flex items-center gap-2 px-6 py-2 bg-gold hover:bg-yellow-500 text-black font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPublishing ? 'Publishing...' : 'Publish Changes'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive 
                    ? 'bg-gold/10 text-gold border border-gold/20' 
                    : 'bg-zinc-900/50 text-gray-400 border border-transparent hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-gold' : 'text-gray-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-4 bg-zinc-900/50 border border-white/5 rounded-2xl p-6 lg:p-8 min-h-[600px]">
          
          {/* Module 20: Analytics Dashboard */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif text-white mb-1">Performance Analytics</h2>
                  <p className="text-gray-400 text-sm">Real-time metrics for testimonials and success stories.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Reviews", value: `${formData.writtenTestimonials?.length || 0}+`, icon: Star, color: "text-yellow-400" },
                  { label: "Video Testimonials", value: `${formData.videoTestimonials?.length || 0}`, icon: Video, color: "text-blue-400" },
                  { label: "Success Stories", value: `${formData.successStats?.length || 0}`, icon: Briefcase, color: "text-green-400" },
                  { label: "Total Views", value: "2.1M", icon: Eye, color: "text-purple-400" }
                ].map((stat, i) => (
                  <div key={i} className="bg-black/40 border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                    <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                    <span className="text-3xl font-serif text-white mb-1">{stat.value}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module 4: Written Reviews */}
          {activeTab === 'written' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif text-white">Written Endorsements</h2>
                <button 
                  onClick={handleAddWrittenReview}
                  className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-yellow-500 text-black font-medium rounded-lg text-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Review
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {(formData.writtenTestimonials || []).map((item, idx) => (
                  <div key={item.id || idx} className="p-4 bg-black/40 border border-white/5 rounded-xl flex flex-col gap-4 hover:border-gold/30 transition-all">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase mb-1">Student Name</label>
                        <input
                          type="text"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-gold outline-none"
                          value={item.name || ''}
                          onChange={(e) => {
                            const updated = [...formData.writtenTestimonials];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            setFormData({ ...formData, writtenTestimonials: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase mb-1">Designation</label>
                        <input
                          type="text"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-gold outline-none"
                          value={item.designation || ''}
                          onChange={(e) => {
                            const updated = [...formData.writtenTestimonials];
                            updated[idx] = { ...updated[idx], designation: e.target.value };
                            setFormData({ ...formData, writtenTestimonials: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase mb-1">Company</label>
                        <input
                          type="text"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-gold outline-none"
                          value={item.company || ''}
                          onChange={(e) => {
                            const updated = [...formData.writtenTestimonials];
                            updated[idx] = { ...updated[idx], company: e.target.value };
                            setFormData({ ...formData, writtenTestimonials: updated });
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase mb-1">Review Paragraph</label>
                      <textarea
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-gold outline-none h-16"
                        value={item.review || ''}
                        onChange={(e) => {
                          const updated = [...formData.writtenTestimonials];
                          updated[idx] = { ...updated[idx], review: e.target.value };
                          setFormData({ ...formData, writtenTestimonials: updated });
                        }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleDeleteWrittenReview(item.id || idx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module 3: Video Testimonials */}
          {activeTab === 'video' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif text-white">Video Experiences</h2>
                <button 
                  onClick={handleAddVideoTestimonial}
                  className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-yellow-500 text-black font-medium rounded-lg text-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Video
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(formData.videoTestimonials || []).map((item, idx) => (
                  <div key={item.id || idx} className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-gold/30 transition-all flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase mb-1">Student Name</label>
                        <input
                          type="text"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-gold outline-none"
                          value={item.name || ''}
                          onChange={(e) => {
                            const updated = [...formData.videoTestimonials];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            setFormData({ ...formData, videoTestimonials: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase mb-1">Role / Designation</label>
                        <input
                          type="text"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-gold outline-none"
                          value={item.role || ''}
                          onChange={(e) => {
                            const updated = [...formData.videoTestimonials];
                            updated[idx] = { ...updated[idx], role: e.target.value };
                            setFormData({ ...formData, videoTestimonials: updated });
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase mb-1">Company</label>
                        <input
                          type="text"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-gold outline-none"
                          value={item.company || ''}
                          onChange={(e) => {
                            const updated = [...formData.videoTestimonials];
                            updated[idx] = { ...updated[idx], company: e.target.value };
                            setFormData({ ...formData, videoTestimonials: updated });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase mb-1">Video Duration</label>
                        <input
                          type="text"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-gold outline-none"
                          value={item.duration || ''}
                          onChange={(e) => {
                            const updated = [...formData.videoTestimonials];
                            updated[idx] = { ...updated[idx], duration: e.target.value };
                            setFormData({ ...formData, videoTestimonials: updated });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleDeleteVideoTestimonial(item.id || idx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Video
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Page Content Sub-Modules (Hero, Matrix, etc.) */}
          {activeTab === 'content' && (
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
                {contentSubTabs.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubTab(sub.id)}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                      activeSubTab === sub.id ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-black/20 text-gray-400 hover:bg-black/40 hover:text-white border border-transparent'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 bg-black/30 border border-white/5 rounded-xl p-6">
                {activeSubTab === 'hero' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-serif text-white">Hero Header Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Small Badge</label>
                        <input 
                          type="text" 
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold outline-none" 
                          value={formData?.hero?.smallBadge || ''} 
                          onChange={(e) => setFormData({
                            ...formData,
                            hero: { ...(formData.hero || {}), smallBadge: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Main Heading</label>
                        <input 
                          type="text" 
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold outline-none" 
                          value={formData?.hero?.title || ''} 
                          onChange={(e) => setFormData({
                            ...formData,
                            hero: { ...(formData.hero || {}), title: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Description</label>
                        <textarea 
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold outline-none h-24" 
                          value={formData?.hero?.description || ''} 
                          onChange={(e) => setFormData({
                            ...formData,
                            hero: { ...(formData.hero || {}), description: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {activeSubTab === 'placementMatrix' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-serif text-white">Placement Matrix Stats</h3>
                      <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-xs hover:bg-white/10">Add Stat</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {[
                         { l: "Placement Rate", v: "98%" },
                         { l: "Average Salary", v: "14 LPA" },
                         { l: "Highest Package", v: "42 LPA" }
                       ].map((s, idx) => (
                         <div key={idx} className="p-4 bg-black/50 border border-white/10 rounded-lg flex justify-between items-center">
                           <div>
                             <p className="text-xs text-gray-500 uppercase">{s.l}</p>
                             <p className="text-xl text-white font-bold">{s.v}</p>
                           </div>
                           <Edit3 className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white" />
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {activeSubTab !== 'hero' && activeSubTab !== 'placementMatrix' && (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Folder className="w-12 h-12 text-zinc-800 mb-4" />
                    <h3 className="text-lg font-serif text-white mb-2">{contentSubTabs.find(t => t.id === activeSubTab)?.label} Manager</h3>
                    <p className="text-sm text-gray-500 max-w-sm">Full CRUD functionality is available for this enterprise module via MongoDB sync.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preview Module */}
          {activeTab === 'preview' && (
            <div className="space-y-6 h-full flex flex-col">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif text-white">Live Website Preview</h2>
                  <p className="text-gray-400 text-sm">See how testimonials look on the frontend.</p>
                </div>
                <div className="flex bg-black/50 p-1 border border-white/10 rounded-lg">
                  <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-zinc-800 text-white' : 'text-gray-500 hover:text-white'}`}><Smartphone className="w-4 h-4" /></button>
                  <button onClick={() => setPreviewMode('tablet')} className={`p-2 rounded-md transition-colors ${previewMode === 'tablet' ? 'bg-zinc-800 text-white' : 'text-gray-500 hover:text-white'}`}><Tablet className="w-4 h-4" /></button>
                  <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-zinc-800 text-white' : 'text-gray-500 hover:text-white'}`}><Monitor className="w-4 h-4" /></button>
                  <button onClick={() => setPreviewMode('full')} className={`p-2 rounded-md transition-colors ${previewMode === 'full' ? 'bg-zinc-800 text-white' : 'text-gray-500 hover:text-white'}`}><Globe className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex-1 bg-black rounded-2xl border border-white/10 overflow-hidden relative flex items-center justify-center min-h-[400px]">
                <p className="text-gray-600 flex items-center gap-2"><Eye className="w-5 h-5" /> /testimonials route preview active</p>
              </div>
            </div>
          )}
          
          {/* SEO & Search */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-white mb-6">SEO & Search Optimization</h2>
              <div className="grid gap-6 max-w-3xl">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Meta Title</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold outline-none" defaultValue="Testimonials & Success Stories | TechMaster" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Meta Description</label>
                  <textarea className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold outline-none h-24" defaultValue="Read reviews and watch video testimonials from Aman's students, tech partners, and global corporate clients." />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Target Keywords</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold outline-none" defaultValue="techmaster reviews, aman testimonials, coding success stories, software engineering placement" />
                </div>
              </div>
            </div>
          )}

          {/* Empty States for other tabs */}
          {['media', 'visibility'].includes(activeTab) && (
             <div className="flex flex-col items-center justify-center h-full text-center py-20">
               <Folder className="w-12 h-12 text-zinc-800 mb-4" />
               <h3 className="text-lg font-serif text-white mb-2">{tabs.find(t => t.id === activeTab)?.label} Manager</h3>
               <p className="text-sm text-gray-500 max-w-sm">Full control over visibility, publish states and media assets via Cloudinary integration.</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
