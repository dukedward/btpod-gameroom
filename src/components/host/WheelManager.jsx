import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  createMisfortune,
  listMisfortunes,
  deleteMisfortune,
  updateMisfortune,
} from "../../api/misfortune";

const DEFAULT_MISFORTUNES = [
  "Take a shot",
  "Spin again",
  "Sing an R&B song",
  "Read your last text out loud",
  "Pass your spin",
  "Call someone and say something random",
  "Chat decides",
];

export default function WheelManager() {
  const [misfortunes, setMisfortunes] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const items = await listMisfortunes("order", 50);
    if (items.length === 0) {
      // Seed defaults
      const created = await createMisfortune(
        DEFAULT_MISFORTUNES.map((label, i) => ({ label, order: i })),
      );
      setMisfortunes(created);
    } else {
      setMisfortunes(items);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!newLabel.trim()) return;
    const item = await createMisfortune({
      label: newLabel.trim(),
      order: misfortunes.length,
    });
    setMisfortunes((prev) => [...prev, item]);
    setNewLabel("");
    toast.success("Misfortune added!");
  };

  const handleDelete = async (id) => {
    await deleteMisfortune(id);
    setMisfortunes((prev) => prev.filter((m) => m.id !== id));
    toast.success("Removed");
  };

  const handleEdit = async (id, label) => {
    await updateMisfortune(id, { label });
    setMisfortunes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, label } : m)),
    );
  };

  if (loading)
    return (
      <div className="py-8 text-center text-muted-foreground text-sm">
        Loading...
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="New misfortune..."
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="bg-muted border-border/50"
        />
        <Button onClick={handleAdd} size="icon" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {misfortunes.map((m, i) => (
          <div
            key={m.id}
            className="flex items-center gap-2 rounded-lg bg-card border border-border/50 p-3"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="w-6 text-xs text-muted-foreground font-mono">
              {i + 1}
            </span>
            <Input
              defaultValue={m.label}
              onBlur={(e) => handleEdit(m.id, e.target.value)}
              className="flex-1 bg-muted border-border/50 text-sm h-8"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDelete(m.id)}
              className="shrink-0 h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      {misfortunes.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          No misfortunes yet. Add some above!
        </p>
      )}
    </div>
  );
}
