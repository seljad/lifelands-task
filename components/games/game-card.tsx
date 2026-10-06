"use client";

import {memo} from "react";
import {formatNumber} from "@/lib/format.ts";
import {VENDOR_LABELS} from "@/lib/vendors.ts";
import type {Game} from "@/lib/types/game.ts";
import {FavoriteButton} from "./favorite-button.tsx";
import {GameImage} from "./game-image.tsx";
import {CARD_BODY_CLASS, CARD_CLASS, CARD_IMAGE_CLASS} from "./layout.ts";

type GameCardProps = {
    game: Game;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
    eagerImage: boolean;
};

const IMAGE_SIZES = "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

function Stat({label, value}: { label: string; value: string }) {
    return (
        <div className="flex flex-col items-center">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="text-sm font-semibold">{value}</dd>
        </div>
    );
}

export const GameCard = memo(function GameCard({
                                                   game,
                                                   isFavorite,
                                                   onToggleFavorite,
                                                   eagerImage,
                                               }: GameCardProps) {
    return (
        <li className={`${CARD_CLASS} group transition-shadow hover:shadow-lg`}>
            <div className={`${CARD_IMAGE_CLASS} overflow-hidden`}>
                <GameImage
                    src={game.imageUrl}
                    width={400}
                    height={250}
                    sizes={IMAGE_SIZES}
                    eager={eagerImage}
                />
                <FavoriteButton
                    title={game.title}
                    isFavorite={isFavorite}
                    onToggle={() => onToggleFavorite(game.id)}
                />
                <span
                    className="absolute inset-s-3 bottom-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
          کیفیت {formatNumber(game.quality)}
        </span>
            </div>
            <div className={CARD_BODY_CLASS}>
                <div className="min-w-0">
                    <h3 className="truncate text-base font-bold" dir="auto" title={game.title}>
                        {game.title}
                    </h3>
                    <p className="truncate text-sm text-muted" dir="auto">
                        {game.companyName === "" ? "سازنده نامشخص" : game.companyName}
                    </p>
                </div>
                <ul className="flex h-6 gap-1.5 overflow-hidden text-xs">
                    <li className="shrink-0 rounded-full bg-surface-muted px-2.5 py-0.5">
                        {game.category}
                    </li>
                    {game.vendors.map((vendor) => (
                        <li
                            key={vendor}
                            className="shrink-0 rounded-full border border-border px-2.5 py-0.5 text-muted"
                        >
                            {VENDOR_LABELS[vendor]}
                        </li>
                    ))}
                </ul>
                <dl className="grid grid-cols-3 border-t border-border pt-2">
                    <Stat label="امتیاز" value={game.score > 0 ? formatNumber(game.score) : "—"}/>
                    <Stat label="پسند" value={formatNumber(game.like)}/>
                    <Stat label="اجرا" value={formatNumber(game.runCount)}/>
                </dl>
            </div>
        </li>
    );
});
