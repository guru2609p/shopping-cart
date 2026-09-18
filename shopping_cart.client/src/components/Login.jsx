import { useState } from "react";

export default function Login({ showRegister, handleHome, setLoginUser }) {
    const [loginErrors, setLoginErrors] = useState([]);

    
    async function handleLoginSubmit(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        const email = fd.get('email');
        const password = fd.get('password');

        try {
            // Send request directly to your Shopping_cart C# Backend
            const response = await fetch("http://localhost:5285/api/Auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Maps directly to your C# LoginModel properties (Username & Password)
                body: JSON.stringify({ username: email, password: password })
            });

            //  Handle invalid credentials (matches C# Unauthorized response)
            if (!response.ok) {
                setLoginErrors(['Invalid email or password']);
                return;
            }

            //  Extract the JWT token and user details returned by C#
            const data = await response.json();

            // Save the token in local storage for secure checkout actions later
            localStorage.setItem('token', data.token);


            console.log('Logged user from database:', data);

            setLoginErrors([]);

            // Update state using data fetched directly from your SQL table rows
            setLoginUser({
                email: email,
                firstName: data.firstName,
                lastName: data.lastName,
                role:data.userRole,
            });

            handleHome();
            event.target.reset();

        } catch (error) {
            console.error('Error connecting to C# server:', error);
            setLoginErrors(['Unable to reach the login server. Please try again later.']);
        }
    }

    return (
        <>
            <div id='login-page' >
                <div id='login'>
                    <h1>Login</h1>

                    <form onSubmit={handleLoginSubmit}>
                        <div id='login-inputs'>
                            <label>Email:</label>
                            <input required type='text' placeholder='Enter email' name='email'></input>
                            <label>Password:</label>
                            <input required type='password' placeholder='Enter Password' name='password'></input>
                        </div>
                        <div id='login-buttons'>
                            <button type='submit'>Sign In</button>
                            <button type='button' onClick={showRegister}>Register</button>
                        </div>
                    </form>
                    <div>
                        <ul style={{ color: 'red', listStyleType: "none" }}>
                            {loginErrors.map((error, index) => {
                                return (<li key={index}>{error}</li>)
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
