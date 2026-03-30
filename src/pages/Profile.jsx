import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Camera, Check, User } from "lucide-react";
import { motion } from "framer-motion";

const AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
];

export default function Profile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   base44.auth.me().then((me) => {
  //     setUser(me);
  //     setDisplayName(me.display_name || me.full_name || "");
  //     setSelectedAvatar(me.avatar_url || "");
  //     setLoading(false);
  //   });
  // }, []);

  // const handleSave = async () => {
  //   setSaving(true);
  //   await base44.auth.updateMe({
  //     display_name: displayName,
  //     avatar_url: selectedAvatar || customUrl,
  //   });
  //   toast.success("Profile updated!");
  //   setSaving(false);
  // };

  // const handleUpload = async (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   const { file_url } = await base44.integrations.Core.UploadFile({ file });
  //   setSelectedAvatar(file_url);
  //   setCustomUrl("");
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto pb-24 md:pb-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl tracking-wider text-foreground mb-1">
          Your Profile
        </h1>
        <p className="text-muted-foreground text-sm">
          Set up your game identity
        </p>
      </motion.div>

      {/* Current Avatar Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center"
      >
        <div className="relative group">
          <div className="w-28 h-28 rounded-full bg-muted border-4 border-primary/40 overflow-hidden">
            {selectedAvatar ? (
              <img
                src={selectedAvatar}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
            <Camera className="w-4 h-4 text-primary-foreground" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          {displayName || "Set your name below"}
        </p>
        <span className="text-xs text-primary capitalize mt-1 bg-primary/10 px-3 py-1 rounded-full">
          {user?.role || "viewer"}
        </span>
      </motion.div>

      {/* Name Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <Label className="text-foreground font-medium">Display Name</Label>
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your name..."
          className="bg-card border-border/50 h-12 text-foreground placeholder:text-muted-foreground"
        />
      </motion.div>

      {/* Avatar Picker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <Label className="text-foreground font-medium">Choose an Avatar</Label>
        <div className="grid grid-cols-4 gap-3">
          {AVATARS.map((url) => (
            <button
              key={url}
              onClick={() => {
                setSelectedAvatar(url);
                setCustomUrl("");
              }}
              className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                selectedAvatar === url
                  ? "border-primary scale-105 ring-2 ring-primary/30"
                  : "border-border/50 hover:border-primary/40"
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              {selectedAvatar === url && (
                <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          onClick={handleSave}
          disabled={saving || !displayName.trim()}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
        >
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </motion.div>
    </div>
  );
}
