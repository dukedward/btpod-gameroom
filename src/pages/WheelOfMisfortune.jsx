import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

const MISFORTUNES = [
  "Take a shot",
  "Spin again",
  "Sing an R&B song",
  "Read your last text out loud",
  "Pass your spin",
  "Call someone and say something random",
  "Chat decides",
];
// const MISFORTUNES = [
//   "Sing the next question as an opera",
//   "Do 10 push-ups right now",
//   "Speak in an accent for the next round",
//   "Give 50 points to the leader",
//   "Skip your next turn",
//   "Answer the next question standing on one foot",
//   "Let the host mute you for 60 seconds",
//   "Lose 25 points",
//   "Wear something embarrassing on your head",
//   "Do your best impression of another player",
// ];

const COLORS = [
  "#9333ea",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#22c55e",
  "#8b5cf6",
  "#0ea5e9",
  "#f97316",
  "#ec4899",
  "#10b981",
];

const NUM = MISFORTUNES.length;
const SLICE_ANGLE = 360 / NUM;

export default function WheelOfMisfortune() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const totalRotation = useRef(0);

  const spin = () => {
    if (spinning) return;
    setResult(null);
    setSpinning(true);

    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5-9 full rotations
    const landingSlice = Math.floor(Math.random() * NUM);
    // We want the pointer (top, 270deg) to land in the middle of the chosen slice
    const targetAngle = 360 - (landingSlice * SLICE_ANGLE + SLICE_ANGLE / 2);
    const newRotation =
      totalRotation.current +
      extraSpins * 360 +
      ((targetAngle - (totalRotation.current % 360) + 360) % 360);

    totalRotation.current = newRotation;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(MISFORTUNES[landingSlice]);
    }, 4000);
  };

  const reset = () => {
    setResult(null);
  };

  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;

  const slices = MISFORTUNES.map((label, i) => {
    const startAngle = i * SLICE_ANGLE - 90;
    const endAngle = startAngle + SLICE_ANGLE;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const midAngle = startAngle + SLICE_ANGLE / 2;
    const textR = r * 0.65;
    const tx = cx + textR * Math.cos(toRad(midAngle));
    const ty = cy + textR * Math.sin(toRad(midAngle));
    const textAngle = midAngle + 90;
    const shortLabel = i + 1;
    // const shortLabel = label.length > 18 ? label.slice(0, 16) + "…" : label;

    return (
      <g key={i}>
        <path
          d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
          fill={COLORS[i]}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="1.5"
        />
        <text
          x={tx}
          y={ty}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${textAngle}, ${tx}, ${ty})`}
          fill="white"
          fontSize="9.5"
          fontWeight="bold"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {shortLabel}
        </text>
      </g>
    );
  });

  return (
    <div className="min-h-screen flex flex-col items-center pb-12">
      {/* Header */}
      <div className="w-full max-w-xl px-4 pt-6 pb-2 flex items-center gap-3">
        <Link to="/game-room">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl tracking-wider text-foreground">
            Wheel of Misfortune
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Spin to reveal your fate
          </p>
        </div>
      </div>

      {/* Wheel */}
      <div className="relative flex items-center justify-center mt-4">
        {/* Pointer */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
          style={{ marginTop: -4 }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderTop: "28px solid hsl(var(--accent))",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
            }}
          />
        </div>

        <motion.svg
          width={size}
          height={size}
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.2, 1, 0.3, 1] }}
          style={{
            borderRadius: "50%",
            boxShadow: "0 0 40px rgba(147,51,234,0.3)",
          }}
        >
          {slices}
          <circle
            cx={cx}
            cy={cy}
            r={18}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="3"
          />
          <circle cx={cx} cy={cy} r={7} fill="hsl(var(--accent))" />
        </motion.svg>
      </div>

      {/* Result */}
      <div className="mt-6 w-full max-w-sm px-4 text-center min-h-20">
        {result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-linear-to-br from-primary/20 via-card to-secondary/10 border border-primary/40 p-5"
          >
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
              Your Misfortune
            </p>
            <p className="font-display text-2xl tracking-wide text-foreground">
              {result}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 gap-2 text-muted-foreground"
              onClick={reset}
            >
              <RotateCcw className="w-3 h-3" /> Spin Again
            </Button>
          </motion.div>
        ) : (
          !spinning && (
            <p className="text-muted-foreground text-sm">
              Press spin to reveal a misfortune
            </p>
          )
        )}
      </div>

      {/* Spin Button */}
      <div className="mt-6">
        <Button
          onClick={spin}
          disabled={spinning}
          size="lg"
          className="px-12 font-display text-xl tracking-widest shadow-lg shadow-primary/30"
        >
          {spinning ? "Spinning..." : "SPIN"}
        </Button>
      </div>
    </div>
  );
}
