import React, { useState } from 'react';
import axios from 'axios';
import './signup-login.css';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate =useNavigate();
    const handleSignup = async () => {
        try {
            const response = await axios.post('https://movieinfo-qyuv.onrender.com/api/signup', { username, password });
            console.log(response.data);
            navigate("/login");
            // Handle success (redirect, show message, etc.)
        } catch (error) {
            console.error('Signup error:', error.response.data.msg);
            setError(error.response.data.msg);
        }
    };

    return (
        <div className="container">
        <div className="form-container">
            <h2>Signup</h2>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleSignup}>Signup</button>
            <p>Already have an account? <Link to="/login" className='ok1'>Login here</Link></p>
        </div>
        </div>
    );
};

export default Signup;
