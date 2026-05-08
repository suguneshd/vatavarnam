import { useState, useEffect, useRef } from "react";

const SUGGESTED_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
  "Hyderabad", "Pune", "Jaipur", "Ahmedabad", "Kochi",
  "Tokyo", "London", "New York", "Dubai", "Sydney",
  "Paris", "Singapore", "San Francisco", "Los Angeles", "Toronto"
];

export default function SearchBar({ value, onChange, onSearch }) {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearchClick(city) {
    const searchVal = typeof city === "string" ? city : value;
    const trimmed = searchVal.trim();
    
    if (trimmed) {
      
      let updatedSearches = [trimmed, ...recentSearches.filter(c => c.toLowerCase() !== trimmed.toLowerCase())];
      
      updatedSearches = updatedSearches.slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      
      if (typeof city === "string" && onChange) {
        onChange({ target: { value: city } });
      }
    }
    
    onSearch(searchVal);
    setIsFocused(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  }

  const filteredSuggestions = value.trim() 
    ? SUGGESTED_CITIES.filter(c => 
        c.toLowerCase().includes(value.toLowerCase()) && 
        !recentSearches.some(rs => rs.toLowerCase() === c.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="w-full max-w-2xl px-4 relative" ref={wrapperRef}>
      <div className={`bubble-card p-3 flex gap-3 items-center transition-all duration-300 ${isFocused ? 'ring-4 ring-sky-400/50 shadow-sky-500/30' : 'animate-pulse-glow'}`}>
                <span className="text-2xl pl-2 opacity-70 select-none">🔍</span>

        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e);
            if (!isFocused) setIsFocused(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder="Search city — e.g. Mumbai, Tokyo, Paris…"
          className="
            flex-1 bg-transparent text-sky-900 font-bold text-base md:text-lg
            placeholder:text-sky-400 placeholder:font-normal
            outline-none border-none
            transition-all duration-300
          "
          style={{ caretColor: "#0369a1" }}
        />

        <button
          onClick={() => handleSearchClick()}
          className="
            px-6 py-3 rounded-2xl font-black text-sm md:text-base
            bg-gradient-to-br from-sky-500 to-sky-700
            text-white border border-sky-400/40
            shadow-lg shadow-sky-500/30
            transition-all duration-200
            hover:scale-105 hover:shadow-sky-500/50
            active:scale-95
            whitespace-nowrap
          "
        >
          ⚡ Search
        </button>
      </div>

      {isFocused && (recentSearches.length > 0 || filteredSuggestions.length > 0 || value.trim()) && (
        <div className="absolute top-full mt-3 left-4 right-4 bg-white/95 backdrop-blur-xl border border-white/80 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up">
          <div className="py-2">
            {!value.trim() && recentSearches.length > 0 && (
              <div className="px-4 py-2">
                <div className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-2 px-1">Recent Searches</div>
                {recentSearches.map((city, idx) => (
                  <div 
                    key={`recent-${idx}`} 
                    className="px-4 py-3 rounded-xl hover:bg-sky-100/70 cursor-pointer flex items-center gap-3 transition-colors text-sky-900 font-bold group"
                    onClick={() => handleSearchClick(city)}
                  >
                    <span className="opacity-40 group-hover:opacity-80 transition-opacity">🕒</span>
                    {city}
                  </div>
                ))}
              </div>
            )}
            
            {value.trim() && filteredSuggestions.length > 0 && (
              <div className="px-4 py-2">
                <div className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-2 px-1">Suggestions</div>
                {filteredSuggestions.map((city, idx) => (
                  <div 
                    key={`suggest-${idx}`} 
                    className="px-4 py-3 rounded-xl hover:bg-sky-100/70 cursor-pointer flex items-center gap-3 transition-colors text-sky-900 font-bold group"
                    onClick={() => handleSearchClick(city)}
                  >
                    <span className="opacity-40 group-hover:opacity-80 transition-opacity">📍</span>
                    {city}
                  </div>
                ))}
              </div>
            )}
            
            {value.trim() && filteredSuggestions.length === 0 && (
              <div className="px-4 py-6 text-center text-sky-600/70 font-semibold text-sm">
                Press <span className="font-bold text-sky-800">Enter</span> to search for "{value}"
              </div>
            )}
          </div>
        </div>
      )}

      <p className="text-center text-white/60 text-xs mt-3 tracking-wider font-semibold">
        Press <kbd className="bg-white/25 text-white px-2 py-0.5 rounded font-mono text-[10px] uppercase font-black tracking-widest shadow-sm border border-white/20">Enter</kbd> or click Search
      </p>
    </div>
  );
}
