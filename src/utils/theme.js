// theme.js
// Handles picking the right colors based on the weather condition.
// Keeping this in a separate file makes App.jsx much easier to read.

// Step 1: Figure out which theme name to use
export function getThemeName(condition = "") {
  const c = condition.toLowerCase();

  if (c.includes("clear") || c.includes("sun")) return "sunny";
  if (c.includes("rain") || c.includes("drizzle") || c.includes("thunder")) return "rainy";
  if (c.includes("cloud") || c.includes("mist") || c.includes("fog") || c.includes("haze")) return "cloudy";
  if (c.includes("snow") || c.includes("sleet") || c.includes("hail")) return "snowy";

  return "default";
}

// Step 2: Map each theme name to its Tailwind classes
// Each theme has: bg (background gradient), card, text, subtext, badge, button colors
const themes = {
  sunny: {
    bg: "from-amber-400 via-orange-300 to-yellow-200",
    card: "bg-white/25 border-white/30",
    text: "text-amber-950",
    subtext: "text-amber-900/60",
    badge: "bg-amber-600/20 text-amber-950",
    button: "bg-amber-700/30 hover:bg-amber-700/50 text-amber-950",
  },
  rainy: {
    bg: "from-slate-800 via-blue-900 to-slate-900",
    card: "bg-white/10 border-white/15",
    text: "text-blue-50",
    subtext: "text-blue-200/60",
    badge: "bg-blue-400/20 text-blue-100",
    button: "bg-blue-400/30 hover:bg-blue-400/50 text-blue-50",
  },
  cloudy: {
    bg: "from-slate-500 via-gray-400 to-slate-600",
    card: "bg-white/20 border-white/25",
    text: "text-slate-950",
    subtext: "text-slate-800/60",
    badge: "bg-slate-700/20 text-slate-950",
    button: "bg-slate-700/30 hover:bg-slate-700/50 text-slate-950",
  },
  snowy: {
    bg: "from-sky-200 via-blue-100 to-white",
    card: "bg-white/40 border-white/50",
    text: "text-sky-950",
    subtext: "text-sky-800/60",
    badge: "bg-sky-500/20 text-sky-950",
    button: "bg-sky-500/30 hover:bg-sky-500/50 text-sky-950",
  },
  default: {
    bg: "from-indigo-700 via-violet-700 to-indigo-900",
    card: "bg-white/10 border-white/15",
    text: "text-indigo-50",
    subtext: "text-indigo-200/60",
    badge: "bg-indigo-400/20 text-indigo-100",
    button: "bg-indigo-400/30 hover:bg-indigo-400/50 text-indigo-50",
  },
};

// Step 3: Export a single function to get the theme classes by name
export function getTheme(condition) {
  const name = getThemeName(condition);
  return themes[name];
}
