import { useEffect, useMemo, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useActiveGame() {
  const [game, setGame] = useState(null);
  const [scores, setScores] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubScores = () => {};
    let unsubQuestions = () => {};

    setIsLoading(true);
    setError(null);

    const activeGameQuery = query(
      collection(db, "games"),
      where("status", "==", "active"),
      orderBy("updated_at", "desc"),
      limit(1),
    );

    const unsubGame = onSnapshot(
      activeGameQuery,
      (snapshot) => {
        unsubScores();
        unsubQuestions();

        if (snapshot.empty) {
          setGame(null);
          setScores([]);
          setQuestions([]);
          setIsLoading(false);
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

        unsubScores = onSnapshot(
          scoresQuery,
          (scoreSnap) => {
            setScores(
              scoreSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })),
            );
          },
          (err) => {
            console.error("Score subscription error:", err);
            setError(err);
          },
        );

        unsubQuestions = onSnapshot(
          questionsQuery,
          (questionSnap) => {
            setQuestions(
              questionSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })),
            );
            setIsLoading(false);
          },
          (err) => {
            console.error("Question subscription error:", err);
            setError(err);
            setIsLoading(false);
          },
        );
      },
      (err) => {
        console.error("Game subscription error:", err);
        setError(err);
        setIsLoading(false);
      },
    );

    return () => {
      unsubGame();
      unsubScores();
      unsubQuestions();
    };
  }, []);

  const derived = useMemo(() => {
    const totalScore = scores.reduce(
      (sum, score) => sum + Number(score.points_awarded || 0),
      0,
    );

    const scoresByPlayer = scores.reduce((acc, score) => {
      const key = score.player_email || score.player_name || "unknown";
      const existing = acc[key] || {
        player_email: score.player_email || "",
        player_name: score.player_name || "Unknown",
        total_points: 0,
      };

      existing.total_points += Number(score.points_awarded || 0);
      acc[key] = existing;
      return acc;
    }, {});

    const leaderboard = Object.values(scoresByPlayer).sort(
      (a, b) => b.total_points - a.total_points,
    );

    return {
      totalScore,
      leaderboard,
      questionCount: questions.length,
    };
  }, [scores, questions]);

  return {
    game,
    scores,
    questions,
    isLoading,
    error,
    ...derived,
  };
}
