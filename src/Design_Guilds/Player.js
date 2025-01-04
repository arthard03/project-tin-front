import React, {useEffect, useState } from 'react';
import { validatePlayerData } from '../Validation/playerValidation'; // Import the validation module
import { useTranslation } from 'react-i18next';

const Player = () => {
    const { t } = useTranslation();
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [userRole, setUserRole] = useState(null);
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
    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
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
            setError(t('error.player_f'));
        }
    };

    const fetchPlayerDetails = async (playerId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error(t('error.error'));
            }
            const response = await fetch(`http://localhost:8080/Tavern/players/relations/${playerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setSelectedPlayer(data);
            setError('');
        } catch (err) {
            setError(t('error.fetch_p'));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validatePlayerData(formData,t);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error(t('error.error'));
            }
            const url = editingPlayer
                ? `http://localhost:8080/Tavern/players/${editingPlayer.id}`
                : 'http://localhost:8080/Tavern/players';

            const response=    await fetch(url, {
                method: editingPlayer ? 'PUT' : 'POST',
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
            setEditingPlayer(null);
            setFormData({
                name: '',
                clazz: '',
                speciality: '',
                persuasionLevel: ''
            });
            setValidationErrors({});
            fetchPlayers(currentPage);
        } catch (err) {
            setError(err.message);
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
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error(t('error.error'));
            }
           const response= await fetch(`http://localhost:8080/Tavern/players/${playerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error(t('error.player_d'));
            }
            fetchPlayers(0);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>{t('playerPage.playerDirectory')}</h1>
            <button onClick={() => fetchPlayers(0)}>{t('playerPage.load')}</button>
            {(userRole === 'USER' || userRole === 'ADMIN') && (
            <button onClick={() => {
                setShowForm(!showForm);
                setEditingPlayer(null);
                setFormData({
                    name: '',
                    clazz: '',
                    speciality: '',
                    persuasionLevel: ''
                });
            }}>{showForm ? t('playerPage.cancel') : t('playerPage.create')}</button>
            )}

            {error && <p style={{color: 'red'}}>{error}</p>}

            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder={t('playerPage.name')}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        {validationErrors.name && <p style={{color: 'red'}}>{validationErrors.name}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder={t('playerPage.clazz')}
                            value={formData.clazz}
                            onChange={(e) => setFormData({...formData, clazz: e.target.value})}
                        />
                        {validationErrors.clazz && <p style={{color: 'red'}}>{validationErrors.clazz}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder={t('playerPage.speciality')}
                            value={formData.speciality}
                            onChange={(e) => setFormData({...formData, speciality: e.target.value})}
                        />
                        {validationErrors.speciality && <p style={{color: 'red'}}>{validationErrors.speciality}</p>}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder={t('playerPage.persuasionLevel')}
                            value={formData.persuasionLevel}
                            onChange={(e) => setFormData({...formData, persuasionLevel: parseInt(e.target.value, 10)})}
                        />
                        {validationErrors.persuasionLevel &&
                            <p style={{color: 'red'}}>{validationErrors.persuasionLevel}</p>}
                    </div>
                    <button type="submit">{editingPlayer ? t('playerPage.update') : t('playerPage.submit')}</button>
                </form>
            )}

            {!selectedPlayer && (
                <div>
                    <div>
                        {players.map(player => (
                            <div key={player.id}>
                                <p><strong>{player.name}</strong></p>
                                <p>{t('playerPage.clazz')} {player.clazz}</p>
                                <p>{t('playerPage.speciality')} {player.speciality}</p>
                                <p>{t('playerPage.persuasionLevel')} {player.persuasionLevel}</p>
                                {(userRole === 'USER' || userRole === 'ADMIN') && (
                                    <div>
                                        <button
                                            onClick={() => fetchPlayerDetails(player.id)}>{t('playerPage.details')}</button><button onClick={() => {
                                            startEdit(player);
                                            setShowForm(!showForm);
                                        }}>{t('playerPage.edit')}</button>
                                        <button onClick={() => handleDelete(player.id)}>{t('playerPage.delete')}</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div>
                        <button onClick={() => fetchPlayers(currentPage - 1)} disabled={currentPage === 0}>{t('playerPage.previous')}</button>
                        <button onClick={() => fetchPlayers(currentPage + 1)} disabled={currentPage === totalPages - 1}>{t('playerPage.next')}</button>
                    </div>

                </div>
            )}

            {selectedPlayer && (
                <div>
                    <h2><strong>{selectedPlayer.name}</strong></h2>
                    <p>{t('playerPage.clazz')} {selectedPlayer.clazz}</p>
                    <p>{t('playerPage.speciality')} {selectedPlayer.speciality}</p>
                    <p>{t('playerPage.persuasionLevel')} {selectedPlayer.persuasionLevel}</p>

                    <h3><strong>{t('playerPage.bounty_claim')}</strong></h3>
                    {selectedPlayer.bountyClaims?.length ? (
                        selectedPlayer.bountyClaims.map(claim => (
                            <div key={claim.claimID}>
                                <p>{t('playerPage.bounty_claim_date')} {claim.claimDate}</p>
                                <p>{t('playerPage.bounty_claim_finish_date')} {claim.finishDate}</p>
                                <p>{t('playerPage.bounty_claim_bountyID')} {claim.bountyID}</p>
                                <p>{t('playerPage.bounty_claim_playerID')} {claim.playerID}</p>
                            </div>
                        ))
                    ) : (
                        <p>{t('playerPage.no_active_bounty')}</p>
                    )}

                    <button onClick={() => setSelectedPlayer(null)}>{t('playerPage.back')}</button>
                </div>
            )}
            <div className="page-image">
                <img
                    src="https://preview.redd.it/custom-class-concept-magefist-a-more-immersive-roleplay-v0-syb2s83a4a6a1.jpg?width=1000&format=pjpg&auto=webp&s=a6d9b497fc8f777f8721e67410aa603ef9610175"
                    alt="Guild Visual"/>
            </div>
        </div>
    );
};

export default Player;