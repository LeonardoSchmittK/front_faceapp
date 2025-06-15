import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import useStore from '../store/store.js';

function Login() {
  const login = useStore((state) => state.login);

  const handleLoginSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    console.log("RESPONSE\n", credentialResponse);

    const res = await fetch('http://localhost:3001/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      credentials: 'include',
    });

    const data = await res.json();
    login(data.user);
    localStorage.setItem('token', data.token);
    console.log('Login backend response:', data);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor:'#000000',
        flexDirection: 'column',
      }}
    >
      <h2 style={{ fontFamily: 'Inter, sans-serif', marginBottom: '20px' }}>

      </h2>

      <GoogleLogin
        theme="filled_black"
        size="large"
        onSuccess={handleLoginSuccess}
        onError={() => console.log('Login failed')}
      />
    </div>
  );
}

export default Login;
