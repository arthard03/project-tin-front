import React, { useState } from 'react';

const Player = () => {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 2;

    const fetchPlayers = async (page = 0) => {
        try {
            const response = await fetch(`http://localhost:8080/Tavern/players/getAll?page=${page}&size=${pageSize}`);
            const data = await response.json();
            setPlayers(data.content);
            setTotalPages(data.totalPages);
            setCurrentPage(page);
            setSelectedPlayer(null);
            setError('');
        } catch (err) {
            setError('Failed to load players');
        }
    };

    const fetchPlayerDetails = async (playerId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Please log in');

            const response = await fetch(`http://localhost:8080/Tavern/players/relations/${playerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await response.json();
            setSelectedPlayer(data);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Players Directory</h1>
            <button onClick={() => fetchPlayers(0)}>Load Players</button>
            {error && <p>{error}</p>}

            {!selectedPlayer && players.length > 0 && (
                <div>
                    <div>
                        {players.map(player => (
                            <div key={player.id}>
                                <h3>{player.name}</h3>
                                <p>Class: {player.clazz}</p>
                                <p>Specialty: {player.speciality}</p>
                                <p>Persuasion: {player.persuasionLevel}</p>
                                <button onClick={() => fetchPlayerDetails(player.id)}>Details</button>
                            </div>
                        ))}
                    </div>

                    <div>
                        <button onClick={() => fetchPlayers(0)} disabled={currentPage === 0}>First</button>
                        <button onClick={() => fetchPlayers(currentPage - 1)} disabled={currentPage === 0}>Previous</button>
                        <span>Page {currentPage + 1} of {totalPages}</span>
                        <button onClick={() => fetchPlayers(currentPage + 1)} disabled={currentPage === totalPages - 1}>Next</button>
                        <button onClick={() => fetchPlayers(totalPages - 1)} disabled={currentPage === totalPages - 1}>Last</button>
                    </div>
                </div>
            )}

            {selectedPlayer && (
                <div>
                    <h2>{selectedPlayer.name}</h2>
                    <p>Class: {selectedPlayer.clazz}</p>
                    <p>Specialty: {selectedPlayer.speciality}</p>
                    <p>Persuasion: {selectedPlayer.persuasionLevel}</p>

                    <h3>Bounty Claims</h3>
                    {selectedPlayer.bountyClaims?.length ? (
                        selectedPlayer.bountyClaims.map(claim => (
                            <div key={claim.claimID}>
                                <p>Claim Date: {claim.claimDate}</p>
                                <p>Finish Date: {claim.finishDate}</p>
                                <p>Bounty ID: {claim.bountyID}</p>
                            </div>
                        ))
                    ) : (
                        <p>No active bounty claims</p>
                    )}

                    <button onClick={() => setSelectedPlayer(null)}>Back to List</button>
                </div>
            )}
        </div>
    );
};

export default Player;