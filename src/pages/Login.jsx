import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import useStore from '../store/store.js';
import { useNavigate } from 'react-router-dom';

function Login() {
  const login = useStore((state) => state.login);
  const navigate = useNavigate();
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCheckingToken(false);
      return;
    }

    fetch('http://localhost:3001/api/auth/validate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Token inválido');
        return res.json();
      })
      .then(data => {
        if (data.valid) {
          login(data.user);
          console.log(data.user);
          navigate('/Home');
        } else {
          localStorage.removeItem('token');
          navigate('/');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/');
      })
      .finally(() => {
        setCheckingToken(false);
      });
  }, [login, navigate]);

  const handleLoginSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;

    const res = await fetch('http://localhost:3001/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      credentials: 'include'
    });

    const data = await res.json();
    login(data.user);
    localStorage.setItem('token', data.token);
    console.log('Login backend response:', data);
    navigate('/Home');
  };

  if (checkingToken) return <div>Verificando login...</div>;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '470px',
        backgroundColor: '#2F2F2F',
        flexDirection: 'column',
        borderRadius: '20px'

      }}
    >
      <h2 style={{ fontFamily: 'Inter, sans-serif', marginBottom: '20px' }}>

      </h2>
      <h2 style={{ fontFamily: 'Inter, sans-serif', marginBottom: '20px', textAlign: 'center' }}>
        Olá! Seja bem-vindo(a) ao FaceApp, para iniciar clique no botão abaixo
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
