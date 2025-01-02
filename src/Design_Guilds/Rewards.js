import React, {useEffect, useState} from 'react';
import {validateRewardData} from '../Validation/rewardValidation';
function Rewards() {
    const [bounties, setBounties] = useState([]);
    const [selectedBounty, setSelectedBounty] = useState(null);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [editingBounty, setEditingBounty] = useState(null);
        const [formData, setFormData] = useState({
            description: '',
            reward: '',
            status: '',
            difficulty: '',
            guild: ''
        });
    const pageSize = 2;

    useEffect(() => {
        fetchBounties(0);
    }, []);

    const fetchBounties = async (page = 0) => {
        try {
            const response = await fetch(`http://localhost:8080/Tavern/bounties/getAll?page=${page}&size=${pageSize}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setBounties(data.content);
            setTotalPages(data.totalPages);
            setCurrentPage(page);
            setSelectedBounty(null);
            setError('');
        } catch (err) {
            setError('Could not load. Please try again later.');
        }
    };
    const fetchBountiesDetails = async (bountyID) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Please log in to view guild details.');

            const response = await fetch(`http://localhost:8080/Tavern/bounties/relations/${bountyID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setSelectedBounty(data);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateRewardData(formData); 
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors); 
            return;
        }
        try {
            const url = editingBounty
                ? `http://localhost:8080/Tavern/bounties/${editingBounty.bountyID}`
                : 'http://localhost:8080/Tavern/bounties';

            await fetch(url, {
                method: editingBounty ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            setShowForm(false);
            setEditingBounty(null);
            setFormData({
                description: '',
                reward: '',
                status: '',
                difficulty: '',
                guild: ''
            });
            setValidationErrors({});
            fetchBounties(currentPage);
        } catch (err) {
            setError(editingBounty ? 'Failed to update bounty' : 'Failed to create bounty');
        }
    };

    const startEdit = (bounty) => {
        setEditingBounty(bounty);
        setFormData({
            description: bounty.description,
            reward: bounty.reward,
            status: bounty.status,
            difficulty: bounty.difficulty,
            guild: bounty.guild
        });
        setShowForm(true);
    };
    const handleDelete = async (bountyId) => {
        try {
            await fetch(`http://localhost:8080/Tavern/bounties/${bountyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchBounties(0);
        } catch (err) {
            setError('Failed to delete bounty');
        }
    };
    return (
        <div>
            <h1>Bounties Directory</h1>
            <button onClick={() => fetchBounties(0)}>Load...</button>
            <button onClick={() => {
                setShowForm(!showForm);
                setEditingBounty(null);
                setFormData({
                    description: '',
                    reward: '',
                    status: '',
                    difficulty: '',
                    guild: ''
                });
            }}>{showForm ? 'Cancel' : 'Create Bounty'}</button>
            {error && <p>{error}</p>}
            {showForm && (
                <form onSubmit={handleSubmit}>
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
                            placeholder="Reward"
                            value={formData.reward}
                            onChange={(e) => setFormData({...formData, reward: e.target.value})}
                        />
                        {validationErrors.reward && <p style={{color: 'red'}}>{validationErrors.reward}</p>}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Status"
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                        />
                        {validationErrors.status && <p style={{color: 'red'}}>{validationErrors.status}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Difficulty"
                            value={formData.difficulty}
                            onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                        />
                        {validationErrors.difficulty && <p style={{color: 'red'}}>{validationErrors.difficulty}</p>}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Guild ID"
                            value={formData.guildID}
                            onChange={(e) => setFormData({...formData, guildID: e.target.value})}
                        />
                        {validationErrors.guildID && <p style={{color: 'red'}}>{validationErrors.guildID}</p>}
                    </div>
                    <button type="submit">{editingBounty ? 'Update' : 'Submit'}</button>
                </form>
            )}
            {!selectedBounty && (
                <div>
                    <div>
                        {bounties.map((bounty) => (
                            <div key={bounty.bountyID}>
                                <p>Description: {bounty.description}</p>
                                <p>Reward: {bounty.reward}</p>
                                <p>Status: {bounty.status}</p>
                                <p>Difficulty: {bounty.difficulty}</p>
                                <button onClick={() => fetchBountiesDetails(bounty.bountyID)}>Details</button>
                                <button onClick={() => {
                                    startEdit(bounty);
                                    setShowForm(!showForm);
                                }}>Edit</button>
                                <button onClick={() => handleDelete(bounty.bountyID)}>Delete</button>
                            </div>
                        ))}
                    </div>
                    <div>
                        <button onClick={() => fetchBounties(currentPage - 1)} disabled={currentPage === 0}>Previous</button>
                        <span>Page {currentPage + 1} of {totalPages}</span>
                        <button onClick={() => fetchBounties(currentPage + 1)} disabled={currentPage === totalPages - 1}>Next</button>
                    </div>
                </div>
            )}

            {selectedBounty && (
                <div>
                    <p>Description: {selectedBounty.description}</p>
                    <p>Reward: {selectedBounty.reward}</p>
                    <p>Status: {selectedBounty.status}</p>
                    <p>Difficulty: {selectedBounty.difficulty}</p>
                    <h3>BountyClaim</h3>
                    {selectedBounty.bountyClaims?.length ? (
                        selectedBounty.bountyClaims.map(claim => (
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
                    <h3>Guild</h3>
                    {selectedBounty.guildDTOS?.length ? (
                            selectedBounty.guildDTOS.map((guild) => (
                                <div key={guild.guildID}>
                                    <p>Name: {guild.name} gold</p>
                                    <p>Description: {guild.description}</p>
                                    <p>Members: {guild.members}</p></div>
                            ))
                    ) : (
                        <p>No active guilds</p>
                    )}
                    <button onClick={() => setSelectedBounty(null)}>Back to List</button>
                </div>
            )}
        </div>
    );
}

export default Rewards;
