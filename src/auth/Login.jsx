import { GoogleLogin } from '@react-oauth/google';
import useStore from '../store/store.js';

function Login() {
    const login = useStore((state) => state.login);


  const handleLoginSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    console.log("RESPONSE\n");
    console.log(credentialResponse);
    const res = await fetch(process.env.REACT_APP_PROD_URL_API_BASE + '/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      credentials: 'include' // se usar cookie de sessão
    });

    const data = await res.json();
    login(data.user)
    localStorage.setItem('token', data.token);
    console.log('Login backend response:', data);
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={() => console.log('Login failed')}
    />
  );
}


export default Login