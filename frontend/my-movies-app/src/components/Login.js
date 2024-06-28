import React, { useState } from 'react';
import axios from 'axios';
import './signup-login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/Usercontext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {setUsername1} = useUser();
    const navigate= useNavigate();
    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password });
            const { success, accessToken ,nameofuser} = response.data;

            if (success) {
                localStorage.setItem('accessToken', accessToken); // Store token in localStorage
                setUsername1(nameofuser);
                navigate("/");
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error.message);
            setError('Login error. Please try again later.');
        }
    };

    return (
        <div className="container">
        <div className="form-container">
            <h2>Login</h2>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleLogin}>Login</button>
            <p>Hmm, New user? <Link to="/signup" className='ok1'>Signup here</Link></p>
        </div>
        </div>
    );
};

export default Login;
