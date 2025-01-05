import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function Users() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 2;

    useEffect(() => {
        fetchUsers(0);
    }, []);

    const fetchUsers = async (page = 0) => {
        try {
            const response = await fetch(`http://localhost:8080/Tavern/users/getAll?page=${page}&size=${pageSize}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setUsers(data.content);
            setTotalPages(data.totalPages);
            setCurrentPage(page);
            setError('');
        } catch (err) {
            setError(t('error.bounty_f'));
        }
    };

    return (
        <div>
            <h1>{t('user.directory')}</h1>
            <button onClick={() => fetchUsers(0)}>{t('user.load')}</button>
            <div>
                {users.map((user) => (
                    <div key={user.id}>
                        <p><strong>{t('user.username')}</strong></p>
                        <p>{t('user.name')}: {user.name}</p>
                        <p>{t('user.role')}: {user.role}</p>
                    </div>
                ))}
            </div>
            <div>
                <button onClick={() => fetchUsers(currentPage - 1)} disabled={currentPage === 0}>{t('reward.previous')}</button>
                <button onClick={() => fetchUsers(currentPage + 1)} disabled={currentPage >= totalPages - 1}>{t('reward.next')}</button>
            </div>
        </div>
    );
}

export default Users;
