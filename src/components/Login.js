import React, { useState } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from '../firebase';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [tableId, setTableId] = useState('');
  const [role, setRole] = useState('player');

  const handleLogin = async () => {
    if (!username || !tableId) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const userId = `${tableId}_${username.replace(/\s/g, '_')}`;
    const userRef = ref(database, `tables/${tableId}/users/${userId}`);

    try {
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // Criar novo usuário
        await set(userRef, {
          username,
          role,
          tableId,
          createdAt: Date.now()
        });
      }

      onLogin({
        userId,
        username,
        tableId,
        role: snapshot.exists() ? snapshot.val().role : role
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao conectar ao servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>BRUTAL RPG</h1>
        <div className="login-form">
          <input
            type="text"
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="text"
            placeholder="ID da Mesa"
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
            className="login-input"
          />
          <div className="role-selector">
            <label>
              <input
                type="radio"
                value="player"
                checked={role === 'player'}
                onChange={(e) => setRole(e.target.value)}
              />
              Jogador
            </label>
            <label>
              <input
                type="radio"
                value="master"
                checked={role === 'master'}
                onChange={(e) => setRole(e.target.value)}
              />
              Mestre
            </label>
          </div>
          <button onClick={handleLogin} className="login-button">
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
