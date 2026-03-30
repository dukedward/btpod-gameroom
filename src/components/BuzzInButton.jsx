import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { updateGame } from "../api/game";

export default function BuzzInButton({ game, user }) {
  const [pressing, setPressing] = useState(false);

  if (!game || !user) return null;

  const isBuzzed = !!game.buzzed_in_by;
  const iMeBuzzed = game.buzzed_in_by === user.email;
  const isLocked = game.buzz_locked && !iMeBuzzed;

  const handleBuzz = async () => {
    if (isBuzzed || isLocked) return;
    setPressing(true);
    await updateGame(game.id, {
      buzzed_in_by: user.email,
      buzzed_in_name: user.display_name || user.full_name,
      buzz_locked: true,
    });
    toast.success("You buzzed in!");
    setPressing(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <AnimatePresence>
        {iMeBuzzed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <span className="text-xs uppercase tracking-widest font-semibold text-accent">
              🎉 You're In! Wait for the host...
            </span>
          </motion.div>
        )}
        {isBuzzed && !iMeBuzzed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-xs uppercase tracking-widest font-semibold text-destructive">
              {game.buzzed_in_name} buzzed in first!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: isBuzzed ? 1 : 0.9 }}
        whileHover={{ scale: isBuzzed ? 1 : 1.05 }}
        onClick={handleBuzz}
        disabled={isBuzzed || pressing}
        className={`relative w-36 h-36 rounded-full border-4 text-white font-display text-2xl tracking-wider flex flex-col items-center justify-center gap-2 shadow-2xl transition-all select-none ${
          iMeBuzzed
            ? "bg-accent border-accent/60 text-accent-foreground shadow-accent/40"
            : isBuzzed
              ? "bg-muted border-border/50 text-muted-foreground opacity-50 cursor-not-allowed"
              : "bg-primary border-primary/60 shadow-primary/40 cursor-pointer active:shadow-none"
        }`}
      >
        <Zap
          className={`w-8 h-8 ${iMeBuzzed ? "text-accent-foreground" : "text-primary-foreground"}`}
        />
        <span
          className={
            iMeBuzzed ? "text-accent-foreground" : "text-primary-foreground"
          }
        >
          {iMeBuzzed ? "BUZZED!" : isBuzzed ? "LOCKED" : "BUZZ IN"}
        </span>
      </motion.button>
    </div>
  );
}
