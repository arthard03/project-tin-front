import React, { useState } from 'react';

function Guilds() {
    const [guilds, setGuilds] = useState([]);
    const [guildRelations, setGuildRelations] = useState(null);

    const showAllGuilds = async () => {
        try {
            const response = await fetch('http://localhost:8080/Tavern/guilds/getAll', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setGuilds(data);
                setGuildRelations(null);
            } else {
                console.error('Failed to fetch guilds:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching guilds:', error);
        }
    };

    const showGuildRelations = async (guildId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/Tavern/guilds/relations/${guildId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setGuildRelations(data);
            } else {
                console.error('Failed to fetch guild relations:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching guild relations:', error);
        }
    };

    return (
        <div>
            <h1>Guilds Directory</h1>
            <div>
                <button onClick={showAllGuilds}>Show All Guilds</button>
            </div>

            {guilds.length > 0 && !guildRelations && (
                <div>
                    <h2>All Guilds</h2>
                    <ul>
                        {guilds.map(guild => (
                            <li key={guild.guildID}>
                                <h3>{guild.name}</h3>
                                <p>{guild.description}</p>
                                <p>Members: {guild.members}</p>
                                <button onClick={() => showGuildRelations(guild.guildID)}>
                                    Show Relations
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {guildRelations && (
                <div>
                    <h2>{guildRelations.name} Details</h2>
                    <div>
                        <p>{guildRelations.description}</p>
                        <p>Members: {guildRelations.members}</p>

                        <h3>Bounties</h3>
                        {guildRelations.bounty?.length > 0 ? (
                            <ul>
                                {guildRelations.bounty.map(bounty => (
                                    <li key={bounty.bountyID}>
                                        <p>Reward: {bounty.reward} gold</p>
                                        <p>{bounty.description}</p>
                                        <p>Difficulty: {bounty.difficulty}</p>
                                        <p>Status: {bounty.status}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No active bounties</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Guilds;