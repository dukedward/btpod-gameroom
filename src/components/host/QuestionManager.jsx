import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Send, Eye, Trash2 } from "lucide-react";
import { updateGame } from "../../api/game";
import { createQuestion } from "../../api/question";

export default function QuestionManager({ game, scores, onRefresh }) {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([
    { text: "", points: 0, revealed: false },
  ]);

  const handleSetQuestion = async () => {
    if (!question.trim()) return;
    await updateGame(game.id, {
      current_question: question,
      current_answers: answers.filter((a) => a.text.trim()),
      revealed_info: "",
    });
    toast.success("Question set!");
    onRefresh();
  };

  const handleRevealAnswer = async (index) => {
    const updated = [...(game.current_answers || [])];
    updated[index] = { ...updated[index], revealed: true };
    await updateGame(game.id, { current_answers: updated });
    toast.success("Answer revealed!");
    onRefresh();
  };

  const handleLogQuestion = async (answeredBy, pointsAwarded) => {
    await createQuestion({
      game_id: game.id,
      question: game.current_question,
      answer: game.current_answers
        ?.filter((a) => a.revealed)
        .map((a) => a.text)
        .join(", "),
      answered_by: answeredBy || "",
      points_awarded: pointsAwarded || 0,
      round: game.current_round || 1,
    });
    toast.success("Question logged!");
    onRefresh();
  };

  const addAnswer = () => {
    setAnswers([...answers, { text: "", points: 0, revealed: false }]);
  };

  const updateAnswer = (i, field, value) => {
    const updated = [...answers];
    updated[i] = {
      ...updated[i],
      [field]: field === "points" ? Number(value) : value,
    };
    setAnswers(updated);
  };

  const removeAnswer = (i) => {
    setAnswers(answers.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl tracking-wider text-foreground mb-3">
          Set Question
        </h2>
        <div className="rounded-xl bg-card border border-border/50 p-5 space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Question</Label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the question..."
              className="bg-muted border-border/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Answers (optional)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={addAnswer}
                className="gap-1 text-primary"
              >
                <Plus className="w-3 h-3" /> Add
              </Button>
            </div>
            {answers.map((ans, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={ans.text}
                  onChange={(e) => updateAnswer(i, "text", e.target.value)}
                  placeholder={`Answer ${i + 1}`}
                  className="flex-1 bg-muted border-border/50 text-foreground placeholder:text-muted-foreground"
                />
                <Input
                  type="number"
                  value={ans.points}
                  onChange={(e) => updateAnswer(i, "points", e.target.value)}
                  placeholder="Pts"
                  className="w-20 bg-muted border-border/50 text-foreground"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAnswer(i)}
                  className="text-destructive shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            onClick={handleSetQuestion}
            className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="w-4 h-4" /> Set Question
          </Button>
        </div>
      </div>

      {/* Current Question Controls */}
      {game?.current_question && (
        <div>
          <h2 className="font-display text-xl tracking-wider text-foreground mb-3">
            Current Question Controls
          </h2>
          <div className="rounded-xl bg-card border border-border/50 p-5 space-y-4">
            <p className="text-sm text-foreground font-medium">
              {game.current_question}
            </p>

            {game.current_answers?.map((ans, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-muted p-3"
              >
                <span className="text-sm text-foreground">
                  {ans.revealed ? ans.text : `Answer ${i + 1} (Hidden)`}
                </span>
                {!ans.revealed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevealAnswer(i)}
                    className="gap-1"
                  >
                    <Eye className="w-3 h-3" /> Reveal
                  </Button>
                )}
              </div>
            ))}

            <div className="flex flex-wrap gap-2">
              {scores.map((s) => (
                <Button
                  key={s.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleLogQuestion(s.player_name, 0)}
                  className="text-xs"
                >
                  Log for {s.player_name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
