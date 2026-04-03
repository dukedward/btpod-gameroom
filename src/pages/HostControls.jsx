import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Play, Pause, StopCircle, Settings, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameSelector from "../components/host/GameSelector";
import ScoreManager from "../components/host/ScoreManager";
import QuestionManager from "../components/host/QuestionManager";
import BuzzInPanel from "../components/host/BuzzInPanel";
import WheelManager from "../components/host/WheelManager";
import CultureTagsManager from "../components/host/CultureTagsManager";
import { CultureTagsHostView } from "../components/CultureTagsBoard";
import { createGame, filterGames, updateGame } from "../api/game";
import { filterScores } from "../api/score";

export default function HostControls() {
  const { profile } = useAuth();
  const [game, setGame] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const games = await filterGames({ status: "active" }, "-updated_date", 1);
    let pausedGames = [];
    if (!games.length) {
      pausedGames = await filterGames({ status: "paused" }, "-updated_date", 1);
    }
    const activeGame = games[0] || pausedGames[0] || null;
    setGame(activeGame);

    if (activeGame) {
      const sc = await filterScores({ game_id: activeGame.id });
      setScores(sc);
    } else {
      setScores([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartGame = async (title) => {
    const activeGames = await filterGames({ status: "active" });
    for (const g of activeGames) {
      await updateGame(g.id, { status: "finished" });
    }
    const pausedGames = await filterGames({ status: "paused" });
    for (const g of pausedGames) {
      await updateGame(g.id, { status: "finished" });
    }

    await createGame({
      title,
      status: "active",
      current_round: 1,
    });
    toast.success(`${title} started!`);
    loadData();
  };

  const handlePause = async () => {
    if (!game) return;
    await updateGame(game.id, { status: "paused" });
    toast.success("Game paused");
    loadData();
  };

  const handleResume = async () => {
    if (!game) return;
    await updateGame(game.id, { status: "active" });
    toast.success("Game resumed");
    loadData();
  };

  const handleEndGame = async () => {
    if (!game) return;
    await updateGame(game.id, { status: "finished" });
    toast.success("Game ended");
    loadData();
  };

  const handleNextRound = async () => {
    if (!game) return;
    await updateGame(game.id, {
      current_round: (game.current_round || 1) + 1,
      current_question: "",
      current_answers: [],
      revealed_info: "",
      buzzed_in_by: "",
      buzzed_in_name: "",
      buzz_locked: false,
    });
    toast.success("Next round!");
    loadData();
  };

  const handleUpdateRevealedInfo = async (info) => {
    if (!game) return;
    await updateGame(game.id, { revealed_info: info });
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (profile?.role !== "host" && profile?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Settings className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="font-display text-2xl tracking-wider text-foreground mb-2">
          Host Only
        </h2>
        <p className="text-muted-foreground">
          Only the host can access these controls.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl tracking-wider text-foreground mb-1">
          Host Controls
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage games, scores, and questions
        </p>
      </motion.div>

      {/* Active Game Bar */}
      {game && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl bg-card border border-border/50 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-display text-xl tracking-wider text-foreground">
                {game.title}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                Status:{" "}
                <span
                  className={
                    game.status === "active" ? "text-accent" : "text-primary"
                  }
                >
                  {game.status}
                </span>
                {" · "}Round {game.current_round || 1}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {game.status === "paused" && (
              <Button
                size="sm"
                onClick={handleResume}
                className="gap-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Play className="w-3 h-3" /> Resume
              </Button>
            )}
            {game.status === "active" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handlePause}
                className="gap-1"
              >
                <Pause className="w-3 h-3" /> Pause
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleNextRound}
              className="gap-1"
            >
              <ChevronRight className="w-3 h-3" /> Next Round
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleEndGame}
              className="gap-1"
            >
              <StopCircle className="w-3 h-3" /> End Game
            </Button>
          </div>
          <div className="mt-3">
            <Input
              placeholder="Broadcast a message to viewers..."
              defaultValue={game.revealed_info || ""}
              onBlur={(e) => handleUpdateRevealedInfo(e.target.value)}
              className="bg-muted border-border/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <Tabs defaultValue={game ? "scores" : "games"} className="space-y-4">
        <TabsList className="bg-muted border border-border/50">
          <TabsTrigger
            value="games"
            className="rounded-md px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Games
          </TabsTrigger>
          <TabsTrigger
            value="scores"
            disabled={!game}
            className="rounded-md px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Scores
          </TabsTrigger>
          <TabsTrigger
            value="questions"
            disabled={!game}
            className="rounded-md px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Questions
          </TabsTrigger>
          <TabsTrigger
            value="wheel"
            className="rounded-md px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            🎡 Wheel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="games">
          <GameSelector
            activeGameTitle={game?.title}
            onSelect={handleStartGame}
          />
        </TabsContent>

        <TabsContent value="scores">
          {game && (
            <div className="space-y-4">
              <BuzzInPanel game={game} scores={scores} onRefresh={loadData} />
              <ScoreManager game={game} scores={scores} onRefresh={loadData} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="questions">
          {game && (
            <div className="space-y-4">
              {game.title === "Culture Tags" ? (
                <>
                  <CultureTagsHostView game={game} />
                  <CultureTagsManager
                    game={game}
                    scores={scores}
                    onRefresh={loadData}
                  />
                </>
              ) : (
                <QuestionManager
                  game={game}
                  scores={scores}
                  onRefresh={loadData}
                />
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="wheel">
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Edit the 10 misfortunes shown on the Wheel of Misfortune
            </p>
            <WheelManager />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
