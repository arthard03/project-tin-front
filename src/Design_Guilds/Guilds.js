import React, {useEffect, useState } from 'react';
import  {validateGuildData} from '../Validation/GuildValidation';
import { useTranslation } from 'react-i18next';

function Guilds() {
    const { t } = useTranslation();
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
    },[]);

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
            if (!token) {
                throw new Error(t('error.error'));
            }
            const response = await fetch(`http://localhost:8080/Tavern/guilds/relations/${guildId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setSelectedGuild(data);
            setError('');
        } catch (err) {
                setError(t('error.error'));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateGuildData(formData,t);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error(t('error.error'));
            }
            const url = editingGuild
                ? `http://localhost:8080/Tavern/guilds/${editingGuild.guildID}`
                : 'http://localhost:8080/Tavern/guilds';

          const response=  await fetch(url, {
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
            if (!response.ok) {
                throw new Error(t('error.error'));
            }
            setValidationErrors({});
            fetchGuilds(currentPage);
        } catch (err) {
            setError(t('error.error'));
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
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error(t('error.error'));
            }
            const response =  await fetch(`http://localhost:8080/Tavern/guilds/${guildId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error(t('error.error'));
            }
            fetchGuilds(0);
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <div>
            <h1>{t('guilds.directory')}</h1>
            <button onClick={() => fetchGuilds(0)}>{t('guilds.loadGuilds')}</button>
            <button onClick={() => {
                setShowForm(!showForm);
                setEditingGuild(null);
                setFormData({
                    name: '',
                    description: '',
                    members: ''
                });
            }}>{showForm ? t('guilds.cancel') : t('guilds.createGuild')}</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder={t('guilds.form.name.placeholder')}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        {validationErrors.name && <p style={{color: 'red'}}>{validationErrors.name}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder={t('guilds.form.description.placeholder')}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                        {validationErrors.description && <p style={{color: 'red'}}>{validationErrors.description}</p>}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder={t('guilds.form.members.placeholder')}
                            value={formData.members}
                            onChange={(e) => setFormData({...formData, members: parseInt(e.target.value, 10)})}
                        />
                        {validationErrors.members && <p style={{color: 'red'}}>{validationErrors.members}</p>}
                    </div>
                    <button type="submit">{editingGuild ? t('guilds.actions.update') : t('guilds.actions.submit')}</button>
                </form>
            )}
            {!selectedGuild && (
                <div>
                    <div>
                        {guilds.map(guild => (
                            <div key={guild.guildID}>
                                <p><strong>{t('guilds.form.name.placeholder')} {guild.name}</strong></p>
                                <p>{t('guilds.form.description.placeholder')} {guild.description}</p>
                                <p>{t('guilds.form.members.placeholder')} {guild.members}</p>
                                <button onClick={() => fetchGuildDetails(guild.guildID)}>{t('guilds.actions.details')}</button>
                                <button onClick={() => {
                                    startEdit(guild);
                                    setShowForm(!showForm);
                                }}>{t('guilds.actions.edit')}
                                </button>
                                <button onClick={() => handleDelete(guild.guildID)}>{t('guilds.actions.delete')}</button>
                            </div>
                        ))}
                    </div>
                    <div>
                        <button onClick={() => fetchGuilds(currentPage - 1)} disabled={currentPage === 0}>{t('guilds.pagination.previous')}</button>
                        <span>{t('guilds.pagination.page')} {currentPage + 1} {t('guilds.pagination.of')} {totalPages}</span>
                        <button onClick={() => fetchGuilds(currentPage + 1)} disabled={currentPage === totalPages - 1}>{t('guilds.pagination.next')}</button>
                    </div>
                </div>
            )}

            {selectedGuild && (
                <div>
                    <h2>{t('guilds.guildDetails.title')} {selectedGuild.name}</h2>
                    <p>{t('guilds.guildDetails.description')} {selectedGuild.description}</p>
                    <p>{t('guilds.guildDetails.members')}: {selectedGuild.members}</p>

                    <h3>{t('guilds.guildDetails.bounties.title')}</h3>
                    {selectedGuild.bounty?.length ? (
                        selectedGuild.bounty.map((bounty) => (
                            <div key={bounty.bountyID}>
                                <p>{t('guilds.guildDetails.bounties.reward')} {bounty.reward} gold</p>
                                <p>{t('guilds.guildDetails.bounties.description')} {bounty.description}</p>
                                <p>{t('guilds.guildDetails.bounties.difficulty')} {bounty.difficulty}</p>
                                <p>{t('guilds.guildDetails.bounties.status')} {bounty.status}</p></div>
                        ))
                    ) : (
                        <p>{t('guilds.guildDetails.bounties.noBounties')}</p>
                    )}
                    <button onClick={() => setSelectedGuild(null)}>{t('guilds.actions.back')}</button>
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