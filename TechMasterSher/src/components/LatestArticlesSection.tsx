import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, ThumbsUp, ArrowRight, ChevronDown } from "lucide-react";
import { mediaUrl } from "../utils/media";

export interface ArticleItem {
  id?: string;
  title: string;
  excerpt?: string;
  category?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  date?: string;
  readTime?: string;
  views?: string;
  likes?: string;
  imageUrl?: string;
  articleUrl?: string;
  isFeatured?: boolean;
  isHot?: boolean;
  order?: number;
  visible?: boolean;
}

export interface LatestArticlesData {
  badge?: string;
  heading?: string;
  description?: string;
  hotBadge?: string;
  hotTitle?: string;
  visible?: boolean;
  list?: ArticleItem[];
}

interface LatestArticlesSectionProps {
  data?: LatestArticlesData;
}

export const LatestArticlesSection: React.FC<LatestArticlesSectionProps> = ({ data }) => {
  if (data?.visible === false) return null;

  const rawList: ArticleItem[] = Array.isArray(data?.list) && data.list.length > 0
    ? data.list.filter((item) => item && item.visible !== false)
    : [
        {
          id: "art-1",
          title: "From influencers to trusted voices: The changing role of creators in tech buying decisions",
          excerpt: "Authored by Arvind Kharra (Founder of TechMaster), exploring how technology creators have transitioned from mere product reviewers to trusted advisory voices driving high-stake purchase decisions.",
          category: "CREATOR ECONOMY",
          authorName: "Arvind Kharra",
          authorRole: "Founder, TechMaster",
          authorAvatar: "/TechMaster.jpeg",
          date: "23.09.2026",
          readTime: "4 min read",
          views: "24,850",
          likes: "2,340",
          imageUrl: "/articles/adgully_creators.jpg",
          articleUrl: "https://www.adgully.com/post/20995/from-influencers-to-trusted-voices-the-changing-role-of-creators-in-tech-buying-decisions#google_vignette",
          isFeatured: true,
          isHot: false,
          order: 1
        },
        {
          id: "art-2",
          title: "Content creators decode the future of influence at Convergence India 2026",
          excerpt: "At the 33rd Convergence India Expo, Arvind Kharra highlighted AI as an empowering support system rather than a disruptor, emphasizing authenticity and trust in digital media.",
          category: "DIGITAL MEDIA",
          authorName: "Communications Today",
          authorRole: "Media Coverage",
          authorAvatar: "/Tech MAster Logo.png",
          date: "07.04.2026",
          readTime: "3 min read",
          views: "19,420",
          likes: "1,890",
          imageUrl: "/articles/convergence_india.jpg",
          articleUrl: "https://www.communicationstoday.co.in/content-creators-decode-the-future-of-influence-at-convergence-india-2026/",
          isFeatured: false,
          isHot: true,
          order: 2
        },
        {
          id: "art-3",
          title: "5 Made-in-India AI Innovations Driving the Next Wave of Digital Transformation",
          excerpt: "India’s AI ecosystem is moving beyond experimentation, with groundbreaking solutions solving real-world enterprise operations and digital visibility at scale.",
          category: "ARTIFICIAL INTELLIGENCE",
          authorName: "CXO Today",
          authorRole: "Tech Analysis",
          authorAvatar: "/NextUniverz.jpeg",
          date: "18.09.2026",
          readTime: "5 min read",
          views: "15,630",
          likes: "1,420",
          imageUrl: "/articles/cxotoday_ai.jpg",
          articleUrl: "https://cxotoday.com/others/5-made-in-india-ai-innovations-driving-the-next-wave-of-digital-transformation/",
          isFeatured: false,
          isHot: false,
          order: 3
        },
        {
          id: "art-4",
          title: "AI travel planning: 7 money checks to make before booking flights, hotels",
          excerpt: "Arvind Kharra, Founder & CEO of Tech Master, explains how AI tools can optimise total trip budgets, calculate all-in hidden costs, and evaluate travel alternatives.",
          category: "TRAVEL TECH",
          authorName: "CNBC TV18",
          authorRole: "Featured Expert",
          authorAvatar: "/MasterWheels.jpeg",
          date: "17.08.2026",
          readTime: "6 min read",
          views: "28,910",
          likes: "2,780",
          imageUrl: "/articles/cnbc_travel_ai.jpg",
          articleUrl: "https://www.cnbctv18.com/travel/ai-travel-planning-money-checks-to-make-before-booking-flights-hotels-19969900.htm",
          isFeatured: false,
          isHot: false,
          order: 4
        }
      ];

  const sortedList = [...rawList].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Determine Main Left Featured candidate(s)
  const featuredCandidates = sortedList.filter((a) => a.isFeatured);
  const mainArticles = featuredCandidates.length > 0 ? featuredCandidates : sortedList.slice(0, 1);

  // Index for Left Featured Carousel
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const activeFeatured = mainArticles[featuredIndex % mainArticles.length] || sortedList[0];

  // Hot candidates (Right Column)
  const remainingForHot = sortedList.filter((a) => a.id !== activeFeatured.id);
  const hotFeaturedCandidate = remainingForHot.find((a) => a.isHot) || remainingForHot[0] || activeFeatured;

  // Index for Secondary Hot image pill
  const [hotIndex, setHotIndex] = useState(0);
  const secondaryCandidates = remainingForHot.length > 0 ? remainingForHot : sortedList;
  const activeSecondary = secondaryCandidates[hotIndex % secondaryCandidates.length] || hotFeaturedCandidate;

  // Mini list items (items not currently featured in the top two positions)
  const miniArticles = sortedList.filter(
    (a) => a.id !== activeFeatured.id && a.id !== activeSecondary.id
  );

  // If there are few mini items, provide the remaining ones so list is always informative
  const displayMiniList = miniArticles.length > 0 ? miniArticles : sortedList.filter((a) => a.id !== activeFeatured.id);

  const [showAllArticles, setShowAllArticles] = useState(false);

  const handlePrevFeatured = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFeaturedIndex((prev) => (prev - 1 + mainArticles.length) % mainArticles.length);
  };

  const handleNextFeatured = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFeaturedIndex((prev) => (prev + 1) % mainArticles.length);
  };

  const handlePrevHot = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHotIndex((prev) => (prev - 1 + secondaryCandidates.length) % secondaryCandidates.length);
  };

  const handleNextHot = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHotIndex((prev) => (prev + 1) % secondaryCandidates.length);
  };

  const badgeText = data?.badge || "LATEST ARTICLES";
  const headingText = data?.heading || "Featured Stories & Press Highlights";
  const descriptionText = data?.description || "Exclusive deep dives, industry interviews, and thought leadership from Arvind Kharra & Tech Master.";
  const hotTitleText = data?.hotTitle || "Hot";

  return (
    <section className="scroll-section py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative z-10">
      {/* Header Badge & Title */}
      <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-14">
        <div className="flex justify-center mb-4 sm:mb-5 relative z-20">
          <span className="typo-badge text-gold/90 border border-gold/30 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/60 font-mono font-semibold tracking-[2px] sm:tracking-[3px] uppercase text-[10px] sm:text-xs shadow-lg shadow-gold/5">
            {badgeText}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
          {headingText}
        </h2>

        {descriptionText && (
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto mt-3 sm:mt-4 font-sans font-light leading-relaxed">
            {descriptionText}
          </p>
        )}
      </div>

      {/* Main Grid: Left Featured (7 cols) + Right Hot Card (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* =========================================================
            LEFT COLUMN: MAIN FEATURED ARTICLE CARD (SCREENSHOT LEFT)
        ========================================================== */}
        <div className="lg:col-span-7 flex flex-col group">
          {/* Main Hero Image with Carousel Arrows Overlay */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl group/image">
            <img
              src={mediaUrl(activeFeatured.imageUrl) || "/articles/adgully_creators.jpg"}
              alt={activeFeatured.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/image:scale-105"
            />

            {/* Gradient Overlay for Cinematic Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Overlay Navigation Arrows (Matching Screenshot Circular Pill Buttons) */}
            {mainArticles.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevFeatured}
                  aria-label="Previous article"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextFeatured}
                  aria-label="Next article"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-gold hover:bg-yellow-400 text-black flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl shadow-gold/30 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5 font-bold" />
                </button>
              </>
            )}

            {/* Indicator dots if multiple featured */}
            {mainArticles.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {mainArticles.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeaturedIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === featuredIndex % mainArticles.length ? "w-6 bg-gold" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Author & Category Meta Row */}
          <div className="flex items-center justify-between gap-3 mt-5 sm:mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-gold/40 bg-zinc-900 shrink-0 shadow-md">
                <img
                  src={mediaUrl(activeFeatured.authorAvatar) || "/TechMaster.jpeg"}
                  alt={activeFeatured.authorName || "Author"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm sm:text-base tracking-wide">
                  {activeFeatured.authorName || "Arvind Kharra"}
                </span>
                {activeFeatured.authorRole && (
                  <span className="text-zinc-500 text-[11px] font-mono">
                    {activeFeatured.authorRole}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                {activeFeatured.category || "TECH"}
              </span>
              <span className="text-zinc-500 text-[11px]">
                {activeFeatured.date || "23.09.2026"}
              </span>
            </div>
          </div>

          {/* Headline Title */}
          <a
            href={activeFeatured.articleUrl || "#"}
            target={activeFeatured.articleUrl ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="block mt-4 group/title"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white group-hover/title:text-gold transition-colors duration-300 leading-tight">
              {activeFeatured.title}
            </h3>
          </a>

          {/* Excerpt Description */}
          {activeFeatured.excerpt && (
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mt-3 line-clamp-3 font-sans font-normal">
              {activeFeatured.excerpt}
            </p>
          )}

          {/* Read More Link */}
          <div className="mt-4 sm:mt-5">
            <a
              href={activeFeatured.articleUrl || "#"}
              target={activeFeatured.articleUrl ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sky-400 hover:text-gold font-semibold text-sm tracking-wide transition-colors group/link"
            >
              <span>Read more</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1.5" />
            </a>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: "HOT" CARD & LIST (SCREENSHOT RIGHT)
        ========================================================== */}
        <div className="lg:col-span-5 bg-[#0b0b0e]/95 border border-white/10 hover:border-gold/30 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col justify-between transition-colors duration-500">
          <div>
            {/* Header: Clean normal title + "Newest ∨" Dropdown */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg sm:text-xl tracking-tight">
                  {hotTitleText && hotTitleText.toLowerCase() !== "hot" ? hotTitleText : "Trending Stories"}
                </span>
              </div>

              <div className="inline-flex items-center gap-1 text-sky-400 hover:text-gold text-xs font-mono font-medium cursor-pointer transition-colors">
                <span>Newest</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Top Secondary Featured Article in Hot Column */}
            <div className="group/sec mb-6">
              <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-lg">
                <img
                  src={mediaUrl(activeSecondary.imageUrl) || "/articles/convergence_india.jpg"}
                  alt={activeSecondary.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/sec:scale-105"
                />

                {/* Bottom Right Pill Arrows (Exact screenshot reproduction: `< >` pill) */}
                {secondaryCandidates.length > 1 && (
                  <div className="absolute bottom-3 right-3 flex items-center bg-black/70 backdrop-blur-md rounded-full border border-white/20 p-1 shadow-lg">
                    <button
                      type="button"
                      onClick={handlePrevHot}
                      aria-label="Previous hot article"
                      className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-3 bg-white/20 mx-0.5" />
                    <button
                      type="button"
                      onClick={handleNextHot}
                      aria-label="Next hot article"
                      className="w-7 h-7 rounded-full hover:bg-gold hover:text-black flex items-center justify-center text-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mt-3 text-xs font-mono">
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  {activeSecondary.category || "INFLUENCE"}
                </span>
                <span className="text-zinc-500 text-[11px]">
                  {activeSecondary.date || "07.04.2026"}
                </span>
              </div>

              <a
                href={activeSecondary.articleUrl || "#"}
                target={activeSecondary.articleUrl ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="block mt-2 group/sectitle"
              >
                <h4 className="text-base sm:text-lg font-bold text-white group-hover/sectitle:text-gold transition-colors duration-200 line-clamp-2 leading-snug">
                  {activeSecondary.title}
                </h4>
              </a>
            </div>

            {/* Compact Article List Items */}
            <div className="space-y-4 pt-3 border-t border-white/10">
              {(showAllArticles ? sortedList : displayMiniList).map((art, idx) => (
                <a
                  key={art.id || idx}
                  href={art.articleUrl || "#"}
                  target={art.articleUrl ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-white/5 transition-all duration-300 group/item"
                >
                  {/* Square Rounded Thumbnail */}
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0 relative">
                    <img
                      src={mediaUrl(art.imageUrl) || "/articles/cxotoday_ai.jpg"}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Article Info & Stats */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    <h5 className="text-xs sm:text-sm font-semibold text-zinc-100 group-hover/item:text-gold transition-colors duration-200 line-clamp-2 leading-snug">
                      {art.title}
                    </h5>

                    {/* Stats Row (Views & Likes, matching screenshot stats layout) */}
                    <div className="flex items-center gap-4 text-[11px] text-zinc-400 mt-2 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{art.views || "12,875"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ThumbsUp className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{art.likes || "1,234"}</span>
                      </div>
                    </div>

                    <div className="text-sky-400 group-hover/item:text-gold text-[11px] font-medium mt-1 inline-flex items-center gap-1 transition-colors">
                      <span>Read more</span>
                      <ChevronRight className="w-3 h-3 group-hover/item:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Footer Action: Load more articles > */}
          <div className="pt-5 mt-4 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => setShowAllArticles(!showAllArticles)}
              className="inline-flex items-center gap-1.5 text-sky-400 hover:text-gold font-semibold text-xs sm:text-sm tracking-wide transition-colors cursor-pointer group/load"
            >
              <span>{showAllArticles ? "Show less articles" : "Load more articles"}</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/load:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
