// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { clarity } from 'react-microsoft-clarity';

function App() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      clarity.init('s59v3im6b2'); // Substitua pelo seu Project ID do Clarity

      // Exemplo: identificar usuário autenticado
      // Troque 'USER_ID' pelo ID real do usuário, se disponível
      // clarity.identify('USER_ID', { role: 'admin' });
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Página pública de login */}
        <Route path="/" element={<Login />} />

        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
