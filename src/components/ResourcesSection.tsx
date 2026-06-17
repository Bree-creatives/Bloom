import React, { useState } from "react";
import { CURATED_RESOURCES } from "../utils";
import { MentalHealthResource } from "../types";
import { Search, Phone, ArrowUpRight, BookOpen, ShieldCheck, HelpCircle, Sparkles, Heart } from "lucide-react";

export default function ResourcesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | MentalHealthResource['category']>("All");

  const categories: ("All" | MentalHealthResource['category'])[] = [
    "All",
    "Crisis Support",
    "Therapy Directory",
    "CBT Tools",
    "Mindfulness",
    "Self Guided Reading"
  ];

  const filtered = CURATED_RESOURCES.filter((res) => {
    const matchesCategory = selectedCategory === "All" || res.category === selectedCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryTheme = (cat: MentalHealthResource['category']) => {
    switch (cat) {
      case "Crisis Support":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "Therapy Directory":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CBT Tools":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Mindfulness":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      default:
        return "bg-rose-100 text-rose-800 border-rose-200";
    }
  };

  return (
    <div className="space-y-6" id="resources-section-container">
      {/* Informative Guidance Banner */}
      <div className="p-5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <h3 className="text-sm font-bold tracking-wider flex items-center gap-1.5 text-white">
            <Heart className="w-5 h-5 text-white fill-white animate-pulse" /> Healing Care & Therapy Directories
          </h3>
          <p className="text-xs text-pink-50 max-w-xl leading-relaxed font-medium">
            You don't have to carry the entire sky in your wings. These beautiful pathways are trusted, confidential avenues to professional clinical therapists and real guides.
          </p>
        </div>

        <a
          href="https://988lifeline.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-white text-pink-600 rounded-full text-xs font-bold tracking-wide hover:scale-105 active:scale-95 transition-all shadow"
          id="btn-headline-crisis-988"
        >
          <Phone className="w-3.5 h-3.5 fill-pink-600 stroke-none" />
          Call or Text 988 💖
        </a>
      </div>

      {/* Control bar: Search + Categorical filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Category Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" id="resources-tab-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold border rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-pink-400 to-purple-400 border-transparent text-white shadow-sm"
                  : "bg-white border-pink-100 text-purple-600 hover:bg-pink-50"
              }`}
            >
              {cat === "All" ? "💖 All Resources" : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-pink-400" />
          <input
            type="text"
            placeholder="Search cozy guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-pink-100 rounded-xl outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition shadow-inner"
            id="search-resources-input"
          />
        </div>
      </div>

      {/* Grid directories */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-pink-200 bg-pink-50/10 rounded-3xl" id="empty-resources">
          <HelpCircle className="w-8 h-8 text-pink-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-pink-700">No resources matched your key dust query.</p>
          <p className="text-xs text-purple-500 mt-1">Try another cute category or clear your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="resources-cards-grid">
          {filtered.map((res) => (
            <div
              key={res.id}
              className="p-5 border-2 border-pink-100 bg-white rounded-2xl shadow-xs hover:border-pink-300 hover:shadow-md transition flex flex-col justify-between space-y-4"
              id={`resource-${res.id}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className={`px-2.5 py-0.5 text-[9px] font-bold border rounded-full uppercase tracking-widest ${getCategoryTheme(res.category)}`}>
                    {res.category}
                  </span>

                  <span className="text-[10px] text-purple-400 font-bold font-mono">
                    {res.tag} ⭐
                  </span>
                </div>

                <h4 className="text-xs sm:text-xs md:text-sm font-extrabold text-purple-900 tracking-tight leading-snug">
                  🌸 {res.title}
                </h4>

                <p className="text-xs text-purple-800/80 font-medium leading-relaxed text-justify">
                  {res.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-pink-50">
                <a
                  href={res.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-pink-500 hover:text-pink-600 transition"
                  id={`link-${res.id}`}
                >
                  Visit official platform
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional Crisis Notice */}
      <div className="p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border-2 border-pink-100 rounded-2xl space-y-1.5" id="support-disclaimer">
        <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5 uppercase tracking-widest">
          <BookOpen className="w-4 h-4 text-pink-500 animate-pulse" /> Crucial Mental Health Note
        </h4>
        <p className="text-xs text-purple-850 leading-relaxed font-semibold">
          The CBT analysis, affirmations, and habits provided in this companion app are designed strictly as auxiliary self-coaching and grounding exercises. They are extremely helpful, but do not replace or constitute formal clinical psychotherapy, certified medical therapy, or licensed psychiatric solutions. If you are going through severe emotional crises, self-harm thoughts, or heavy clinical depression, please connect synchronously with local professional emergency systems or call <strong>988</strong> immediately.
        </p>
      </div>
    </div>
  );
}
