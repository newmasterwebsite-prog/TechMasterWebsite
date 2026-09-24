import React, { useState } from "react";
import { ArrowUpRight, BarChart3, TrendingUp, Users, ChevronRight, Target, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDatabase } from "../../context/DatabaseContext";
import { useSEO } from "../../hooks/useSEO";
import { LuxuryCard } from "../../components/LuxuryCard";
import { useNavigate } from "react-router-dom";

// Helper map for icons
const IconMap = {
  Users: Users,
  BarChart3: BarChart3,
  TrendingUp: TrendingUp
};

export const VisitorBlog = () => {
  const { db } = useDatabase();
  const navigate = useNavigate();

  // Data Collections
  const blogHero = db?.blogHero || {};
  const featuredStrategy = db?.featuredStrategy || {};
  const strategyStats = db?.strategyStats || [];
  const strategyPillars = db?.strategyPillars || [];
  const strategyPresets = db?.strategyPresets || [];
  const quickBlueprint = db?.quickBlueprint || {};
  const blogCategories = db?.blogCategories || [{ name: 'All' }];
  const latestInsights = db?.latestInsights || {};
  const blogs = db?.blogs || [];
  const blogSettings = db?.blogPageSettings || {};

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeStrategy, setActiveStrategy] = useState(strategyPresets.length > 0 ? strategyPresets[0].presetName : "");

  const filteredBlogs = selectedCategory === "All"
    ? blogs.filter(b => b.active !== false && b.status !== 'draft')
    : blogs.filter(b => b.active !== false && b.status !== 'draft' && b.category === selectedCategory);

  const activePresetData = strategyPresets.find(p => p.presetName === activeStrategy) || strategyPresets[0] || {};

  return (
    <div className="relative text-white min-h-screen pt-32 pb-24 px-6 overflow-hidden">
      {/* Background Glow */}
      {blogHero.glowEnabled !== false && (
        <>
          <div className="absolute top-1/4 right-1/4 w-[35vw] h-[35vw] aurora-glow-purple opacity-20 pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vw] aurora-glow-gold opacity-10 pointer-events-none" />
        </>
      )}

      {/* Hero Header */}
      {blogSettings.showHero !== false && blogHero.active !== false && (
        <section className="max-w-7xl mx-auto text-left mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={blogHero.animationEnabled !== false ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-[10px] uppercase tracking-[6px] text-luxury-gold font-bold mb-4"
          >
            {blogHero.badge}
          </motion.div>
          
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light leading-tight mb-8">
            {blogHero.titleLine1} <br />
            <span className="text-luxury-gold italic font-bold">{blogHero.titleLine2}</span>
          </h1>
        </section>
      )}

      {/* Content Marketing Section */}
      {blogSettings.showStrategy !== false && featuredStrategy.active !== false && (
        <section className="max-w-7xl mx-auto mb-24 relative z-10 text-left">
          <div className="border border-white/5 bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="text-[10px] uppercase tracking-[6px] text-luxury-gold font-bold mb-3 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" />
                  {featuredStrategy.badge}
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl font-light text-white leading-snug">
                  {featuredStrategy.titleLine1} <span className="text-luxury-gold font-bold italic">{featuredStrategy.titleLine2}</span> {featuredStrategy.titleLine3}
                </h2>
                <p className="text-gray-400 text-sm max-w-2xl mt-4 font-light leading-relaxed">
                  {featuredStrategy.description}
                </p>
              </div>
              
              {/* Stats row */}
              <div className="flex gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10 flex-wrap">
                {strategyStats.filter(s => s.active !== false).map((stat) => (
                  <div key={stat.id} className="text-left">
                    <div className="text-xl sm:text-2xl font-serif text-luxury-gold font-bold">{stat.number}</div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest font-mono mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pillars and Strategy Planner Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Core Pillars */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {strategyPillars.filter(p => p.active !== false).map((pillar) => {
                    const IconComp = IconMap[pillar.icon] || BookOpen;
                    return (
                      <div key={pillar.id} className="border border-white/5 bg-white/[0.02] p-6 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors">
                        <div>
                          <div className="mb-4 bg-luxury-gold/10 w-9 h-9 rounded-xl flex items-center justify-center">
                            <IconComp className="w-5 h-5 text-luxury-gold" />
                          </div>
                          <h4 className="font-sans text-sm font-semibold text-white mb-2">{pillar.title}</h4>
                        </div>
                        <p className="text-gray-400 text-xs font-light leading-relaxed mt-2">{pillar.description}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Strategy Blueprint */}
                {quickBlueprint.active !== false && (
                  <div className="border border-white/5 bg-white/[0.01] p-6 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="bg-luxury-gold/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-luxury-gold" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-sans text-xs font-semibold text-white uppercase tracking-wider">{quickBlueprint.title}</h4>
                        <p className="text-gray-400 text-xs font-light mt-0.5">{quickBlueprint.description}</p>
                      </div>
                    </div>
                    <a href={quickBlueprint.buttonUrl} className="text-xs font-bold text-luxury-gold uppercase tracking-[1.5px] whitespace-nowrap flex items-center gap-1 hover:text-white transition-colors duration-300">
                      {quickBlueprint.buttonText} <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Interactive Strategy Planner */}
              {strategyPresets.length > 0 && (
                <div className="lg:col-span-5 border border-white/5 bg-white/[0.02] rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-[2px]">Reach & ROI Estimator</span>
                    </div>
                    
                    {/* Toggles */}
                    <div className="flex bg-black/40 p-1 rounded-xl gap-1 mb-6 border border-white/5">
                      {strategyPresets.filter(p => p.active !== false).map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setActiveStrategy(preset.presetName)}
                          className={`flex-1 text-[10px] sm:text-xs font-semibold py-2 rounded-lg transition-all duration-300 ${
                            activeStrategy === preset.presetName
                              ? "bg-luxury-gold text-black shadow-lg shadow-luxury-gold/10"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {preset.badge}
                        </button>
                      ))}
                    </div>

                    {/* Estimate details */}
                    <div className="space-y-4 text-left">
                      <div>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Estimated Monthly Reach</span>
                        <div className="text-2xl sm:text-3xl font-serif text-white font-bold mt-1">
                          {activePresetData.impressions}
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Primary Channels</span>
                        <span className="text-xs text-luxury-gold font-mono block mt-1">
                          {activePresetData.channel}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono block">Content Focus</span>
                        <p className="text-xs text-gray-300 leading-relaxed font-light mt-1">
                          {activePresetData.focus}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer row inside planner */}
                  <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center">
                    <span className="text-[9px] text-gray-500 uppercase font-mono">ROI: {(activePresetData.roi || '').split(",")[0]}</span>
                    <span className="text-[10px] text-luxury-gold uppercase tracking-[1px] font-bold">Strategy Verified</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Blog Hub Header */}
      {blogSettings.showLatest !== false && latestInsights.active !== false && (
        <section className="max-w-7xl mx-auto text-left relative z-10 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 mb-10 gap-6">
            <div>
              <h2 className="font-serif text-3xl font-light">{latestInsights.title}</h2>
              <p className="text-gray-400 text-xs mt-1 font-light">{latestInsights.subtitle}</p>
            </div>
            
            {/* Category Filter Bar */}
            {blogSettings.showFilters !== false && (
              <div className="flex flex-wrap gap-2">
                {blogCategories.filter(c => c.active !== false).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-4 py-2 rounded-full text-xs transition-all duration-300 ${
                      selectedCategory === category.name
                        ? "bg-luxury-gold text-black font-semibold border border-luxury-gold"
                        : "bg-white/[0.03] border border-white/5 hover:border-white/20 text-gray-300 hover:text-white"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Blog List Grid */}
      <section className="max-w-7xl mx-auto text-left relative z-10">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <p className="text-gray-400 text-sm">No articles found in this category.</p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="text-luxury-gold text-xs uppercase tracking-[1.5px] font-bold mt-4 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredBlogs.map((post, idx) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  <LuxuryCard accentColor="#D4AF37" index={idx}>
                    <div className="flex flex-col h-full justify-between cursor-pointer" onClick={() => navigate(`/blog/${post.id}`)}>
                      <div>
                        <div className="aspect-video w-full overflow-hidden border-b border-white/5 relative rounded-2xl mb-6 bg-black">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              loading="lazy"
                              className={`w-full h-full object-cover transition-transform duration-700 ${blogSettings.hoverAnimations !== false ? 'group-hover:scale-105' : ''}`}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs italic">No Image</div>
                          )}
                        </div>

                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[9px] font-mono text-luxury-gold font-bold uppercase tracking-[1px]">{post.category || 'Article'}</span>
                          <span className="text-[9px] text-gray-400 font-mono uppercase">{post.publishDate}</span>
                        </div>

                        <h3 className="font-serif text-xl font-bold text-white group-hover:text-luxury-gold transition-colors duration-300 mb-3 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-xs md:text-sm font-light leading-relaxed mb-6 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 flex justify-between items-center border-t border-white/5 mt-auto">
                        <span className="text-[10px] text-gray-400 uppercase tracking-[1px]">{post.readTime || '3 min read'}</span>
                        <button className="text-luxury-gold group-hover:text-white transition-colors duration-300 flex items-center gap-1 text-xs font-bold uppercase tracking-[1.5px]">
                          Read Article
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </LuxuryCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
};
