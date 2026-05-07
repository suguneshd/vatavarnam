// ForecastItem.jsx — One forecast day bubble

export default function ForecastItem({ item, delay = 0 }) {
  const dayName = new Date(item.dt * 1000).toLocaleDateString("en-IN", {
    weekday: "short",
  });
  const icon        = item.weather[0].icon;
  const description = item.weather[0].description;
  const high        = Math.round(item.main.temp_max);
  const low         = Math.round(item.main.temp_min);

  return (
    <div
      className="mini-bubble p-3 text-center animate-bubble-pop"
      style={{ animationDelay: `${delay}s`, animationFillMode: "both" }}
    >
      <p className="text-sky-700 text-xs font-black uppercase tracking-wider mb-1">
        {dayName}
      </p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
        title={description}
        className="w-12 h-12 mx-auto drop-shadow"
      />
      <p className="text-sky-900 font-black text-sm">{high}°</p>
      <p className="text-sky-500 text-xs font-semibold">{low}°</p>
    </div>
  );
}
