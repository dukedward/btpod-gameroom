import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Minus, ArrowRight, UserPlus } from "lucide-react";
import { createScore, updateScore, deleteScore } from "../../api/score";
import { updateGame } from "../../api/game";

export default function ScoreManager({ game, scores, onRefresh }) {
  const [newPlayerEmail, setNewPlayerEmail] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [customPoints, setCustomPoints] = useState({});

  const handleAddPlayer = async () => {
    if (!newPlayerEmail.trim() || !newPlayerName.trim()) return;
    await createScore({
      game_id: game.id,
      player_email: newPlayerEmail.trim(),
      player_name: newPlayerName.trim(),
      points: 0,
    });
    setNewPlayerEmail("");
    setNewPlayerName("");
    toast.success("Player added!");
    onRefresh();
  };

  const handleUpdateScore = async (scoreId, currentPoints, delta) => {
    await updateScore(scoreId, {
      points: Math.max(0, currentPoints + delta),
    });
    onRefresh();
  };

  const handleSetScore = async (scoreId) => {
    const pts = customPoints[scoreId];
    if (pts === undefined || pts === "") return;
    await updateScore(scoreId, { points: Number(pts) });
    setCustomPoints((p) => ({ ...p, [scoreId]: "" }));
    toast.success("Score updated!");
    onRefresh();
  };

  const handleSetTurn = async (playerEmail) => {
    await updateGame(game.id, { current_turn: playerEmail });
    toast.success("Turn updated!");
    onRefresh();
  };

  const handleRemovePlayer = async (scoreId) => {
    await deleteScore(scoreId);
    toast.success("Player removed");
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl tracking-wider text-foreground mb-3">
          Players & Scores
        </h2>

        {/* Add Player */}
        <div className="rounded-xl bg-card border border-border/50 p-5 mb-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Add Player</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Player name"
              className="flex-1 bg-muted border-border/50 text-foreground placeholder:text-muted-foreground"
            />
            <Input
              value={newPlayerEmail}
              onChange={(e) => setNewPlayerEmail(e.target.value)}
              placeholder="Player email"
              className="flex-1 bg-muted border-border/50 text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleAddPlayer}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
            >
              <UserPlus className="w-4 h-4" /> Add
            </Button>
          </div>
        </div>

        {/* Score Cards */}
        <div className="space-y-3">
          {scores.map((score) => (
            <div
              key={score.id}
              className={`rounded-xl border p-4 ${
                game.current_turn === score.player_email
                  ? "bg-primary/10 border-primary/40"
                  : "bg-card border-border/50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">
                    {score.player_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {score.player_email}
                  </p>
                </div>
                <p className="font-display text-3xl tracking-wider text-foreground">
                  {score.points || 0}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateScore(score.id, score.points, -10)}
                  className="gap-1"
                >
                  <Minus className="w-3 h-3" /> 10
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateScore(score.id, score.points, -5)}
                  className="gap-1"
                >
                  <Minus className="w-3 h-3" /> 5
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateScore(score.id, score.points, 5)}
                  className="gap-1"
                >
                  <Plus className="w-3 h-3" /> 5
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateScore(score.id, score.points, 10)}
                  className="gap-1"
                >
                  <Plus className="w-3 h-3" /> 10
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateScore(score.id, score.points, 25)}
                  className="gap-1"
                >
                  <Plus className="w-3 h-3" /> 25
                </Button>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={customPoints[score.id] || ""}
                    onChange={(e) =>
                      setCustomPoints((p) => ({
                        ...p,
                        [score.id]: e.target.value,
                      }))
                    }
                    placeholder="Set"
                    className="w-20 h-8 bg-muted border-border/50 text-foreground text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetScore(score.id)}
                  >
                    Set
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button
                  size="sm"
                  variant={
                    game.current_turn === score.player_email
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleSetTurn(score.player_email)}
                  className="gap-1"
                >
                  <ArrowRight className="w-3 h-3" /> Set Turn
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemovePlayer(score.id)}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
