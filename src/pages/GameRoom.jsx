import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gamepad2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScoreBoard from "../components/ScoreBoard";
import QuestionDisplay from "../components/QuestionDisplay";
import BuzzInButton from "../components/BuzzInButton";
import { CultureTagsContestantView } from "../components/CultureTagsBoard";
import { filterGames, updateGame } from "../api/game";
import { useAuth } from "../lib/AuthContext";
import { filterScores } from "../api/score";
import { filterQuestions } from "../api/question";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const GAME_ICONS = {
  "Basement Feud": "🏠",
  "Culture Tags": "🏷️",
  "Finish the Lyric": "🎵",
  Jeopardy: "❓",
  "Who Wants to be a Millionaire": "💰",
  "25 Words or Less": "💬",
};

export default function GameRoom() {
  const [game, setGame] = useState(null);
  const [scores, setScores] = useState([]);
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [games] = await Promise.all([
      filterGames({ status: "active" }, "-updated_date", 1),
      user,
    ]);
    const activeGame = games[0] || null;
    setGame(activeGame);
    user;

    if (activeGame) {
      const [sc, ql] = await Promise.all([
        filterScores({ game_id: activeGame.id }),
        filterQuestions({ game_id: activeGame.id }, "-created_date", 20),
      ]);
      setScores(sc);
      setQuestions(ql);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChooseCategory = async (cat) => {
    if (!game) return;
    await updateGame(game.id, { culture_tags_category: cat });
    loadData();
  };

  // Subscribe to real-time updates
  useEffect(() => {
    let unsubScores = () => {};
    let unsubQuestions = () => {};

    const activeGameQuery = query(
      collection(db, "games"),
      where("status", "==", "active"),
      orderBy("updated_at", "desc"),
      limit(1),
    );

    const unsubGame = onSnapshot(activeGameQuery, (snapshot) => {
      // clean up old listeners when active game changes
      unsubScores();
      unsubQuestions();

      if (snapshot.empty) {
        setGame(null);
        setScores([]);
        setQuestions([]);
        return;
      }

      const gameDoc = snapshot.docs[0];
      const activeGame = {
        id: gameDoc.id,
        ...gameDoc.data(),
      };

      setGame(activeGame);

      const scoresQuery = query(
        collection(db, "scores"),
        where("game_id", "==", gameDoc.id),
        orderBy("created_at", "asc"),
      );

      const questionsQuery = query(
        collection(db, "questions"),
        where("game_id", "==", gameDoc.id),
        orderBy("created_at", "asc"),
      );

      unsubScores = onSnapshot(scoresQuery, (scoreSnap) => {
        setScores(
          scoreSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        );
      });

      unsubQuestions = onSnapshot(questionsQuery, (questionSnap) => {
        setQuestions(
          questionSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        );
      });
    });

    return () => {
      unsubGame();
      unsubScores();
      unsubQuestions();
    };
  }, []);

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
        <Gamepad2 className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="font-display text-2xl tracking-wider text-foreground mb-2">
          No Active Game
        </h2>
        <p className="text-muted-foreground mb-6">
          Waiting for the host to start a game...
        </p>
        <Button variant="outline" onClick={loadData} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>
    );
  }

  const myScore = scores.find((s) => s.player_email === user?.email);

  return (
    <div className="pb-24 md:pb-8 space-y-6">
      {/* Game Header */}
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
                Round {game.current_round || 1} — Live
              </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={loadData}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </motion.div>

      {/* My Score Card (for contestants) */}
      {myScore && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-secondary/10 border border-secondary/30 p-5 flex items-center justify-between"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-secondary font-semibold mb-1">
              Your Score
            </p>
            <p className="font-display text-4xl tracking-wider text-foreground">
              {myScore.points || 0}
            </p>
          </div>
          {game.current_turn === user?.email && (
            <div className="bg-primary/15 border border-primary/40 rounded-lg px-4 py-2">
              <p className="text-sm font-semibold text-primary">
                It's Your Turn!
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Culture Tags Special View */}
      {game.title === "Culture Tags" ? (
        <CultureTagsContestantView
          game={game}
          isChooser={
            game.culture_tags_chooser === user?.email &&
            !game.culture_tags_category
          }
          onChooseCategory={handleChooseCategory}
        />
      ) : (
        <QuestionDisplay game={game} />
      )}

      {/* Wheel of Misfortune Link */}
      <Link to="/wheel" className="block">
        <div className="rounded-xl bg-linear-to-r from-destructive/20 to-primary/10 border border-destructive/30 p-4 flex items-center justify-between hover:border-destructive/60 transition-all">
          <div>
            <p className="font-display text-lg tracking-wider text-foreground">
              🎡 Wheel of Misfortune
            </p>
            <p className="text-xs text-muted-foreground">
              Spin to reveal a penalty for the loser
            </p>
          </div>
          <span className="text-2xl">→</span>
        </div>
      </Link>

      {/* Buzz-In Button */}
      <div className="flex justify-center py-4">
        <BuzzInButton game={game} user={user} />
      </div>

      {/* Scoreboard */}
      <div>
        <h2 className="font-display text-xl tracking-wider text-foreground mb-3">
          Scoreboard
        </h2>
        <ScoreBoard scores={scores} currentTurnEmail={game.current_turn} />
      </div>

      {/* Question History */}
      {questions.length > 0 && (
        <div>
          <h2 className="font-display text-xl tracking-wider text-foreground mb-3">
            Question History
          </h2>
          <div className="space-y-2">
            {questions.map((q, i) => (
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
    </div>
  );
}
