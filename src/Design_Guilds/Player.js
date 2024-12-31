import React, {useEffect, useState } from 'react';

const Player = () => {
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        clazz: '',
        speciality: '',
        persuasionLevel: ''
    });
    const pageSize = 2;

    useEffect(() => {
        fetchPlayers(0);
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingPlayer
                ? `http://localhost:8080/Tavern/players/${editingPlayer.id}`
                : 'http://localhost:8080/Tavern/players';

            await fetch(url, {
                method: editingPlayer ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            setShowForm(false);
            setEditingPlayer(null);
            setFormData({
                name: '',
                clazz: '',
                speciality: '',
                persuasionLevel: ''
            });
            fetchPlayers(currentPage);
        } catch (err) {
            setError(editingPlayer ? 'F update player' : 'F  create player');
        }
    };

    const startEdit = (player) => {
        setEditingPlayer(player);
        setFormData({
            name: player.name,
            clazz: player.clazz,
            speciality: player.speciality,
            persuasionLevel: player.persuasionLevel
        });
        setShowForm(true);
    };

    const handleDelete = async (playerId) => {
        try {
            await fetch(`http://localhost:8080/Tavern/players/${playerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchPlayers(0);
        } catch (err) {
            setError('Failed to delete player');
        }
    };

    return (
        <div>
            <h1>Players Directory</h1>
            <button onClick={() => fetchPlayers(0)}>Load Players</button>
            <button onClick={() => {
                setShowForm(!showForm);
                setEditingPlayer(null);
                setFormData({
                    name: '',
                    clazz: '',
                    speciality: '',
                    persuasionLevel: ''
                });
            }}>{showForm ? 'Cancel' : 'Create Player'}</button>
            {error && <p>{error}</p>}

            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Class"
                            value={formData.clazz}
                            onChange={(e) => setFormData({...formData, clazz: e.target.value})}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Speciality"
                            value={formData.speciality}
                            onChange={(e) => setFormData({...formData, speciality: e.target.value})}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Persuasion Level"
                            value={formData.persuasionLevel}
                            onChange={(e) => setFormData({...formData, persuasionLevel: e.target.value})}
                        />
                    </div>
                    <button type="submit">{editingPlayer ? 'Update' : 'Submit'}</button>
                </form>
            )}

            {!selectedPlayer && (
                <div>
                    <div>
                        {players.map(player => (
                            <div key={player.id}>
                                <p><strong>{player.name}</strong></p>
                                <p>Class: {player.clazz}</p>
                                <p>Specialty: {player.speciality}</p>
                                <p>Persuasion: {player.persuasionLevel}</p>
                                <button onClick={() => fetchPlayerDetails(player.id)}>Details</button>
                                <button onClick={() => {
                                    startEdit(player);
                                    setShowForm(!showForm);
                                }}
                                >Edit</button>
                                <button onClick={() => handleDelete(player.id)}>Delete</button>
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
                                <p>Player ID: {claim.playerID}</p>
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