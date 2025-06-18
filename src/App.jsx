import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';

function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    // Map route paths to page titles
    const titles = {
      '/': 'Login - Facelog',
      '/Home': 'Facelog',
    };

    // Default to a fallback title
    document.title = titles[location.pathname] || 'My App';
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <TitleManager />
      <Routes>
        {/* Public login page */}
        <Route path="/" element={<Login />} />

        {/* Protected route for /Home */}
        <Route element={<ProtectedRoute />}>
          <Route path="/Home" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
