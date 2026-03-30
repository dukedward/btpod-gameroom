import { motion } from "framer-motion";
import { Tag, HelpCircle } from "lucide-react";
import { CULTURE_TAGS_CATEGORIES } from "../lib/cultureTags/cultureTags";

// Contestant view - sees category + acronym, NOT the phrase
export function CultureTagsContestantView({
  game,
  isChooser,
  onChooseCategory,
}) {
  if (isChooser && !game.culture_tags_category) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl bg-linear-to-br from-secondary/10 via-card to-primary/5 border border-secondary/30 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-secondary" />
          <span className="text-xs uppercase tracking-widest text-secondary font-semibold">
            Culture Tags — Choose Your Category
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CULTURE_TAGS_CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onChooseCategory(cat)}
              className="rounded-lg bg-muted border border-border/50 hover:border-secondary/50 hover:bg-secondary/10 p-3 text-left transition-all"
            >
              <p className="text-sm font-medium text-foreground">{cat}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (!game.culture_tags_category) {
    return (
      <div className="rounded-xl bg-card border border-border/50 p-8 text-center">
        <HelpCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground text-sm">
          Waiting for category selection...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      key={game.culture_tags_acronym}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl bg-linear-to-br from-secondary/10 via-card to-primary/5 border border-secondary/30 p-6 md:p-8"
    >
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-secondary" />
        <span className="text-xs uppercase tracking-widest text-secondary font-semibold">
          Culture Tags
        </span>
      </div>
      <div className="rounded-lg bg-secondary/10 border border-secondary/30 px-3 py-1.5 inline-block mb-4">
        <span className="text-xs font-semibold text-secondary uppercase tracking-widest">
          {game.culture_tags_category}
        </span>
      </div>
      {game.culture_tags_acronym ? (
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
            Decode the acronym:
          </p>
          <p className="font-display text-4xl md:text-5xl tracking-widest text-foreground">
            {game.culture_tags_acronym}
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          Waiting for the host to set a phrase...
        </p>
      )}
    </motion.div>
  );
}

// Host view - sees the full phrase
export function CultureTagsHostView({ game }) {
  if (!game?.culture_tags_category) return null;

  return (
    <div className="rounded-xl bg-accent/10 border border-accent/30 p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-accent" />
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">
          Host View — Culture Tags
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            Full Phrase
          </p>
          <p className="font-semibold text-foreground">
            {game.culture_tags_phrase || "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            Contestants See
          </p>
          <p className="font-display text-2xl tracking-wider text-accent">
            {game.culture_tags_acronym || "—"}
          </p>
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
          Category
        </p>
        <p className="text-sm font-medium text-foreground">
          {game.culture_tags_category}
        </p>
      </div>
    </div>
  );
}
