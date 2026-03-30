import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import {
  Gamepad2,
  Monitor,
  Trophy,
  Users,
  Mic2,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { filterGames } from "../api/game";

const GAME_ICONS = {
  "Basement Feud": "🏠",
  "Culture Tags": "🏷️",
  "Finish the Lyric": "🎵",
  Jeopardy: "❓",
  "Who Wants to be a Millionaire": "💰",
  "25 Words or Less": "💬",
};

export default function Home() {
  const [activeGame, setActiveGame] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [games] = await Promise.all([
        filterGames({ status: "active" }, "-updated_date", 1),
        user,
      ]);
      setActiveGame(games[0] || null);
      user;
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/20 via-card to-secondary/10 border border-border/50 p-8 md:p-12"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Mic2 className="w-6 h-6 text-primary" />
            </div>
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">
              {activeGame ? "Live Now" : "Welcome"}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl tracking-wider text-foreground mb-3">
            THE BASEMENT TALK
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-6">
            Welcome to the game zone. Compete, watch, and have fun with your
            favorite podcast crew.
          </p>

          {activeGame ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/game-room">
                <Button
                  size="lg"
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  <Zap className="w-4 h-4" />
                  Join {activeGame.title}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/scoreboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-border/50"
                >
                  <Monitor className="w-4 h-4" />
                  Watch Live
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/profile">
                <Button
                  size="lg"
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Set Up Profile
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Active Game Banner */}
      {activeGame && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-accent/10 border border-accent/30 p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">{GAME_ICONS[activeGame.title]}</span>
            <div>
              <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-1">
                Now Playing
              </p>
              <p className="text-xl font-display tracking-wider text-foreground">
                {activeGame.title}
              </p>
              <p className="text-sm text-muted-foreground">
                Round {activeGame.current_round || 1}
              </p>
            </div>
          </div>
          <div className="h-3 w-3 rounded-full bg-accent animate-pulse-glow" />
        </motion.div>
      )}

      {/* Games Grid */}
      <div>
        <h2 className="font-display text-2xl tracking-wider text-foreground mb-4">
          Our Games
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(GAME_ICONS).map(([name, icon], i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`rounded-xl border p-5 transition-all ${
                activeGame?.title === name
                  ? "bg-primary/10 border-primary/40"
                  : "bg-card border-border/50 hover:border-primary/30"
              }`}
            >
              <span className="text-3xl mb-3 block">{icon}</span>
              <p className="font-display text-lg tracking-wider text-foreground">
                {name}
              </p>
              {activeGame?.title === name && (
                <span className="inline-block mt-2 text-[10px] uppercase tracking-widest text-primary font-semibold bg-primary/10 px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-card border border-border/50 p-5 text-center">
          <Gamepad2 className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="font-display text-2xl tracking-wider text-foreground">
            6
          </p>
          <p className="text-xs text-muted-foreground">Games</p>
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-5 text-center">
          <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
          <p className="font-display text-2xl tracking-wider text-foreground">
            Live
          </p>
          <p className="text-xs text-muted-foreground">Multiplayer</p>
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-5 text-center">
          <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
          <p className="font-display text-2xl tracking-wider text-foreground">
            Win
          </p>
          <p className="text-xs text-muted-foreground">Prizes</p>
        </div>
      </div>
    </div>
  );
}
