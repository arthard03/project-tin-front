import React, { useState } from 'react';

function Guilds() {
    const [guilds, setGuilds] = useState([]);
    const [selectedGuild, setSelectedGuild] = useState(null);
    const [error, setError] = useState('');

    const fetchGuilds = async () => {
        try {
            const response = await fetch('http://localhost:8080/Tavern/guilds/getAll');
            if (!response.ok) throw new Error('Failed to fetch guilds');
            const data = await response.json();
            setGuilds(data);
            setSelectedGuild(null);
            setError('');
        } catch (err) {
            setError('Could not load guilds. Please try again later.');
        }
    };

    const fetchGuildDetails = async (guildId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Please log in to view guild details.');

            const response = await fetch(`http://localhost:8080/Tavern/guilds/relations/${guildId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error(response.status === 403 ? 'Unauthorized access.' : 'Failed to fetch details.');

            const data = await response.json();
            setSelectedGuild(data);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Guilds Directory</h1>
            <button onClick={fetchGuilds}>Load Guilds</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!selectedGuild && (
                <ul>
                    {guilds.map((guild) => (
                        <li key={guild.guildID}>
                            <strong>{guild.name}</strong> - {guild.description} ({guild.members} members)
                            <button onClick={() => fetchGuildDetails(guild.guildID)}>Details</button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedGuild && (
                <div>
                    <h2><strong>Guild: </strong>{selectedGuild.name}</h2>
                    <p><strong>Description: </strong>{selectedGuild.description}</p>
                    <p><strong>Members: </strong>{selectedGuild.members}</p>

                    <h3>Bounties</h3>
                    {selectedGuild.bounty?.length ? (
                        <ul>
                            {selectedGuild.bounty.map((bounty) => (
                                <li key={bounty.bountyID}>
                                    <p><strong>Reward:</strong> {bounty.reward} gold</p>
                                    <p><strong>Description:</strong>{bounty.description}</p>
                                    <p><strong>Difficulty:</strong> {bounty.difficulty}</p>
                                    <p><strong>Status:</strong> {bounty.status}</p></li>
                            ))}
                        </ul>
                    ) : (
                        <p>No active bounties</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Guilds;
