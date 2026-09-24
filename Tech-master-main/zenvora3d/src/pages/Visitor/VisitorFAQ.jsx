import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDatabase } from "../../context/DatabaseContext";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export const VisitorFAQ = () => {
  const { db } = useDatabase();

  // Collections
  const faqSettings = db?.faqSettings || {};
  const faqCategories = db?.faqCategories || [];
  const faqs = db?.faqs || [];

  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFAQId, setExpandedFAQId] = useState(null);

  // If globally disabled, render nothing
  if (faqSettings.enabled === false) return null;

  const activeCategories = faqCategories.filter(c => c.isActive !== false).sort((a,b) => (a.displayOrder||0) - (b.displayOrder||0));
  
  const filteredFAQs = faqs
    .filter(f => f.isActive !== false)
    .filter(f => activeCategory === "all" || f.categoryId === activeCategory)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className="relative text-white min-h-screen pt-32 pb-24 px-6 overflow-hidden">
      
      {/* Dynamic Background Image or Fallback Glow */}
      {faqSettings.backgroundImage ? (
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat pointer-events-none" 
          style={{ backgroundImage: `url(${faqSettings.backgroundImage})` }}
        />
      ) : (
        <>
          <div className="absolute top-1/4 right-1/4 w-[35vw] h-[35vw] aurora-glow-gold opacity-15 pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vw] aurora-glow-purple opacity-10 pointer-events-none" />
        </>
      )}

      {/* Hero Header */}
      <section className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] uppercase tracking-[6px] text-luxury-gold font-bold mb-4 inline-block"
        >
          {faqSettings.badge || "FAQ"}
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-light leading-tight mb-8"
        >
          {faqSettings.heading || "Frequently Asked"} <br />
          <span className="text-luxury-gold italic font-bold">{faqSettings.highlightHeading || "Questions"}</span>
        </motion.h1>
        
        {faqSettings.description && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-gray-400 text-sm max-w-2xl mx-auto font-light leading-relaxed"
          >
            {faqSettings.description}
          </motion.p>
        )}
      </section>

      {/* Categories Filter Bar */}
      {activeCategories.length > 0 && (
        <section className="max-w-4xl mx-auto relative z-10 mb-12">
           <div className="flex flex-wrap justify-center gap-3">
             <button
                onClick={() => { setActiveCategory("all"); setExpandedFAQId(null); }}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === "all" 
                    ? "bg-luxury-gold text-black shadow-gold-glow" 
                    : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:border-luxury-gold hover:text-white"
                }`}
              >
                All Questions
              </button>
             {activeCategories.map(cat => (
               <button
                 key={cat.id}
                 onClick={() => { setActiveCategory(cat.id); setExpandedFAQId(null); }}
                 className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                   activeCategory === cat.id 
                     ? "bg-luxury-gold text-black shadow-gold-glow" 
                     : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:border-luxury-gold hover:text-white"
                 }`}
               >
                 {cat.name}
               </button>
             ))}
           </div>
        </section>
      )}

      {/* FAQs Accordion */}
      <section className="max-w-4xl mx-auto text-left relative z-10">
        <div className="flex flex-col gap-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center text-zinc-500 italic py-16">
              No questions found for this category.
            </div>
          ) : (
            filteredFAQs.map((faq, index) => {
              const isExpanded = expandedFAQId === faq.id;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={faq.id} 
                  className={`border ${isExpanded ? 'border-luxury-gold/50 bg-black/60 shadow-gold-glow-sm' : 'border-white/10 bg-white/[0.02] hover:border-luxury-gold/30'} rounded-2xl overflow-hidden transition-all duration-300`}
                >
                  <div 
                    onClick={() => setExpandedFAQId(isExpanded ? null : faq.id)} 
                    className="p-6 flex justify-between items-center cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-4">
                      <HelpCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${isExpanded ? 'text-luxury-gold' : 'text-zinc-500'}`} />
                      <h4 className={`text-base font-semibold leading-snug transition-colors ${isExpanded ? 'text-white' : 'text-zinc-300'}`}>
                        {faq.question}
                      </h4>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-luxury-gold flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                    )}
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }} 
                        transition={{ duration: 0.3 }} 
                        className="border-t border-white/5 bg-black/40"
                      >
                        <div className="p-6 pl-14 text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

    </div>
  );
};
