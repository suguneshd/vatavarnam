import { useState, useEffect, useRef, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastItem from "./components/ForecastItem";
import CityCard from "./components/CityCard";

const API_KEY  = "b6981ddb459abfa25f8eb8be571a1db1";
const API_BASE = "https://api.openweathermap.org/data/2.5";

const DEFAULT_CITIES = [
  { name: "Mumbai",    country: "IN", flag: "🇮🇳", desc: "The city of dreams, monsoon capital" },
  { name: "Delhi",     country: "IN", flag: "🇮🇳", desc: "India's scorching capital city" },
  { name: "Bangalore", country: "IN", flag: "🇮🇳", desc: "Garden city & IT hub of India" },
  { name: "Chennai",   country: "IN", flag: "🇮🇳", desc: "Gateway to South India" },
  { name: "Kolkata",   country: "IN", flag: "🇮🇳", desc: "Cultural capital of India" },
  { name: "Hyderabad", country: "IN", flag: "🇮🇳", desc: "City of Nawabs & biryani" },
  { name: "Pune",      country: "IN", flag: "🇮🇳", desc: "Oxford of the East" },
  { name: "Jaipur",    country: "IN", flag: "🇮🇳", desc: "The Pink City of Rajasthan" },
  { name: "Ahmedabad", country: "IN", flag: "🇮🇳", desc: "Vibrant heart of Gujarat" },
  { name: "Kochi",     country: "IN", flag: "🇮🇳", desc: "Queen of the Arabian Sea" },
  { name: "Tokyo",     country: "JP", flag: "🇯🇵", desc: "Neon metropolis of the east" },
  { name: "London",    country: "GB", flag: "🇬🇧", desc: "Where fog meets history" },
  { name: "New York",  country: "US", flag: "🇺🇸", desc: "The city that never sleeps" },
  { name: "Dubai",     country: "AE", flag: "🇦🇪", desc: "Jewel of the Persian Gulf" },
  { name: "Sydney",    country: "AU", flag: "🇦🇺", desc: "Harbour city down under" },
];

//Back-Ground Animation
  const clouds = [
    { w: 180, h: 60,  top: "8%",  delay: "0s",  dur: "28s",  blur: 3 },
    { w: 260, h: 80,  top: "18%", delay: "6s",  dur: "40s",  blur: 4 },
    { w: 140, h: 50,  top: "35%", delay: "12s", dur: "22s",  blur: 2 },
    { w: 320, h: 90,  top: "55%", delay: "4s",  dur: "50s",  blur: 5 },
    { w: 200, h: 65,  top: "72%", delay: "18s", dur: "35s",  blur: 3 },
    { w: 110, h: 40,  top: "88%", delay: "9s",  dur: "26s",  blur: 2 },
  ];

  return (
    <>
      {clouds.map((c, i) => (
        <div
          key={i}
          className="cloud"
          style={{
            width:  c.w,
            height: c.h,
            top:    c.top,
            animationDelay:    c.delay,
            animationDuration: c.dur,
            filter: `blur(${c.blur}px)`,
            left: "-200px",
          }}
        />
      ))}
    </>
  );
}



  // State
  const [cityInput,   setCityInput]   = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [weather,     setWeather]     = useState(null);
  const [forecast,    setForecast]    = useState([]);
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState("");
  const [cityWeather, setCityWeather] = useState({});
  const [loadingCities, setLoadingCities] = useState(true);

  // Fetch all default city weather on mount
  useEffect(() => {
    async function fetchAllCities() {
      setLoadingCities(true);
      const results = {};
      await Promise.allSettled(
        DEFAULT_CITIES.map(async (c) => {
          try {
            const res  = await fetch(
              `${API_BASE}/weather?q=${encodeURIComponent(c.name)},${c.country}&appid=${API_KEY}&units=metric`
            );
            if (res.ok) {
              const data = await res.json();
              results[c.name] = data;
            }
          } catch (_) {}
        })
      );
      setCityWeather(results);
      setLoadingCities(false);
    }
    fetchAllCities();
  }, []);

  // Fetch weather for searched city
  useEffect(() => {
    if (!searchQuery) return;
    async function fetchWeather() {
      setIsLoading(true);
      setError("");
      setWeather(null);
      setForecast([]);
      try {
        const [weatherRes, forecastRes] = await Promise.all([
          fetch(`${API_BASE}/weather?q=${encodeURIComponent(searchQuery)}&appid=${API_KEY}&units=metric`),
          fetch(`${API_BASE}/forecast?q=${encodeURIComponent(searchQuery)}&appid=${API_KEY}&units=metric`),
        ]);
        if (!weatherRes.ok) {
          throw new Error(
            weatherRes.status === 404
              ? "City not found. Please check the spelling."
              : "Something went wrong. Please try again."
          );
        }
        const weatherData  = await weatherRes.json();
        const forecastData = await forecastRes.json();
        setWeather(weatherData);
        setForecast(
          forecastData.list.filter((_, i) => i % 8 === 0).slice(0, 5)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWeather();
    setTimeout(() => {
      document.getElementById("weather-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }, [searchQuery]);

  const handleSearch = useCallback((overrideCity) => {
    const val = typeof overrideCity === "string" ? overrideCity : cityInput;
    const trimmed = val.trim();
    if (trimmed) setSearchQuery(trimmed);
  }, [cityInput]);

  const handleCityClick = useCallback((cityName) => {
    setCityInput(cityName);
    setSearchQuery(cityName);
  }, []);

  return (
    <>
      {/* Cursor */}
      <div
        ref={cursorRef}
        className={`cursor-bolt ${clicking ? "clicking" : ""}`}
        aria-hidden="true"
      >
        ⚡
      </div>

      {/* Sky background */}
      <div className="sky-bg font-sans">
        <Clouds />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-14">

          {/* Header */}
          <header className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-5xl md:text-6xl animate-float-slow">☁️</span>
              <h1 className="font-display text-5xl md:text-7xl font-black text-white drop-shadow-lg tracking-tight">
                వాతావరణం
              </h1>
              <span className="text-5xl md:text-6xl animate-float-medium" style={{ animationDelay: "1s" }}>🌤️</span>
            </div>
            <p className="text-sky-100 text-base md:text-lg font-semibold tracking-widest uppercase opacity-90">
              Real-time weather · India &amp; beyond
            </p>
            <p className="mt-3 text-sky-200 text-sm md:text-base max-w-xl mx-auto opacity-80 leading-relaxed">
              Instant atmospheric conditions, feels-like temperature, humidity, wind speed &amp; 5-day forecast — powered by OpenWeatherMap.
            </p>
          </header>

          {/* Search */}
          <section id="search" className="relative z-50 flex justify-center mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <SearchBar
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onSearch={handleSearch}
            />
          </section>

          {/* Weather result */}
          <div id="weather-result">
            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
                <div className="loading-ring mb-5" />
                <p className="text-white text-xl font-bold drop-shadow">Fetching weather data…</p>
              </div>
            )}

            {/* Error state */}
            {error && !isLoading && (
              <div className="bubble-card max-w-lg mx-auto p-8 text-center mb-12 animate-bounce-in">
                <p className="text-4xl mb-3">⛈️</p>
                <p className="text-sky-900 font-bold text-lg">{error}</p>
                <p className="text-sky-700 text-sm mt-2">Try checking the city name or country spelling.</p>
              </div>
            )}

            {/* Weather card */}
            {weather && !isLoading && (
              <div className="max-w-2xl mx-auto mb-16 animate-slide-up">
                <WeatherCard weather={weather} />
                {forecast.length > 0 && (
                  <section className="mt-6">
                    <h2 className="text-white text-xs font-black uppercase tracking-widest mb-4 opacity-80 text-center">
                      5-Day Forecast
                    </h2>
                    <div className="grid grid-cols-5 gap-3">
                      {forecast.map((day, idx) => (
                        <ForecastItem key={idx} item={day} delay={idx * 0.07} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex-1 h-px bg-white/25" />
            <span className="text-white/70 font-bold text-sm uppercase tracking-widest">Featured Cities</span>
            <div className="flex-1 h-px bg-white/25" />
          </div>

          {/* India section */}
          <section className="mb-12">
            <h2 className="text-white font-black text-2xl md:text-3xl mb-2 drop-shadow flex items-center gap-2">
              <span>🇮🇳</span> India
            </h2>
            <p className="text-sky-100 text-sm mb-6 opacity-75">Click any city to see full weather details</p>

            {loadingCities ? (
              <div className="flex items-center justify-center py-12">
                <div className="loading-ring" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {DEFAULT_CITIES.slice(0, 10).map((c, i) => (
                  <CityCard
                    key={c.name}
                    city={c}
                    weatherData={cityWeather[c.name]}
                    onClick={() => handleCityClick(c.name)}
                    delay={i * 0.06}
                    staggerClass={`stagger-${i + 1}`}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Global cities section */}
          <section className="mb-16">
            <h2 className="text-white font-black text-2xl md:text-3xl mb-2 drop-shadow flex items-center gap-2">
              <span>🌏</span> Around the World
            </h2>
            <p className="text-sky-100 text-sm mb-6 opacity-75">5 global cities at a glance</p>

            {loadingCities ? (
              <div className="flex items-center justify-center py-12">
                <div className="loading-ring" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {DEFAULT_CITIES.slice(10).map((c, i) => (
                  <CityCard
                    key={c.name}
                    city={c}
                    weatherData={cityWeather[c.name]}
                    onClick={() => handleCityClick(c.name)}
                    delay={(i + 10) * 0.06}
                    staggerClass={`stagger-${i + 11}`}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Footer */}
          <footer className="text-center pb-8 animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <p className="text-white/50 text-xs">
              Powered by <span className="font-bold text-white/70">OpenWeatherMap</span> · Built with ⚡ &amp; ❤️
            </p>
          </footer>

        </div>
      </div>
    </>
  );
}
