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
    const [userRole, setUserRole] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [bountyrToDelete, setBountyToDelete] = useState(null);
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
    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
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
            setError(t('error.fetch_b'));
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
            setError(t('error.fetch_bd'));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateRewardClaimData(formData,t);
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

            if (!response.ok) {
                throw new Error(t('error.guild_'));
            }
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

    const handleDelete = async (bountyClaimId=null,action=null) => {
        if (action === 'open') {
            setBountyToDelete(bountyClaimId);
            setShowDeletePopup(true);
        } else if (action === 'close') {
            setBountyToDelete(null);
            setShowDeletePopup(false);
        } else if (action === 'confirm' && bountyrToDelete) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error(t('error.error'));
            }
            const response = await fetch(`http://localhost:8080/Tavern/bountiesClaim/${bountyrToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error(t('error.guild_delete'));
            }
            fetchBountiesClaims(0);
        } catch (err) {
            setError(err.message);
        } finally {
                setBountyToDelete(null);
            setShowDeletePopup(false);
            }
        }
    };

    return (
        <div>
            <h1>{t('rewardClaim.directory')}</h1>
            <button onClick={() => fetchBountiesClaims(0)}>{t('rewardClaim.load')}</button>
            {(userRole === 'ADMIN') && (
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
                    }}>{showForm ? t('rewardClaim.cancel') : t('rewardClaim.create')}</button>
            )}
            {error && <p style={{color: 'red'}}>{error}</p>}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="number"
                            placeholder={t('rewardClaim.bountyID')}
                            value={formData.bountyID}
                            onChange={(e) => setFormData({...formData, bountyID: e.target.value})}
                        />
                        {validationErrors.bountyID && <p style={{color: 'red'}}>{validationErrors.bountyID}</p>}
                    </div>
                    <div>
                        <input
                            type="date"
                            placeholder={t('rewardClaim.claimDate')}
                            value={formData.claimDate}
                            onChange={(e) => setFormData({...formData, claimDate: e.target.value})}
                        />
                        {validationErrors.claimDate && <p style={{color: 'red'}}>{validationErrors.claimDate}</p>}
                    </div>
                    <div>
                        <input
                            type="date"
                            placeholder={t('rewardClaim.finishDate')}
                            value={formData.finishDate}
                            onChange={(e) => setFormData({...formData, finishDate: e.target.value})}
                        />
                        {validationErrors.finishDate && <p style={{color: 'red'}}>{validationErrors.finishDate}</p>}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder={t('rewardClaim.playerID')}
                            value={formData.playerID}
                            onChange={(e) => setFormData({...formData, playerID: e.target.value})}
                        />
                        {validationErrors.playerID && <p style={{color: 'red'}}>{validationErrors.playerID}</p>}
                    </div>
                    <button
                        type="submit">{editingBountyClaim ? t('rewardClaim.update') : t('rewardClaim.submit')}</button>
                </form>
            )}
            {!selectedBountiesClaim && (
                <div>
                    <div>
                        {bountiesClaim.map(bountyClaim => (
                            <div key={bountyClaim.claimID}>
                                <p><strong>{t('rewardClaim.n_')}</strong></p>
                                <p>{t('rewardClaim.claimDate')} {new Date(bountyClaim.claimDate).toLocaleDateString()}</p>
                                <p>{t('rewardClaim.finishDate')} {new Date(bountyClaim.finishDate).toLocaleDateString()}</p>
                                {(userRole === 'ADMIN') && (
                                    <div>
                                        <button
                                            onClick={() => fetchBountiesClaimDetails(bountyClaim.claimID)}>{t('rewardClaim.details')}</button>
                                        <button onClick={() => {
                                            startEdit(bountyClaim);
                                            setShowForm(true);
                                        }}>{t('rewardClaim.edit')}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(bountyClaim.claimID, 'open')}>{t('rewardClaim.delete')}</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div>
                        <button onClick={() => fetchBountiesClaims(currentPage - 1)}
                                disabled={currentPage === 0}>{t('rewardClaim.previous')}</button>
                        <button onClick={() => fetchBountiesClaims(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}>{t('rewardClaim.next')}</button>
                    </div>
                </div>
            )}
            {selectedBountiesClaim && (
                <div>
                    <p><strong>{t('rewardClaim.n_')}</strong></p>
                    <p>{t('rewardClaim.claimDate')} {selectedBountiesClaim.claimDate}</p>
                    <p>{t('rewardClaim.finishDate')} {selectedBountiesClaim.finishDate}</p>
                    <h3><strong>{t('rewardClaim.bountyDetails')}</strong></h3>
                    {selectedBountiesClaim.bountyDTOS?.length ? (
                        selectedBountiesClaim.bountyDTOS.map((bounty) => (
                            <div key={bounty.bountyID}>
                                <p>{t('rewardClaim.b_desc')} {bounty.description}</p>
                                <p>{t('rewardClaim.r_bounty')} {bounty.reward}</p>
                                <p>{t('rewardClaim.status')}: {bounty.status}</p>
                                <p>{t('rewardClaim.b_difficulty')} {bounty.difficulty}</p>
                            </div>
                        ))
                    ) : (
                        <p>{t('rewardClaim.b_no_active')}</p>
                    )}
                    <h3><strong>{t('rewardClaim.player_details')}</strong></h3>
                    {selectedBountiesClaim.playerDTOS?.length ? (
                        selectedBountiesClaim.playerDTOS.map((player) => (
                            <div key={player.id}>
                                <p>{t('rewardClaim.player_name')} {player.name}</p>
                                <p>{t('rewardClaim.player_class')} {player.clazz}</p>
                                <p>{t('rewardClaim.player_speciality')} {player.speciality}</p>
                                <p>{t('rewardClaim.player_persuasion')} {player.persuasionLevel}</p>
                            </div>
                        ))
                    ) : (
                        <p>{t('rewardClaim.player_no_active')}</p>
                    )}
                    <button onClick={() => setSelectedBountiesClaim(null)}>{t('rewardClaim.back')}</button>
                </div>
            )}
            <div className="page-image">
                <img
                    src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRn40pE1BoWV7_cztAfYkT6_gLJ0wgBEwN3L5Yd_ZZJRYp4zKPJ"
                    alt="Guild Visual"/>
            </div>
            <div>
                {showDeletePopup && (
                    <div className="popup-overlay">
                        <div className="popup-window">
                            <h3><p>{t('rewardClaim.directory')}</p></h3>
                            <p>{t('rewardClaim.comment')}</p>
                            <div className="popup-actions">
                                <button onClick={() => handleDelete(null, 'confirm')}>
                                    {t('rewardClaim.submit')}
                                </button>
                                <button onClick={() => handleDelete(null, 'close')}>
                                    {t('rewardClaim.cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RewardClaim;
