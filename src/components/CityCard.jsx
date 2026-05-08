
const conditionEmoji = {
  Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Drizzle: "🌦️",
  Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️", Fog: "🌫️",
  Haze: "🌁", Smoke: "💨", Dust: "🌪️", Sand: "🏜️",
  Squall: "💨", Tornado: "🌪️",
};

export default function CityCard({ city, weatherData, onClick, delay = 0 }) {
  const hasData = !!weatherData;
  const temp = hasData ? Math.round(weatherData.main.temp) : null;
  const feelsLike = hasData ? Math.round(weatherData.main.feels_like) : null;
  const humidity = hasData ? weatherData.main.humidity : null;
  const desc = hasData ? weatherData.weather[0].description : null;
  const mainCond = hasData ? weatherData.weather[0].main : null;
  const iconCode = hasData ? weatherData.weather[0].icon : null;
  const emoji = mainCond ? (conditionEmoji[mainCond] ?? "🌡️") : "⏳";

  return (
    <div
      className="city-card p-4 flex flex-col items-center text-center animate-bubble-pop"
      style={{ animationDelay: `${delay}s`, animationFillMode: "both" }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      title={`View weather for ${city.name}`}
    >
      {/* Flag n country name */}
      <div className="mb-2">
        <span className="text-3xl">{city.flag}</span>
      </div>
      <h3 className="text-sky-900 font-black text-sm leading-tight">{city.name}</h3>
      <p className="text-sky-500 text-xs mt-0.5 leading-snug opacity-80 line-clamp-2">{city.desc}</p>

      {/* Weather info */}
      {hasData ? (
        <>
          <img
            src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
            alt={desc}
            title={desc}
            className="w-14 h-14 mx-auto my-1 drop-shadow"
          />
          <p className="text-sky-900 font-black text-2xl leading-none">
            {temp}°<span className="text-sm font-semibold">C</span>
          </p>
          <p className="text-sky-600 text-xs capitalize font-semibold mt-0.5">{emoji} {desc}</p>
          <div className="flex gap-2 mt-2 text-xs text-sky-500 font-semibold">
            <span>💧 {humidity}%</span>
            <span>·</span>
            <span>🌡️ {feelsLike}°</span>
          </div>
        </>
      ) : (
        <div className="mt-3 flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full border-2 border-sky-300 border-t-transparent animate-spin" />
          <p className="text-sky-400 text-xs">Loading…</p>
        </div>
      )}

      {/* Click hint */}
      <div className="mt-3 text-sky-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Tap for details →
      </div>
    </div>
  );
}
