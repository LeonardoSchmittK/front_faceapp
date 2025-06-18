import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import useStore from '../store/store.js';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  Image,
  Spinner,
} from '@chakra-ui/react';

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
      .then((res) => {
        if (!res.ok) throw new Error('Token inválido');
        return res.json();
      })
      .then((data) => {
        if (data.valid) {
          login(data.user);
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
      credentials: 'include',
    });

    const data = await res.json();
    login(data.user);
    localStorage.setItem('token', data.token);
    navigate('/Home');
  };

  if (checkingToken) {
    return (
      <Flex minH="100vh" bg="black" justify="center" align="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex
      w="25vw"
      h="85vh"
      bgImage="url('/2f41a585-c673-45af-a421-882010d6b001.jpg')"
      bgSize="cover"
      bgPosition="center"
      align="center"
      justify="center"
    >
      <Box
        w="400px"
        h="400px"
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(12px)"
        WebkitBackdropFilter="blur(12px)"
        border="1px solid rgba(255, 255, 255, 0.3)"
        boxShadow="0 0 40px rgba(0, 0, 0, 0.4)"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={6}
      >
        <Image
          src="/logo faceAppNf.png"
          alt="Logo do FaceApp"
          boxSize="110px"
          mb={8}
          mt={-20}
          
        />
        <Heading fontSize="lg" color="white" mb={2} mt="-10" >
          Bem-vindo ao FaceApp
        </Heading>
        <Text color="gray.300" fontSize="sm" mb={4}>
          Acesse com sua conta Google para marcar presença
        </Text>
        <GoogleLogin
          size="large"
          onSuccess={handleLoginSuccess}
          onError={() => console.log('Login failed')}
        />
      </Box>
    </Flex>
  );
}

export default Login;
