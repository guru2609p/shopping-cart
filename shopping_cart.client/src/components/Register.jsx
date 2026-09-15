import { useState } from "react";
import { isEmail, isNotEmpty, isEqualToOtherValue, hasMinLength } from '../validation';

// 1. MODIFIED: Removed registeredUsers and setRegisteredUsers from props to protect data privacy
export default function Register({ showLogin }) {

    const [validationErrors, setValidationErrors] = useState([]);

    async function handleRegisterSubmit(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        const email = fd.get('email');
        const password = fd.get('password');
        const confirmPassword = fd.get('confirmpassword');
        const firstName = fd.get('firstname');
        const lastName = fd.get('lastname');
        const checkboxInput = fd.get('checkboxinput');

        const errors = [];

        if (!isEmail(email)) {
            errors.push('invalid email address.');
        }

        if (!isNotEmpty(password) || !hasMinLength(password, 6)) {
            errors.push('you must provide a password with at least 6 characters');
        }

        if (!isEqualToOtherValue(password, confirmPassword)) {
            errors.push('passwords do not match');
        }

        if (!isNotEmpty(firstName) || !isNotEmpty(lastName)) {
            errors.push('please provide both your first and last name');
        }

        if (!checkboxInput) {
            errors.push('you must agree to the terms and conditions');
        }

        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }

        setValidationErrors([]);

        // This payload schema maps directly to your database column naming scheme
        const newUser = {
            email: email,
            user_password: password,
            confirm_password: confirmPassword,
            first_name: firstName,
            last_name: lastName,
            checkbox: checkboxInput === 'on'
        };

        // 2. REMOVED: The client-side array search has been deleted for efficiency and security

        try {
            const response = await fetch(
                "http://localhost:5285/api/RegisteredUsers",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newUser)
                }
            );

            console.log("Status:", response.status);

            // 3. ADDED: Catch if the C# server rejects the email due to a duplicate record entry
            if (response.status === 409) {
                setValidationErrors(['This email address is already registered. Please login instead.']);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to add registered user');
            }

            const registered_user_data = await response.json();
            console.log('registered user added:', registered_user_data);

            
            //await loadRegisteredUsers();

            
            event.target.reset();
            showLogin();

        } catch (error) {
            console.error('Error adding registered user:', error);
            setValidationErrors(['Failed to establish a network connection to the server.']);
        }
    }

    return (
        <>
            <div id='register-page' >
                <div id='register'>
                    <h1>Register</h1>
                    <form onSubmit={handleRegisterSubmit}>
                        <div id='register-inputs'>
                            <div id='email-input'>
                                <label>Email:</label>
                                <input required type='text' name="email" placeholder='Enter username or email'></input>
                            </div>
                            <div id='password-inputs'>
                                <label>Password:</label>
                                <input required type='password' name='password' placeholder='Enter Password'></input>
                                <label>Confirm Password:</label>
                                <input required type='password' name='confirmpassword' placeholder='Enter Password'></input>
                            </div>
                            <div id='name-inputs'>
                                <label>First Name:</label>
                                <input required type='text' name='firstname' placeholder='Enter First Name'></input>
                                <label>Last Name:</label>
                                <input required type='text' name="lastname" placeholder='Enter Last Name'></input>
                            </div>
                            <div id='checkbox-inputs'>
                                <input required id='checkbox' type='checkbox' name='checkboxinput' />
                                <label>I agree to the terms and conditions.</label>
                            </div>
                        </div>
                        <div id='register-buttons'>
                            <button type='button' onClick={showLogin}>Back to Login</button>
                            <button type='submit'>Sign up</button>
                        </div>
                        <div>
                            <ul style={{ color: 'red', listStyleType: "none" }}>
                                {validationErrors.map((error, index) => {
                                    return (<li key={index}>{error}</li>)
                                })}
                            </ul>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
