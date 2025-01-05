import React, {useEffect, useState} from 'react';
import {validateRewardData} from '../Validation/rewardValidation';
import { useTranslation } from 'react-i18next';

function Rewards() {
    const { t } = useTranslation();
    const [bounties, setBounties] = useState([]);
    const [selectedBounty, setSelectedBounty] = useState(null);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [editingBounty, setEditingBounty] = useState(null);
    const [userRole, setUserRole] = useState(null);
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
    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
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
            setError(t('error.bounty_f'));
        }
    };
    const fetchBountiesDetails = async (bountyID) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error(t('error.error'));
            }
            const response = await fetch(`http://localhost:8080/Tavern/bounties/relations/${bountyID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setSelectedBounty(data);
            setError('');
        } catch (err) {
            setError(t('error.bounty_fd'));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateRewardData(formData,t);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors); 
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error(t('error.error'));
            }
            const url = editingBounty
                ? `http://localhost:8080/Tavern/bounties/${editingBounty.bountyID}`
                : 'http://localhost:8080/Tavern/bounties';

         const response=   await fetch(url, {
                method: editingBounty ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error(t('error.guild_'));
            }
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
            setError(err.message);
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
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error(t('error.error'));
            }
        const response=    await fetch(`http://localhost:8080/Tavern/bounties/${bountyId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error(t('error.guild_delete'));
            }
            fetchBounties(0);
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <div>
            <h1>{t('reward.reward_directory')}</h1>
            <button onClick={() => fetchBounties(0)}>{t('reward.load')}</button>
            {(userRole === 'ADMIN') && (

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
            }}>{showForm ? t('reward.cancel') : t('reward.create')}</button>
            )}
            {error && <p style={{color: 'red'}}>{error}</p>}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder={t('reward.description')}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                        {validationErrors.description && <p style={{color: 'red'}}>{validationErrors.description}</p>}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder={t('reward.reward')}
                            value={formData.reward}
                            onChange={(e) => setFormData({...formData, reward: e.target.value})}
                        />
                        {validationErrors.reward && <p style={{color: 'red'}}>{validationErrors.reward}</p>}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder={t('reward.status')}
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                        />
                        {validationErrors.status && <p style={{color: 'red'}}>{validationErrors.status}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder={t('reward.difficulty')}
                            value={formData.difficulty}
                            onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                        />
                        {validationErrors.difficulty && <p style={{color: 'red'}}>{validationErrors.difficulty}</p>}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder={t('reward.guild')}
                            value={formData.guildID}
                            onChange={(e) => setFormData({...formData, guildID: e.target.value})}
                        />
                        {validationErrors.guildID && <p style={{color: 'red'}}>{validationErrors.guildID}</p>}
                    </div>
                    <button type="submit">{editingBounty ? t('reward.update') : t('reward.submit')}</button>
                </form>
            )}
            {!selectedBounty && (
                <div>
                    <div>
                        {bounties.map((bounty) => (
                            <div key={bounty.bountyID}>
                                <p><strong>{t('reward.n_')}</strong></p>
                                <p>{t('reward.description')} {bounty.description}</p>
                                <p>{t('reward.reward')} {bounty.reward}</p>
                                <p>{t('reward.status')} {bounty.status}</p>
                                <p>{t('reward.difficulty')}: {bounty.difficulty}</p>
                                {(userRole === 'USER' || userRole === 'ADMIN') && (
                                    <div>
                                    <button onClick={() => fetchBountiesDetails(bounty.bountyID)}>{t('reward.details')}</button><button onClick={() => {
                                    startEdit(bounty);
                                    setShowForm(!showForm);
                                }}>{t('reward.edit')}
                                </button>
                                <button onClick={() => handleDelete(bounty.bountyID)}>{t('reward.delete')}</button>
                                    </div>
                                    )}
                            </div>
                        ))}
                    </div>
                    <div>
                        <button onClick={() => fetchBounties(currentPage - 1)} disabled={currentPage === 0}>{t('reward.previous')}</button>
                        <button onClick={() => fetchBounties(currentPage + 1)} disabled={currentPage >= totalPages - 1}>{t('reward.next')}</button>
                    </div>
                </div>
            )}

            {selectedBounty && (
                <div>
                    <p><strong>{t('reward.n_')}</strong></p>
                    <p>{t('reward.description')} {selectedBounty.description}</p>
                    <p>{t('reward.reward')} {selectedBounty.reward}</p>
                    <p>{t('reward.status')} {selectedBounty.status}</p>
                    <p>{t('reward.difficulty')} {selectedBounty.difficulty}</p>
                    <h3><strong>{t('reward.bounty_claim')}</strong></h3>
                    {selectedBounty.bountyClaims?.length ? (
                        selectedBounty.bountyClaims.map(claim => (
                            <div key={claim.claimID}>
                                <p>{t('reward.bounty_claim_date')} {claim.claimDate}</p>
                                <p>{t('reward.bounty_claim_finish_date')} {claim.finishDate}</p>
                                <p>{t('reward.bounty_claim_bountyID')} {claim.bountyID}</p>
                                <p>{t('reward.bounty_claim_playerID')} {claim.playerID}</p>
                            </div>
                        ))
                    ) : (
                        <p>{t('reward.no_active_bounty_claim')}</p>
                    )}
                    <h3><strong>{t('reward.guild_')}</strong></h3>
                    {selectedBounty.guildDTOS?.length ? (
                        selectedBounty.guildDTOS.map((guild) => (
                            <div key={guild.guildID}>
                                <p>{t('reward.guild_name')} {guild.name}</p>
                                <p>{t('reward.guild_description')} {guild.description}</p>
                                <p>{t('reward.guild_members')} {guild.members}</p></div>
                        ))
                    ) : (
                        <p>{t('reward.no_active_guild')}</p>
                    )}
                    <button onClick={() => setSelectedBounty(null)}>{t('reward.back')}</button>
                </div>
            )}
            <div className="page-image">
                <img src="https://pbs.twimg.com/media/FsGU-mHX0AMVvYi.jpg"
                     alt="Guild Visual"/>
            </div>
        </div>
    );
}

export default Rewards;
