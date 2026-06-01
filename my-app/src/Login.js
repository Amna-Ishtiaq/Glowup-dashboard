import React, { useState,useEffect } from 'react';
// import './Signup.css'
import { useNavigate } from 'react-router-dom';
const Loginbody = () => {
   
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Correctly calling useNavigate to get the navigate function
useEffect(()=>{
    const auth = localStorage.getItem("user")
    if(auth){
        navigate("/")
    }
})

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { email, password };

        let result = await fetch("https://salon-backend-api-production.up.railway.app/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        result = await result.json();
        console.warn("Data submitted", result);

        // Clear form fields
      
        setEmail('');
        setPassword('');

        // Store the result in local storage
        localStorage.setItem("user", JSON.stringify(result));

        // Navigate to the homepage after successful signup
        navigate("/");
    };

    return (
        <div className="user-form">
            <h3>Login HERE</h3>
            <form onSubmit={handleSubmit}>
         
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Loginbody;
