import React, { useState } from 'react';

function LoginFormAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

      // Stocke le token JWT dans le localStorage pour une utilisation future
      localStorage.setItem('adminToken', data.token);
      setIsLoggedIn(true);
      console.log('Admin connecté, token reçu :', data.token);

      // Redirection vers un dashboard admin
      // navigate('/admin/dashboard'); ← si tu utilises React Router
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>DIDA SKIN</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email :</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe :</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {isLoggedIn && <p style={{ color: 'green' }}>Connecté en tant qu’admin !</p>}
      </form>
    </div>
  );
}

export default LoginFormAdmin;
