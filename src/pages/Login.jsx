import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import useStore from '../store/store.js';
import { useNavigate } from 'react-router-dom';

function Login() {
  const login = useStore((state) => state.login);
  const navigate = useNavigate();
  const [checkingToken, setCheckingToken] = useState(true); // controle de carregamento

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
          console.log(data.user)
          navigate('/Home');
        } else {
            localStorage.removeItem('token');
            navigate("/")
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate("/")

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
    console.log(data.user)
    localStorage.setItem('token', data.token);
    navigate("/Home");
    console.log('Login backend response:', data);
  };


  return (
    <>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.log('Login failed')}
      />
    </>
  );
}

export default Login;
