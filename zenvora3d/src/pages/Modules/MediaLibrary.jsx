import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { 
  Folder, Image as ImageIcon, Video, FileCode, Search, Filter, 
  Upload, Trash2, Copy, Check, ExternalLink, RefreshCw, Layers, 
  Grid, List, Sparkles, FolderPlus, Eye, X 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const MediaLibrary = () => {
  const { db, updateSection } = useDatabase();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Initial media assets state
  const defaultMediaItems = [
    { id: 'm-1', name: 'techmaster-logo.png', type: 'image', category: 'png', folder: 'Logos', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', size: '245 KB', dimensions: '1200x800', date: '2026-07-20' },
    { id: 'm-2', name: 'jaipur-studio-hero.jpg', type: 'image', category: 'jpg', folder: 'Studio', url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=800', size: '1.2 MB', dimensions: '1920x1080', date: '2026-07-22' },
    { id: 'm-3', name: 'showcase-reel-intro.mp4', type: 'video', category: 'video', folder: 'Reels', url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-background-4318-large.mp4', size: '14.8 MB', dimensions: '1080x1920', date: '2026-07-25' },
    { id: 'm-4', name: 'shield-icon.svg', type: 'icon', category: 'svg', folder: 'Icons', url: 'https://cdn.simpleicons.org/v/white', size: '12 KB', dimensions: '64x64', date: '2026-07-26' },
    { id: 'm-5', name: 'founder-portrait.jpg', type: 'image', category: 'jpg', folder: 'Team', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', size: '890 KB', dimensions: '1080x1350', date: '2026-07-27' },
    { id: 'm-6', name: 'brand-collaborations-wall.png', type: 'image', category: 'png', folder: 'Brands', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', size: '3.1 MB', dimensions: '2560x1440', date: '2026-07-28' }
  ];

  const mediaList = db?.mediaLibrary || defaultMediaItems;

  const folders = ['all', 'Logos', 'Studio', 'Reels', 'Icons', 'Team', 'Brands'];

  const filteredMedia = mediaList.filter(item => {
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'images' ? item.type === 'image' :
      activeTab === 'videos' ? item.type === 'video' :
      activeTab === 'icons' ? item.type === 'icon' :
      activeTab === 'svg' ? item.category === 'svg' :
      activeTab === 'png' ? item.category === 'png' : true;

    const matchesFolder = selectedFolder === 'all' || item.folder === selectedFolder;

    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.folder.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesFolder && matchesSearch;
  });

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setTimeout(() => {
      const newItems = Array.from(files).map((file, idx) => ({
        id: `m-upload-${Date.now()}-${idx}`,
        name: file.name,
        type: file.type.startsWith('video') ? 'video' : file.name.endsWith('.svg') ? 'icon' : 'image',
        category: file.name.split('.').pop().toLowerCase(),
        folder: selectedFolder === 'all' ? 'Uploads' : selectedFolder,
        url: URL.createObjectURL(file),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        dimensions: '1920x1080',
        date: new Date().toISOString().split('T')[0]
      }));

      const updated = [...newItems, ...mediaList];
      updateSection('mediaLibrary', updated);
      setIsUploading(false);
    }, 1000);
  };

  const handleDeleteMedia = (id) => {
    const updated = mediaList.filter(item => item.id !== id);
    updateSection('mediaLibrary', updated);
    if (selectedMedia?.id === id) setSelectedMedia(null);
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-luxury-gold shadow-gold-glow animate-pulse" />
            <h1 className="text-2xl font-serif font-bold tracking-wide uppercase text-white">Centralized Media Library</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-light">
            Enterprise Digital Asset Manager for Images, Videos, SVG Icons, Cloudinary & Transparent Assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer">
            <input type="file" multiple onChange={handleFileUpload} className="hidden" />
            <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-luxury-gold to-amber-500 text-black font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg cursor-pointer">
              {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isUploading ? 'Uploading...' : 'Upload Media'}
            </span>
          </label>
        </div>
      </div>

      {/* Filter Tabs & Folders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Folders */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 backdrop-blur-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
              <span>Folders</span>
              <FolderPlus className="w-3.5 h-3.5 text-luxury-gold cursor-pointer" />
            </h3>

            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                    selectedFolder === folder 
                      ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 font-medium' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 capitalize">
                    <Folder className={`w-3.5 h-3.5 ${selectedFolder === folder ? 'text-luxury-gold' : 'text-zinc-500'}`} />
                    <span>{folder === 'all' ? 'All Folders' : folder}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600">
                    {folder === 'all' ? mediaList.length : mediaList.filter(m => m.folder === folder).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Media Stats */}
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 backdrop-blur-xl space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Storage Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Cloud Storage</span>
                <span className="font-mono text-luxury-gold">22.8 MB / 5.0 GB</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-luxury-gold to-amber-500 w-[12%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Media Browser Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Bar: Search & Category Filter */}
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none w-full sm:w-auto">
              {[
                { id: 'all', label: 'All', icon: Layers },
                { id: 'images', label: 'Images', icon: ImageIcon },
                { id: 'videos', label: 'Videos', icon: Video },
                { id: 'icons', label: 'SVG & Icons', icon: FileCode }
              ].map(tab => {
                const IconComp = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
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

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-luxury-gold/40"
              />
            </div>
          </div>

          {/* Media Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className={`group relative bg-zinc-950/60 border rounded-xl overflow-hidden backdrop-blur-xl transition-all cursor-pointer ${
                  selectedMedia?.id === item.id 
                    ? 'border-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                    : 'border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {/* Media Preview Box */}
                <div className="aspect-square w-full bg-zinc-900/80 relative flex items-center justify-center overflow-hidden">
                  {item.type === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Eye className="w-5 h-5 text-white drop-shadow-md" />
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-zinc-700/60 text-[9px] font-mono text-zinc-300 uppercase">
                    {item.category}
                  </span>
                </div>

                {/* Footer Info */}
                <div className="p-2.5">
                  <p className="text-xs font-medium text-zinc-200 truncate">{item.name}</p>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-500 font-mono">
                    <span>{item.size}</span>
                    <span>{item.folder}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMedia.length === 0 && (
            <div className="text-center py-16 border border-dashed border-zinc-800/80 rounded-xl bg-zinc-950/40">
              <ImageIcon className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-zinc-400">No media assets found</p>
              <p className="text-xs text-zinc-500 mt-1">Upload new images or clear search filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Asset Inspector Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 relative shadow-2xl">
            <button onClick={() => setSelectedMedia(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-luxury-gold" /> Asset Inspector
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                {selectedMedia.type === 'video' ? (
                  <video src={selectedMedia.url} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={selectedMedia.url} alt="" className="w-full h-full object-contain" />
                )}
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider block text-[10px]">Asset Name</span>
                  <span className="text-white font-medium text-sm">{selectedMedia.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-zinc-800/80 py-3">
                  <div>
                    <span className="text-zinc-500 uppercase tracking-wider block text-[10px]">Dimensions</span>
                    <span className="text-zinc-300 font-mono">{selectedMedia.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase tracking-wider block text-[10px]">File Size</span>
                    <span className="text-zinc-300 font-mono">{selectedMedia.size}</span>
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 uppercase tracking-wider block text-[10px] mb-1">Direct CDN URL</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={selectedMedia.url}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-[11px] text-zinc-300 font-mono select-all"
                    />
                    <button
                      onClick={() => handleCopyUrl(selectedMedia.url)}
                      className="p-1.5 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold rounded hover:bg-luxury-gold/20 cursor-pointer"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => handleDeleteMedia(selectedMedia.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Asset</span>
                  </button>

                  <a
                    href={selectedMedia.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs hover:bg-zinc-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Link</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
