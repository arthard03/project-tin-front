import React, {useEffect, useState } from 'react';
import  {validateGuildData} from '../Validation/GuildValidation';
function Guilds() {
    const [guilds, setGuilds] = useState([]);
    const [selectedGuild, setSelectedGuild] = useState(null);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [editingGuild, setEditingGuild] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        members: ''
    });
    const pageSize = 2;
    
    useEffect(() => {
        fetchGuilds(0);
    }, []);

    const fetchGuilds = async (page = 0) => {
        try {
            const response = await fetch(`http://localhost:8080/Tavern/guilds/getAll?page=${page}&size=${pageSize}`);
            if (!response.ok) throw new Error('Failed to fetch guilds');
            const data = await response.json();
            setGuilds(data.content);
            setTotalPages(data.totalPages);
            setCurrentPage(page);
            setSelectedGuild(null);
            setError('');
        } catch (err) {
            setError('Could not load guilds');
        }
    };

    const fetchGuildDetails = async (guildId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Please log in');

            const response = await fetch(`http://localhost:8080/Tavern/guilds/relations/${guildId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setSelectedGuild(data);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateGuildData(formData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        try {
            const url = editingGuild
                ? `http://localhost:8080/Tavern/guilds/${editingGuild.guildID}`
                : 'http://localhost:8080/Tavern/guilds';

            await fetch(url, {
                method: editingGuild ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            setShowForm(false);
            setEditingGuild(null);
            setFormData({
                name: '',
                description: '',
                members: '',
            });
            setValidationErrors({});
            fetchGuilds(currentPage);
        } catch (err) {
            setError(editingGuild ? 'F  update guild' : 'F create guild');
        }
    };
    const startEdit = (guild) => {
        setEditingGuild(guild);
        setFormData({
            name: guild.name,
            description: guild.description,
            members: guild.members
        });
        setShowForm(true);
    };
    const handleDelete = async (guildId) => {
        try {
            await fetch(`http://localhost:8080/Tavern/guilds/${guildId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchGuilds(0);
        } catch (err) {
            setError('Failed to delete guild');
        }
    };
    return (
        <div>
            <h1>Guilds Directory</h1>
            <button onClick={() => fetchGuilds(0)}>Load Guilds</button>
            <button onClick={() => {
                setShowForm(!showForm);
                setEditingGuild(null);
                setFormData({
                    name: '',
                    description: '',
                    members: ''
                });
            }}>{showForm ? 'Cancel' : 'Create Guild'}</button>
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
                        {validationErrors.name && <p style={{color: 'red'}}>{validationErrors.name}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                        {validationErrors.description && <p style={{color: 'red'}}>{validationErrors.description}</p>}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Members"
                            value={formData.members}
                            onChange={(e) => setFormData({...formData, members: parseInt(e.target.value, 10)})}
                        />
                        {validationErrors.members && <p style={{color: 'red'}}>{validationErrors.members}</p>}
                    </div>
                    <button type="submit">{editingGuild ? 'Update' : 'Submit'}</button>
                </form>
            )}
            {!selectedGuild && (
                <div>
                    <div>
                        {guilds.map(guild => (
                            <div key={guild.guildID}>
                                <p><strong>{guild.name}</strong></p>
                                <p>Description: {guild.description}</p>
                                <p>Members: {guild.members}</p>
                                <button onClick={() => fetchGuildDetails(guild.guildID)}>Details</button>
                                <button onClick={() => {
                                    startEdit(guild);
                                    setShowForm(!showForm);
                                }}>Edit
                                </button>
                                <button onClick={() => handleDelete(guild.guildID)}>Delete</button>
                            </div>
                        ))}
                    </div>
                    <div>
                        <button onClick={() => fetchGuilds(currentPage - 1)} disabled={currentPage === 0}>Previous</button>
                        <span>Page {currentPage + 1} of {totalPages}</span>
                        <button onClick={() => fetchGuilds(currentPage + 1)} disabled={currentPage === totalPages - 1}>Next</button>
                    </div>
                </div>
            )}

            {selectedGuild && (
                <div>
                    <h2>Guild: {selectedGuild.name}</h2>
                    <p>Description: {selectedGuild.description}</p>
                    <p>Members: {selectedGuild.members}</p>

                    <h3>Bounties</h3>
                    {selectedGuild.bounty?.length ? (
                        selectedGuild.bounty.map((bounty) => (
                            <div key={bounty.bountyID}>
                                <p>Reward: {bounty.reward} gold</p>
                                <p>Description: {bounty.description}</p>
                                <p>Difficulty: {bounty.difficulty}</p>
                                <p>Status: {bounty.status}</p></div>
                        ))
                    ) : (
                        <p>No active bounties</p>
                    )}
                    <button onClick={() => setSelectedGuild(null)}>Back to List</button>
                </div>
            )}
            <div className="page-image">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoc2NfFplgbKgaz6jXpQAVDCDNVVkjExaO5A&s"
                     alt="Guild Visual"/>
            </div>
        </div>
    );
}

export default Guilds;
