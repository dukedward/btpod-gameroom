import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tag, Shuffle, Send } from "lucide-react";
import {
  CULTURE_TAGS_CATEGORIES,
  CULTURE_TAGS_PHRASES,
  generateAcronym,
} from "../../lib/cultureTags/cultureTags";
import { updateGame } from "../../api/game";

export default function CultureTagsManager({ game, scores, onRefresh }) {
  const [selectedCategory, setSelectedCategory] = useState(
    game?.culture_tags_category || "",
  );
  const [selectedPhrase, setSelectedPhrase] = useState(null);
  const [customPhrase, setCustomPhrase] = useState("");
  const [chooserEmail, setChooserEmail] = useState(
    game?.culture_tags_chooser || "",
  );

  const phrases = selectedCategory
    ? CULTURE_TAGS_PHRASES[selectedCategory] || []
    : [];

  const handleSetChooser = async () => {
    if (!chooserEmail) return;
    await updateGame(game.id, {
      culture_tags_chooser: chooserEmail,
      culture_tags_category: "",
      culture_tags_phrase: "",
      culture_tags_acronym: "",
    });
    toast.success("Chooser set!");
    onRefresh();
  };

  const handleSetCategory = async (cat) => {
    setSelectedCategory(cat);
    setSelectedPhrase(null);
    await updateGame(game.id, {
      culture_tags_category: cat,
      culture_tags_phrase: "",
      culture_tags_acronym: "",
    });
    onRefresh();
  };

  const handleSetPhrase = async (phraseObj) => {
    await updateGame(game.id, {
      culture_tags_phrase: phraseObj.phrase,
      culture_tags_acronym: phraseObj.acronym,
      current_question: phraseObj.acronym,
    });
    toast.success("Phrase set!");
    setSelectedPhrase(phraseObj);
    onRefresh();
  };

  const handleSetCustomPhrase = async () => {
    if (!customPhrase.trim()) return;
    const acronym = generateAcronym(customPhrase);
    await updateGame(game.id, {
      culture_tags_phrase: customPhrase,
      culture_tags_acronym: acronym,
      current_question: acronym,
    });
    toast.success("Custom phrase set!");
    setCustomPhrase("");
    onRefresh();
  };

  const handleRandomPhrase = async () => {
    if (!selectedCategory || !phrases.length) return;
    const random = phrases[Math.floor(Math.random() * phrases.length)];
    await handleSetPhrase(random);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <Tag className="w-4 h-4 text-secondary" />
        <h3 className="font-display text-lg tracking-wider text-foreground">
          Culture Tags Setup
        </h3>
      </div>

      {/* Set Chooser */}
      <div className="rounded-xl bg-card border border-border/50 p-4 space-y-3">
        <Label className="text-foreground text-sm font-medium">
          Category Chooser (1st Contestant)
        </Label>
        <div className="flex gap-2">
          <select
            value={chooserEmail}
            onChange={(e) => setChooserEmail(e.target.value)}
            className="flex-1 rounded-lg bg-muted border border-border/50 text-foreground text-sm px-3 py-2"
          >
            <option value="">Select player...</option>
            {scores.map((s) => (
              <option key={s.id} value={s.player_email}>
                {s.player_name}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={handleSetChooser}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            Set
          </Button>
        </div>
      </div>

      {/* Category Grid */}
      <div>
        <Label className="text-foreground text-sm font-medium mb-2 block">
          Category
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {CULTURE_TAGS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleSetCategory(cat)}
              className={`rounded-lg border p-3 text-left text-sm font-medium transition-all ${
                game?.culture_tags_category === cat || selectedCategory === cat
                  ? "bg-secondary/15 border-secondary/50 text-secondary"
                  : "bg-muted border-border/50 text-foreground hover:border-secondary/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Phrases */}
      {selectedCategory && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-foreground text-sm font-medium">
              Phrases — {selectedCategory}
            </Label>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRandomPhrase}
              className="gap-1 text-xs"
            >
              <Shuffle className="w-3 h-3" /> Random
            </Button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {phrases.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSetPhrase(p)}
                className={`w-full rounded-lg border p-3 text-left transition-all ${
                  game?.culture_tags_phrase === p.phrase
                    ? "bg-accent/15 border-accent/40"
                    : "bg-card border-border/50 hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-foreground font-medium">
                    {p.phrase}
                  </p>
                  <p className="font-display text-sm tracking-wider text-primary shrink-0">
                    {p.acronym}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Phrase */}
      <div className="rounded-xl bg-card border border-border/50 p-4 space-y-3">
        <Label className="text-foreground text-sm font-medium">
          Custom Phrase
        </Label>
        <div className="flex gap-2">
          <Input
            value={customPhrase}
            onChange={(e) => setCustomPhrase(e.target.value)}
            placeholder="Type a custom phrase..."
            className="flex-1 bg-muted border-border/50 text-foreground placeholder:text-muted-foreground"
          />
          <Button
            size="sm"
            onClick={handleSetCustomPhrase}
            className="gap-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="w-3 h-3" /> Set
          </Button>
        </div>
        {customPhrase && (
          <p className="text-xs text-muted-foreground">
            Acronym preview:{" "}
            <span className="text-primary font-bold">
              {generateAcronym(customPhrase)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
