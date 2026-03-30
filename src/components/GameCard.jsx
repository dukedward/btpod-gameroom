import { motion } from "framer-motion";

const GAME_ICONS = {
  "Basement Feud": "🏠",
  "Culture Tags": "🏷️",
  "Finish the Lyric": "🎵",
  Jeopardy: "❓",
  "Who Wants to be a Millionaire": "💰",
  "25 Words or Less": "💬",
};

const GAME_DESCRIPTIONS = {
  "Basement Feud": "Our spin on Family Feud — guess the top answers!",
  "Culture Tags": "Finish the cultural phrase or tag!",
  "Finish the Lyric": "Complete the song lyrics to score!",
  Jeopardy: "Answer in the form of a question!",
  "Who Wants to be a Millionaire": "Answer your way to the top!",
  "25 Words or Less": "Describe it — but keep it brief!",
};

export default function GameCard({ name, isActive, onClick, delay = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-5 transition-all ${
        isActive
          ? "bg-primary/15 border-primary/50 ring-2 ring-primary/20"
          : "bg-card border-border/50 hover:border-primary/30 hover:bg-card/80"
      }`}
    >
      <span className="text-3xl mb-3 block">{GAME_ICONS[name]}</span>
      <p className="font-display text-lg tracking-wider text-foreground mb-1">
        {name}
      </p>
      <p className="text-xs text-muted-foreground">{GAME_DESCRIPTIONS[name]}</p>
      {isActive && (
        <span className="inline-block mt-3 text-[10px] uppercase tracking-widest text-primary font-semibold bg-primary/10 px-2 py-1 rounded-full">
          Now Playing
        </span>
      )}
    </motion.button>
  );
}
