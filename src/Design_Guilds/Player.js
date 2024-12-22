import React from 'react';

function Player() {
    const players = [
        { name: 'Player A', currentActivity: 'Claiming Reward 1' },
        { name: 'Player B', currentActivity: 'Exploring Dungeon' },
    ];

    return (
        <div className="page-layout">
            <div className="page-content">
                <h1>Players</h1>
                <ul>
                    {players.map((player, index) => (
                        <li key={index}>
                            <strong>{player.name}</strong>: {player.currentActivity}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="page-image">
                <img src="https://preview.redd.it/custom-class-concept-magefist-a-more-immersive-roleplay-v0-syb2s83a4a6a1.jpg?width=1000&format=pjpg&auto=webp&s=a6d9b497fc8f777f8721e67410aa603ef9610175"
                     alt="Guild Visual"/>
            </div>

        </div>
    );
}

export default Player;
