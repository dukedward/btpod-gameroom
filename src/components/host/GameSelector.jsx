import GameCard from "../GameCard";

const GAMES = [
  "Basement Feud",
  "Culture Tags",
  "Finish the Lyric",
  "Jeopardy",
  "Who Wants to be a Millionaire",
  "25 Words or Less",
];

export default function GameSelector({ activeGameTitle, onSelect }) {
  return (
    <div>
      <h2 className="font-display text-xl tracking-wider text-foreground mb-3">
        Select a Game
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {GAMES.map((name, i) => (
          <GameCard
            key={name}
            name={name}
            isActive={activeGameTitle === name}
            onClick={() => onSelect(name)}
            delay={i * 0.05}
          />
        ))}
      </div>
    </div>
  );
}
