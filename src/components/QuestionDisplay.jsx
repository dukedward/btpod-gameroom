import { motion } from "framer-motion";
import { HelpCircle, Eye, EyeOff } from "lucide-react";

export default function QuestionDisplay({ game }) {
  if (!game?.current_question) {
    return (
      <div className="rounded-xl bg-card border border-border/50 p-8 text-center">
        <HelpCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
          Waiting for the next question...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      key={game.current_question}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl bg-linear-to-br from-primary/10 via-card to-secondary/5 border border-primary/30 p-6 md:p-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">
          Current Question — Round {game.current_round || 1}
        </span>
      </div>
      <h3 className="font-display text-2xl md:text-3xl tracking-wider text-foreground mb-6">
        {game.current_question}
      </h3>

      {/* Answer Board (for Basement Feud style) */}
      {game.current_answers?.length > 0 && (
        <div className="space-y-2">
          {game.current_answers.map((ans, i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-lg p-3 transition-all ${
                ans.revealed
                  ? "bg-primary/15 border border-primary/30"
                  : "bg-muted/50 border border-border/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-sm font-bold text-foreground">
                  {i + 1}
                </span>
                {ans.revealed ? (
                  <span className="font-medium text-foreground">
                    {ans.text}
                  </span>
                ) : (
                  <span className="text-muted-foreground italic">Hidden</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {ans.revealed ? (
                  <>
                    <Eye className="w-3 h-3 text-primary" />
                    <span className="font-display text-lg text-primary">
                      {ans.points}
                    </span>
                  </>
                ) : (
                  <EyeOff className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {game.revealed_info && (
        <div className="mt-4 rounded-lg bg-accent/10 border border-accent/30 p-3">
          <p className="text-sm text-accent">{game.revealed_info}</p>
        </div>
      )}
    </motion.div>
  );
}
