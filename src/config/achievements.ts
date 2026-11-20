/** Achievements visitors can unlock. Progress is stored in the visitor's browser only. */
export const achievements = [
  { id: "welcome", title: "Welcome to the City", description: "Entered the city for the first time.", icon: "🌆" },
  { id: "explorer", title: "Explorer", description: "Visited every location on the map.", icon: "🗺️" },
  { id: "mission-briefing", title: "Mission Briefing", description: "Opened a full mission case study.", icon: "📁" },
  { id: "phone-home", title: "Phone Home", description: "Unlocked the smartphone.", icon: "📱" },
  { id: "dj", title: "On the Air", description: "Tuned into a radio station.", icon: "📻" },
  { id: "hacker", title: "Hacker", description: "Opened the developer terminal.", icon: "💻" },
  { id: "night-owl", title: "Night Owl", description: "Turned the city to night.", icon: "🌙" },
  { id: "storm-chaser", title: "Storm Chaser", description: "Made it rain.", icon: "🌧️" },
  { id: "most-wanted", title: "Most Wanted", description: "Reached a 5-star wanted level.", icon: "⭐" },
  { id: "old-school", title: "Old School", description: "Entered a legendary cheat code.", icon: "🕹️" },
  { id: "secret-spot", title: "Off the Map", description: "Found a secret location.", icon: "🔑" },
  { id: "reader", title: "Breaking News", description: "Read a city news article.", icon: "📰" },
  { id: "contact", title: "Mission Accepted", description: "Sent a message to the developer.", icon: "🤝" },
] as const;

export type AchievementId = (typeof achievements)[number]["id"];
