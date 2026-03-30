import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { updateGame } from "../../api/game";
import { updateScore } from "../../api/score";

export default function BuzzInPanel({ game, scores, onRefresh }) {
  if (!game) return null;

  const clearBuzz = async () => {
    await updateGame(game.id, {
      buzzed_in_by: "",
      buzzed_in_name: "",
      buzz_locked: false,
    });
    onRefresh();
  };

  const awardPoint = async (points = 1) => {
    if (!game.buzzed_in_by) return;
    const score = scores.find((s) => s.player_email === game.buzzed_in_by);
    if (score) {
      await updateScore(score.id, {
        points: (score.points || 0) + points,
      });
      toast.success(`+${points} points to ${game.buzzed_in_name}!`);
    }
    await clearBuzz();
  };

  return (
    <div className="rounded-xl border p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Buzz-In
        </span>
      </div>

      <AnimatePresence mode="wait">
        {game.buzzed_in_by ? (
          <motion.div
            key="buzzed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-lg bg-accent/15 border border-accent/40 p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-accent animate-pulse" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  First to Buzz
                </p>
                <p className="font-display text-2xl tracking-wider text-foreground">
                  {game.buzzed_in_name}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => awardPoint(1)}
                className="gap-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <CheckCircle className="w-3 h-3" /> +1 Correct
              </Button>
              <Button
                size="sm"
                onClick={() => awardPoint(5)}
                className="gap-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <CheckCircle className="w-3 h-3" /> +5 Correct
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearBuzz}
                className="gap-1 text-destructive border-destructive/30"
              >
                <XCircle className="w-3 h-3" /> Wrong / Clear
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-lg bg-muted/50 border border-border/50 p-4 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Waiting for buzz-in...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
