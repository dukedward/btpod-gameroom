import { Trophy, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function ScoreBoard({ scores, currentTurnEmail }) {
  const sorted = [...(scores || [])].sort(
    (a, b) => (b.points || 0) - (a.points || 0),
  );

  if (!sorted.length) {
    return (
      <div className="rounded-xl bg-card border border-border/50 p-6 text-center">
        <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No scores yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sorted.map((score, i) => {
        const isFirst = i === 0 && score.points > 0;
        const isTurn = score.player_email === currentTurnEmail;
        return (
          <motion.div
            key={score.id || i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 rounded-xl p-4 transition-all ${
              isTurn
                ? "bg-primary/15 border border-primary/40"
                : "bg-card border border-border/50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                isFirst
                  ? "bg-accent/20 text-accent"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isFirst ? <Crown className="w-4 h-4" /> : i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {score.player_name}
              </p>
              {isTurn && (
                <p className="text-[10px] uppercase tracking-widest text-primary font-semibold">
                  Their Turn
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-display text-2xl tracking-wider text-foreground">
                {score.points || 0}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase">pts</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
