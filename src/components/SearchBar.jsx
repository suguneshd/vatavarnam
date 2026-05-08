import { useState, useEffect } from "react";

const cities = [
  "Mumbai",
  "Delhi",
  "Tokyo",
  "London",
  "Paris",
];

export default function SearchBar({ value, onChange, onSearch }) {
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState([]);

  
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("recent")) || [];
    setRecent(data);
  }, []);

  
  function handleSearch(city = value) {
    if (!city.trim()) return;

    
    const updated = [
      city,
      ...recent.filter((c) => c.toLowerCase() !== city.toLowerCase()),
    ].slice(0, 5);

    setRecent(updated);
    localStorage.setItem("recent", JSON.stringify(updated));

    onSearch(city);
    setFocused(false);
  }

  
  const suggestions = cities.filter((city) =>
    city.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="w-full max-w-xl mx-auto relative">
            <div className="flex gap-2 bg-white p-3 rounded-xl shadow">
        <input
          type="text"
          value={value}
          placeholder="Search city..."
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 outline-none"
        />

        <button
          onClick={() => handleSearch()}
          className="bg-sky-500 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

            {focused && (
        <div className="absolute w-full bg-white shadow rounded-xl mt-2 p-2">
          
                    {!value && recent.length > 0 && (
            <>
              <p className="text-sm font-bold mb-2">Recent</p>

              {recent.map((city, index) => (
                <div
                  key={index}
                  onClick={() => handleSearch(city)}
                  className="p-2 hover:bg-sky-100 rounded cursor-pointer"
                >
                  {city}
                </div>
              ))}
            </>
          )}

                    {value && (
            <>
              <p className="text-sm font-bold mb-2">Suggestions</p>

              {suggestions.map((city, index) => (
                <div
                  key={index}
                  onClick={() => handleSearch(city)}
                  className="p-2 hover:bg-sky-100 rounded cursor-pointer"
                >
                  {city}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
