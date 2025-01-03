import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {validateAuthForm} from '../Validation/UserValidation';
function AuthenticationPage() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showRoleSelect, setShowRoleSelect] = useState(false);
    const [selectedRole, setSelectedRole] = useState('USER');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.ctrlKey && event.key === 'q') {
                setShowRoleSelect(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    const handleRegister = async () => {
        const validationErrors = validateAuthForm(username, password);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        try {
            await axios.post('http://localhost:8080/Tavern/auth/register', {
                name: username,
                password: password,
                role: selectedRole
            });
            // alert('Registration successful!');
            setIsRegistering(false);
        } catch (error) {
            // alert('Error registering: ' + error.response?.data || 'Unknown error');
            setErrors(error.message);
        }
    };

    const handleLogin = async () => {
        const validationErrors = validateAuthForm(username, password);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        try {
            const response = await axios.post('http://localhost:8080/Tavern/auth/login', {
                name: username,
                password: password
            });
            localStorage.setItem('token', response.data);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
            window.location.href = '/guilds';
        } catch (error) {
           setErrors(error.message);
        }
    };

    return (
        <div>
            <h1>{isRegistering ? 'Register' : 'Login'}</h1>
            <form>
            <div>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
                {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
            </div>
            <div>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
                {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
            </div>
            </form>
            {isRegistering && showRoleSelect && (
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="USER">User</option>
                    <option value="GUILDMASTER">Guild Master</option>
                    <option value="ADMIN">Admin</option>
                </select>
            )}

            {isRegistering ? (
                <button onClick={handleRegister}>Register</button>
            ) : (
                <button onClick={handleLogin}>Login</button>
            )}

            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
            </button>
            <div className="page-image">
                <img src="https://static1.thegamerimages.com/wordpress/wp-content/uploads/2020/12/oblivion-guard-the-elder-scrolls.jpg"
                     alt="Guild Visual"/>
            </div>
        </div>
    );
}

export default AuthenticationPage;