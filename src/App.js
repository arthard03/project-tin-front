import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Guilds from './Design_Guilds/Guilds';
import Rewards from './Design_Guilds/Rewards';
import RewardClaim from './Design_Guilds/RewardClaim';
import Player from './Design_Guilds/Player';
import AuthenticationPage from './Design_Guilds/register';
import  Users from './Design_Guilds/Users';
import './i18n/i18n';
import './App.css';

function App() {
    const [userRole, setUserRole] = useState(null);
    const { t, i18n } = useTranslation();
    const isAuthenticated = !!localStorage.getItem('token');
    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role')
        window.location.href = '/auth';
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'pl' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <Router>
            <div className="App">
                <header className="navbar">
                    <ul className="nav-links">
                        <li><Link to="/auth">{t('nav.loginRegister')}</Link></li>
                        <li><Link to="/guilds">{t('nav.guilds')}</Link></li>
                        <li><Link to="/rewards">{t('nav.rewards')}</Link></li>
                        <li><Link to="/reward_claim">{t('nav.rewardClaim')}</Link></li>
                        <li><Link to="/player">{t('nav.player')}</Link></li>
                        {isAuthenticated && (
                            <li><button onClick={handleLogout} className="nav-link-button">{t('nav.logout')}</button></li>
                        )}
                        {( userRole === 'ADMIN') && (
                            <li><Link to="/users">{t('user.link')}</Link></li>
                        )}
                        <li>
                            <button
                                onClick={toggleLanguage}
                                className="nav-link-button"
                            >
                                {i18n.language === 'en' ? 'PL' : 'EN'}
                            </button>
                        </li>
                    </ul>
                </header>
                <div className="content">
                    <Routes>
                        <Route path="/auth" element={<AuthenticationPage />} />
                        <Route path="/guilds" element={<Guilds />} />
                        <Route path="/rewards" element={<Rewards />} />
                        <Route path="/reward_claim" element={<RewardClaim />} />
                        <Route path="/player" element={<Player />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="*" element={<Navigate to="/guilds" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;