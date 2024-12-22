import React, { useState } from 'react';

function Player() {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [error, setError] = useState('');

    const fetchPlayers = async () => {
        try {
            const response = await fetch('http://localhost:8080/Tavern/players/getAll');
            if (!response.ok) throw new Error('Failed to fetch players');
            const data = await response.json();
            setPlayers(data);
            setSelectedPlayer(null);
            setError('');
        } catch (err) {
            setError('Could not load players. Please try again.');
        }
    };

    const fetchPlayerDetails = async (playerId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Please log in to view player details.');
            const response = await fetch(`http://localhost:8080/Tavern/players/relations/${playerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error(response.status === 403 ? 'Access denied.' : 'Failed to fetch player details.');
            const data = await response.json();
            setSelectedPlayer(data);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-layout">
            <h1>Players Dashboard</h1>
            <button onClick={fetchPlayers}>Load Players</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!selectedPlayer && (
                <ul>
                    {players.map((player) => (
                        <li key={player.id}>
                            <strong>{player.name}</strong> - {player.clazz} ({player.speciality}), Persuasion Level: {player.persuasionLevel}
                            <button onClick={() => fetchPlayerDetails(player.id)}>Details</button>
                        </li>
                    ))}
                </ul>
            )}
            {selectedPlayer && (
                <div>
                    <h2>{selectedPlayer.name}</h2>
                    <p>Class: {selectedPlayer.clazz}</p>
                    <p>Speciality: {selectedPlayer.speciality}</p>
                    <p>Persuasion Level: {selectedPlayer.persuasionLevel}</p>
                    <h3>Bounty Claims</h3>
                    {selectedPlayer.bountyClaims?.length ? (
                        <ul>
                            {selectedPlayer.bountyClaims.map((claim) => (
                                <li key={claim.claimID}>
                                    <p>Claim Date: {claim.claimDate}</p>
                                    <p>Finish Date: {claim.finishDate}</p>
                                    <p>Bounty ID: {claim.bountyID}</p>
                                    <p>Player ID: {claim.playerID}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No active bounty claims</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Player;
