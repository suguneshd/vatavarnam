
function StatBubble({ icon, label, value }) {
  return (
    <div className="mini-bubble p-4 text-center group transition-all duration-300">
      <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform duration-200">{icon}</span>
      <p className="text-sky-600 text-xs font-semibold mb-1 uppercase tracking-wide">{label}</p>
      <p className="text-sky-900 font-black text-base">{value}</p>
    </div>
  );
}

// Map OpenWeatherMap condition main to a bg gradient
function getConditionGradient(main) {
  const map = {
    Clear: "from-amber-300/20 via-sky-200/20 to-sky-300/20",
    Clouds: "from-slate-300/20 via-sky-200/20 to-sky-300/20",
    Rain: "from-sky-500/20 via-blue-400/20 to-indigo-400/20",
    Drizzle: "from-sky-400/20 via-sky-300/20 to-blue-300/20",
    Thunderstorm: "from-violet-500/20 via-blue-500/20 to-sky-400/20",
    Snow: "from-slate-100/30 via-sky-100/30 to-white/30",
    Mist: "from-slate-300/20 via-slate-200/20 to-sky-200/20",
    Fog: "from-slate-300/20 via-slate-200/20 to-sky-200/20",
    Haze: "from-amber-200/20 via-yellow-100/20 to-sky-200/20",
    Smoke: "from-gray-400/20 via-gray-300/20 to-sky-200/20",
    Dust: "from-yellow-300/20 via-amber-200/20 to-sky-200/20",
    Sand: "from-yellow-400/20 via-amber-300/20 to-sky-200/20",
    Squall: "from-teal-400/20 via-sky-400/20 to-blue-400/20",
    Tornado: "from-red-400/20 via-purple-400/20 to-sky-400/20",
  };
  return map[main] ?? "from-sky-200/20 via-sky-100/20 to-white/20";
}

// Condition emoji
function conditionEmoji(main) {
  const map = {
    Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Drizzle: "🌦️",
    Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️", Fog: "🌫️",
    Haze: "🌁", Smoke: "💨", Dust: "🌪️", Sand: "🏜️",
    Squall: "💨", Tornado: "🌪️",
  };
  return map[main] ?? "🌡️";
}

// Generate smart suggestions based on weather conditions
function getSuggestions(weather) {
  const temp = weather.main.temp;
  const mainCond = weather.weather[0].main;
  const suggestions = [];

  // Temperature based
  if (temp > 30) {
    suggestions.push({ icon: "👕", text: "Wear light, breathable cotton clothes." });
    suggestions.push({ icon: "💧", text: "Drink plenty of water to stay hydrated." });
    suggestions.push({ icon: "🍉", text: "Have light, refreshing food like fruits." });
  } else if (temp < 15) {
    suggestions.push({ icon: "🧥", text: "Wear warm layers or a thick jacket." });
    suggestions.push({ icon: "☕", text: "Have hot beverages to stay warm." });
  } else {
    suggestions.push({ icon: "👕", text: "Comfortable weather, wear casual clothes." });
  }

  // Condition based
  if (["Rain", "Drizzle", "Thunderstorm"].includes(mainCond)) {
    suggestions.push({ icon: "☂️", text: "Carry an umbrella or raincoat." });
    suggestions.push({ icon: "🚗", text: "Roads might be slippery, travel safely." });
    suggestions.push({ icon: "🥘", text: "Perfect weather for some hot comfort food!" });
  } else if (mainCond === "Clear") {
    suggestions.push({ icon: "🕶️", text: "Wear sunglasses to protect your eyes." });
    if (temp > 20 && temp < 35) {
      suggestions.push({ icon: "🚴", text: "Great day for outdoor activities or a walk!" });
    }
  } else if (mainCond === "Snow") {
    suggestions.push({ icon: "🧤", text: "Wear gloves and winter boots." });
    suggestions.push({ icon: "⚠️", text: "Watch out for icy roads, travel carefully." });
  } else if (["Dust", "Sand", "Smoke", "Haze", "Fog", "Mist"].includes(mainCond)) {
    suggestions.push({ icon: "😷", text: "Consider wearing a mask if going outside." });
    suggestions.push({ icon: "🚗", text: "Low visibility, drive with caution." });
  }

  // Remove duplicates and limit to 4 suggestions
  return suggestions.slice(0, 4);
}

export default function WeatherCard({ weather, isFavorite, onToggleFavorite }) {
  const cityName = weather.name;
  const country = weather.sys.country;
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const tempMax = Math.round(weather.main.temp_max);
  const tempMin = Math.round(weather.main.temp_min);
  const humidity = weather.main.humidity;
  const windSpeed = (weather.wind.speed * 3.6).toFixed(1); // m/s → km/h
  const visibility = weather.visibility ? (weather.visibility / 1000).toFixed(1) + " km" : "N/A";
  const pressure = weather.main.pressure + " hPa";
  const description = weather.weather[0].description;
  const mainCond = weather.weather[0].main;
  const iconCode = weather.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  const gradient = getConditionGradient(mainCond);
  const emoji = conditionEmoji(mainCond);

  // Time of last update
  const updatedAt = new Date(weather.dt * 1000).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });

  const suggestions = getSuggestions(weather);

  return (
    <div className={`bubble-card bg-gradient-to-br ${gradient} p-6 md:p-8 animate-slide-up`}>
      {/* Top Row */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-sky-900 font-black text-3xl md:text-4xl leading-tight flex items-center gap-2">
            {cityName}
            <span className="text-sky-600 font-semibold text-lg">{country}</span>
            <button 
              onClick={() => onToggleFavorite?.(cityName)} 
              className="text-3xl hover:scale-110 active:scale-95 transition-transform drop-shadow-md ml-2"
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {isFavorite ? '⭐' : '☆'}
            </button>
          </h2>
          <p className="text-sky-700 capitalize font-semibold text-base mt-0.5">
            {emoji} {description}
          </p>
          <p className="text-sky-500 text-xs mt-1">Updated at {updatedAt}</p>
        </div>
        <img
          src={iconUrl}
          alt={description}
          className="w-24 h-24 md:w-28 md:h-28 -mt-2 drop-shadow-lg animate-float-slow"
        />
      </div>

      {/* Temperature */}
      <div className="flex items-end gap-4 my-4">
        <div className="text-sky-900 font-black leading-none" style={{ fontSize: "clamp(4rem,10vw,6rem)" }}>
          {temp}<span className="text-3xl font-light align-top mt-3 inline-block">°C</span>
        </div>
        <div className="mb-2 text-sky-700 font-semibold text-sm">
          <p>↑ {tempMax}°C</p>
          <p>↓ {tempMin}°C</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <StatBubble icon="🌡️" label="Feels Like" value={`${feelsLike}°C`} />
        <StatBubble icon="💧" label="Humidity" value={`${humidity}%`} />
        <StatBubble icon="💨" label="Wind" value={`${windSpeed} km/h`} />
        <StatBubble icon="👁️" label="Visibility" value={visibility} />
      </div>

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-6 pt-5 border-t border-sky-300/30">
          <h3 className="text-sky-800 font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="text-lg">💡</span> Smart Suggestions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((sug, idx) => (
              <div key={idx} className="bg-white/40 hover:bg-white/60 transition-colors duration-300 rounded-2xl p-3 flex items-center gap-3">
                <span className="text-2xl">{sug.icon}</span>
                <span className="text-sky-900 text-sm font-medium leading-tight">{sug.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
