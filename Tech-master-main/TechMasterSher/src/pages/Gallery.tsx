import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";
import { mediaUrl } from "../utils/media";

export const Gallery: React.FC = () => {
  const { dbData } = useData();
  const [activeFilter, setActiveFilter] = useState("All");

  let localDb: any = {};
  try {
    const saved = localStorage.getItem('zenvora_db');
    if (saved) localDb = JSON.parse(saved);
  } catch (e) {}

  const defaultGallery = [
    {
      id: "mg-1",
      title: "Mainstage Keynote at React India",
      type: "Events",
      category: "Events",
      description: "Addressing 1,500+ full-stack engineers in Goa on WebGL rendering pipelines.",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "mg-2",
      title: "Behind the Scenes Studio Shoot",
      type: "Behind The Scenes",
      category: "Behind The Scenes",
      description: "4K multi-cam production setup at Jaipur tech studio.",
      imageUrl: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "mg-3",
      title: "Global Tech Award Ceremony",
      type: "Awards",
      category: "Awards",
      description: "Awarded Top Technical Educator of the Year 2025.",
      imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const rawGallery = (dbData?.mediaGallery && dbData.mediaGallery.length > 0)
    ? dbData.mediaGallery
    : (localDb?.mediaGallery || defaultGallery);
  const galleryList = rawGallery.filter((item: any) => item.status === "Active" || item.status === "Published" || item.status === true || item.status === undefined);

  const defaultFilters = ["Photos", "Videos", "Behind The Scenes", "Campaign Images", "Events", "Celebrity Moments", "Awards", "Travel"];
  const rawFilters = (dbData?.mediaFilters && dbData.mediaFilters.length > 0)
    ? dbData.mediaFilters
    : (localDb?.mediaFilters || defaultFilters);

  const filters = ["All", ...rawFilters.map((f: any) => typeof f === 'string' ? f : (f.name || f))];

  const filteredItems = activeFilter === "All"
    ? galleryList
    : galleryList.filter((item: any) => item.type === activeFilter || item.category === activeFilter);

  const mediaHero = {
    badge: "CREATOR ARCHIVES",
    titleLine1: "Media Coverage &",
    titleLine2: "Gallery",
    ...localDb?.mediaGalleryCMS?.hero,
    ...localDb?.mediaHero,
    ...dbData?.mediaHero
  };

  return (
    <div className="relative text-white min-h-screen pt-24 pb-8 px-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-1/2 w-[40vw] h-[40vw] aurora-glow-purple opacity-20 pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] aurora-glow-gold opacity-10 pointer-events-none" />

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto text-left mb-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="typo-badge mb-4 uppercase tracking-[2px]"
        >
          {mediaHero.badge || "CREATOR ARCHIVES"}
        </motion.div>
        
        <h1 className="typo-h1">
          {mediaHero.titleLine1 || "Media Coverage &"} <br />
          <span className="text-gold italic font-bold">{mediaHero.titleLine2 || "Gallery"}</span>.
        </h1>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto mb-16 flex flex-wrap gap-3 text-left relative z-10">
        {filters.map((filter: string) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[1.5px] border transition-all duration-300 cursor-pointer ${
              activeFilter === filter
                ? "bg-gold border-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                : "bg-[#0d0d0d] border-white/10 text-gray-400 hover:border-white/40 hover:text-white"
            }`}
          >
            {filter === "All" ? "All Media" : filter}
          </button>
        ))}
      </section>

      {/* Gallery Grid - Masonry */}
      <section className="max-w-7xl mx-auto text-left relative z-10">
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item: any, index: number) => (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                key={item.id || item._id || index}
                className="break-inside-avoid glass-panel p-4 rounded-3xl group cursor-pointer hover:border-gold/30 transition-all duration-500 overflow-hidden"
              >
                <div className="rounded-2xl overflow-hidden mb-4 relative">
                  {(() => {
                    const srcUrl = mediaUrl(item.imageUrl) || mediaUrl(item.image) || mediaUrl(item.thumbnail) || mediaUrl(item.mediaFile) || mediaUrl(item.url);
                    const isVid = typeof srcUrl === 'string' && srcUrl.match(/\.(mp4|webm|mov)$/i);
                    return isVid ? (
                      <video
                        src={srcUrl}
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-103"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={srcUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-103"
                        data-cursor="expand"
                      />
                    );
                  })()}
                  <div className="absolute top-3 left-3 bg-black/80 border border-white/10 px-3 py-1 rounded-full text-[9px] uppercase tracking-[1px] font-mono text-gold font-bold">
                    {item.type || item.category}
                  </div>
                </div>

                <div className="px-2">
                  <h3 className="font-serif text-xl text-white font-medium group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1.5 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
};
