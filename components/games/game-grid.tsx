import { GameCard } from "./game-card.tsx";
import { GRID_CLASS } from "./layout.ts";
import type { Game } from "@/lib/types/game.ts";

const EAGER_IMAGE_COUNT = 4;

type GameGridProps = {
  games: readonly Game[];
  favorites: ReadonlySet<string>;
  onToggleFavorite: (id: string) => void;
};

export function GameGrid({ games, favorites, onToggleFavorite }: GameGridProps) {
  return (
    <ul className={GRID_CLASS}>
      {games.map((game, index) => (
        <GameCard
          key={game.id}
          game={game}
          isFavorite={favorites.has(game.id)}
          onToggleFavorite={onToggleFavorite}
          eagerImage={index < EAGER_IMAGE_COUNT}
        />
      ))}
    </ul>
  );
}
