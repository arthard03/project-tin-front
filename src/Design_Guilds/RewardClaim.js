import React, { useState, useEffect } from 'react';
import {validateRewardClaimData} from '../Validation/RewardClaimValidation'
import { useTranslation } from 'react-i18next';

function RewardClaim() {
    const { t } = useTranslation();
    const [bountiesClaim, setBountiesClaim] = useState([]);
    const [selectedBountiesClaim, setSelectedBountiesClaim] = useState(null);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [editingBountyClaim, setEditingBountyClaim] = useState(null);
    const [formData, setFormData] = useState({
        bountyID: '',
        claimDate: '',
        finishDate: '',
        playerID: ''
    });

    const pageSize = 2;

    useEffect(() => {
        fetchBountiesClaims(0);
    }, []);

    const fetchBountiesClaims = async (page = 0) => {
        try {
            const response = await fetch(`http://localhost:8080/Tavern/bountiesClaim/getAll?page=${page}&size=${pageSize}`);
            if (!response.ok) throw new Error('Failed to fetch bounty claims.');
            const data = await response.json();
            setBountiesClaim(data.content);
            setTotalPages(data.totalPages);
            setCurrentPage(page);
            setSelectedBountiesClaim(null);
            setError('');
        } catch (err) {
            setError('Failed to load bounty claims.');
        }
    };

    const fetchBountiesClaimDetails = async (claimID) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error(t('error.error'));
            }
            const response = await fetch(`http://localhost:8080/Tavern/bountiesClaim/relations/${claimID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch bounty claim details.');
            const data = await response.json();
            setSelectedBountiesClaim(data);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateRewardClaimData(formData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error(t('error.error'));
            }
            const url = editingBountyClaim
                ? `http://localhost:8080/Tavern/bountiesClaim/${editingBountyClaim.claimID}`
                : 'http://localhost:8080/Tavern/bountiesClaim';
            const method = editingBountyClaim ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to save bounty claim.');
            setShowForm(false);
            setEditingBountyClaim(null);
            setFormData({
                bountyID: '',
                claimDate: '',
                finishDate: '',
                playerID: ''
            });
            setValidationErrors({});
            fetchBountiesClaims(currentPage);
        } catch (err) {
            setError(err.message);
        }
    };

    const startEdit = (bountyClaim) => {
        setEditingBountyClaim(bountyClaim);
        setFormData({
            bountyID: bountyClaim.bountyID,
            claimDate: bountyClaim.claimDate,
            finishDate: bountyClaim.finishDate,
            playerID: bountyClaim.playerID
        });
        setShowForm(true);
    };

    const handleDelete = async (bountyClaimId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error(t('error.error'));
            }
            const response = await fetch(`http://localhost:8080/Tavern/bountiesClaim/${bountyClaimId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to delete bounty claim.');
            fetchBountiesClaims(0);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Bounty Claims Directory</h1>
            <button onClick={() => fetchBountiesClaims(0)}>Load Bounty Claims</button>
            <button
                onClick={() => {
                    setShowForm(!showForm);
                    setEditingBountyClaim(null);
                    setFormData({
                        bountyID: '',
                        claimDate: '',
                        finishDate: '',
                        playerID: ''
                    });
                }}>{showForm ? 'Cancel' : 'Create Bounty Claim'}</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="number"
                            placeholder="Bounty ID"
                            value={formData.bountyID}
                            onChange={(e) => setFormData({...formData, bountyID: e.target.value})}
                        />
                        {validationErrors.bountyID && <p style={{color: 'red'}}>{validationErrors.bountyID}</p>}
                    </div>
                    <div>
                        <input
                            type="date"
                            placeholder="Claim Date"
                            value={formData.claimDate}
                            onChange={(e) => setFormData({...formData, claimDate: e.target.value})}
                        />
                        {validationErrors.claimDate && <p style={{color: 'red'}}>{validationErrors.claimDate}</p>}
                    </div>
                    <div>
                        <input
                            type="date"
                            placeholder="Finish Date"
                            value={formData.finishDate}
                            onChange={(e) => setFormData({...formData, finishDate: e.target.value})}
                        />
                        {validationErrors.finishDate && <p style={{color: 'red'}}>{validationErrors.finishDate}</p>}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Player ID"
                            value={formData.playerID}
                            onChange={(e) => setFormData({...formData, playerID: e.target.value})}
                        />
                        {validationErrors.playerID && <p style={{color: 'red'}}>{validationErrors.playerID}</p>}
                    </div>
                    <button type="submit">{editingBountyClaim ? 'Update' : 'Submit'}</button>
                </form>
            )}
            {!selectedBountiesClaim && (
                <div>
                    <div>
                        {bountiesClaim.map(bountyClaim => (
                            <div key={bountyClaim.claimID}>
                                <p>Claim Date: {bountyClaim.claimDate}</p>
                                <p>Finish Date: {bountyClaim.finishDate}</p>
                                <button onClick={() => fetchBountiesClaimDetails(bountyClaim.claimID)}>Details</button>
                                <button onClick={() => {
                                    startEdit(bountyClaim);
                                    setShowForm(true);
                                }}>Edit
                                </button>
                                <button onClick={() => handleDelete(bountyClaim.claimID)}>Delete</button>
                            </div>
                        ))}
                    </div>

                    <div>
                        <button onClick={() => fetchBountiesClaims(currentPage - 1)} disabled={currentPage === 0}>Previous</button>
                        <span>Page {currentPage + 1} of {totalPages}</span>
                        <button onClick={() => fetchBountiesClaims(currentPage + 1)} disabled={currentPage === totalPages - 1}>Next</button>
                    </div>
                </div>
            )}
            {selectedBountiesClaim && (
                <div>
                    <p>Claim Date: {selectedBountiesClaim.claimDate}</p>
                    <p>Finish Date: {selectedBountiesClaim.finishDate}</p>
                    <h3>Bounty Details</h3>
                    {selectedBountiesClaim.bountyDTOS?.length ? (
                        selectedBountiesClaim.bountyDTOS.map((bounty) => (
                            <div key={bounty.bountyID}>
                                <p>Description: {bounty.description}</p>
                                <p>Reward: {bounty.reward}</p>
                                <p>Status: {bounty.status}</p>
                                <p>Difficulty: {bounty.difficulty}</p>
                            </div>
                        ))
                    ) : (
                        <p>No active bounty details available.</p>
                    )}
                    <h3>Player Details</h3>
                    {selectedBountiesClaim.playerDTOS?.length ? (
                        selectedBountiesClaim.playerDTOS.map((player) => (
                            <div key={player.id}>
                                <p>Name: {player.name}</p>
                                <p>Class: {player.clazz}</p>
                                <p>Specialty: {player.speciality}</p>
                                <p>Persuasion: {player.persuasionLevel}</p>
                            </div>
                        ))
                    ) : (
                        <p>No active player details available.</p>
                    )}
                    <button onClick={() => setSelectedBountiesClaim(null)}>Back to List</button>
                </div>
            )}
            <div className="page-image">
                <img
                    src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRn40pE1BoWV7_cztAfYkT6_gLJ0wgBEwN3L5Yd_ZZJRYp4zKPJ"
                    alt="Guild Visual"/>
            </div>
        </div>
    );
}

export default RewardClaim;
