import React from 'react';

export interface Game {
    game_id: number;
    name: string;
}

interface GameFilterProps {
    games: Game[];
    selectedGameId: number | null;
    onSelectGame: (gameId: number | null) => void;
}

export default function GameFilter({ games, selectedGameId, onSelectGame }: GameFilterProps) {
    return (
        <div className="flex flex-wrap items-center gap-2.5">
            <button
                type="button"
                onClick={() => onSelectGame(null)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center border ${
                    selectedGameId === null
                        ? 'bg-dropbox-accent text-white border-dropbox-accent shadow-md shadow-blue-900/40'
                        : 'bg-[#111726] text-dropbox-muted border-dropbox-border hover:border-dropbox-accent/50 hover:text-white'
                }`}
            >
                Semua Game
            </button>

            {games.map((game) => (
                <button
                    type="button"
                    key={game.game_id}
                    onClick={() => onSelectGame(game.game_id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center border ${
                        selectedGameId === game.game_id
                            ? 'bg-dropbox-accent text-white border-dropbox-accent shadow-md shadow-blue-900/40'
                            : 'bg-[#111726] text-dropbox-muted border-dropbox-border hover:border-dropbox-accent/50 hover:text-white'
                    }`}
                >
                    {game.name}
                </button>
            ))}
        </div>
    );
}