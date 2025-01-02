import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Guilds from './Design_Guilds/Guilds';
import Rewards from './Design_Guilds/Rewards';
import RewardClaim from './Design_Guilds/RewardClaim';
import Player from './Design_Guilds/Player';
import AuthenticationPage from './Design_Guilds/register';
import './App.css';

function App() {
    const isAuthenticated = !!  localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/auth';
    };

    return (
        <Router>
            <div className="App">
                <header className="navbar">
                    <ul className="nav-links">
                        <li><Link to="/auth">Login/Register</Link></li>
                        <li><Link to="/guilds">Guilds</Link></li>
                        <li><Link to="/rewards">Rewards</Link></li>
                        <li><Link to="/reward_claim">Reward Claim</Link></li>
                        <li><Link to="/player">Player</Link></li>
                        {isAuthenticated && (
                            <li><button onClick={handleLogout} className="nav-link-button">Logout</button></li>
                        )}
                    </ul>
                </header>
                <div className="content">
                    <Routes>
                        <Route path="/auth" element={<AuthenticationPage />} />
                        <Route path="/guilds" element={<Guilds />} />
                        <Route path="/rewards" element={<Rewards />} />
                        <Route path="/reward_claim" element={<RewardClaim />} />
                        <Route path="/player" element={<Player />} />
                        <Route path="*" element={<Navigate to="/guilds" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;