import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Monitor, RefreshCw, Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScoreBoard from "../components/ScoreBoard";
import QuestionDisplay from "../components/QuestionDisplay";
import { filterGames } from "../api/game";
import { filterScores } from "../api/score";
import { filterQuestions } from "../api/question";

const GAME_ICONS = {
  "Basement Feud": "🏠",
  "Culture Tags": "🏷️",
  "Finish the Lyric": "🎵",
  Jeopardy: "❓",
  "Who Wants to be a Millionaire": "💰",
  "25 Words or Less": "💬",
};

export default function PublicScoreboard() {
  const [game, setGame] = useState(null);
  const [scores, setScores] = useState([]);
  const [questionLog, setQuestionLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);

  const loadData = async () => {
    const games = await filterGames({ status: "active" }, "-updated_date", 1);
    const activeGame = games[0] || null;
    setGame(activeGame);

    if (activeGame) {
      const [sc, ql] = await Promise.all([
        filterScores({ game_id: activeGame.id }),
        filterQuestions({ game_id: activeGame.id }, "-created_date", 20),
      ]);
      setScores(sc);
      setQuestionLog(ql);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // useEffect(() => {
  //   const unsubGame = base44.entities.Game.subscribe(() => loadData());
  //   const unsubScore = base44.entities.Score.subscribe(() => loadData());
  //   const unsubQL = base44.entities.QuestionLog.subscribe(() => loadData());
  //   return () => {
  //     unsubGame();
  //     unsubScore();
  //     unsubQL();
  //   };
  // }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Monitor className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="font-display text-2xl tracking-wider text-foreground mb-2">
          No Active Game
        </h2>
        <p className="text-muted-foreground mb-6">
          Check back when a game is live!
        </p>
        <Button variant="outline" onClick={loadData} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>
    );
  }

  const turnPlayer = scores.find((s) => s.player_email === game.current_turn);

  return (
    <div className="pb-24 md:pb-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{GAME_ICONS[game.title]}</span>
          <div>
            <h1 className="font-display text-2xl md:text-3xl tracking-wider text-foreground">
              {game.title}
            </h1>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
              <span className="text-xs uppercase tracking-widest text-accent font-semibold">
                Live — Round {game.current_round || 1}
              </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={loadData}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </motion.div>

      {/* Current Turn */}
      {turnPlayer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl bg-primary/10 border border-primary/30 p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {turnPlayer.player_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold">
              Current Turn
            </p>
            <p className="font-medium text-foreground">
              {turnPlayer.player_name}
            </p>
          </div>
        </motion.div>
      )}

      {/* Question */}
      <QuestionDisplay game={game} />

      {/* Scores */}
      <div>
        <h2 className="font-display text-xl tracking-wider text-foreground mb-3">
          Scoreboard
        </h2>
        <ScoreBoard scores={scores} currentTurnEmail={game.current_turn} />
      </div>

      {/* Question Log */}
      {questionLog.length > 0 && (
        <div>
          <h2 className="font-display text-xl tracking-wider text-foreground mb-3">
            Questions Asked
          </h2>
          <div className="space-y-2">
            {questionLog.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-lg bg-card border border-border/50 p-4"
              >
                <p className="text-sm font-medium text-foreground mb-1">
                  {q.question}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {q.answer && (
                    <span>
                      Answer: <span className="text-primary">{q.answer}</span>
                    </span>
                  )}
                  {q.answered_by && <span>By: {q.answered_by}</span>}
                  {q.points_awarded > 0 && (
                    <span className="text-accent">+{q.points_awarded} pts</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Branding */}
      <div className="text-center pt-4 border-t border-border/30">
        <div className="flex items-center justify-center gap-2">
          <Mic2 className="w-4 h-4 text-primary" />
          <span className="font-display text-sm tracking-wider text-muted-foreground">
            THE BASEMENT TALK PODCAST
          </span>
        </div>
      </div>
    </div>
  );
}
