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
        <div className="flex flex-wrap gap-2.5">
            <button
                onClick={() => onSelectGame(null)}
                className={`px-5 py-2.5 rounded-full text-xs font-medium transition border ${
                    selectedGameId === null
                        ? 'bg-dropbox-accent text-white border-dropbox-accent shadow-xs'
                        : 'bg-white text-dropbox-text border-dropbox-border hover:bg-dropbox-secondary'
                }`}
            >
                Semua Game
            </button>

            {games.map((game) => (
                <button
                    key={game.game_id}
                    onClick={() => onSelectGame(game.game_id)}
                    className={`px-5 py-2.5 rounded-full text-xs font-medium transition border ${
                        selectedGameId === game.game_id
                            ? 'bg-dropbox-accent text-white border-dropbox-accent shadow-xs'
                            : 'bg-white text-dropbox-text border-dropbox-border hover:bg-dropbox-secondary'
                    }`}
                >
                    {game.name}
                </button>
            ))}
        </div>
    );
}