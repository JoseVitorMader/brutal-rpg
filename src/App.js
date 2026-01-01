import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CharacterSheet from './components/CharacterSheet';
import MasterInterface from './components/MasterInterface';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setSelectedTable(null);
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const handleSelectTable = (tableData) => {
    setSelectedTable(tableData);
  };

  const handleBackToDashboard = () => {
    setSelectedTable(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <h1>BRUTAL RPG</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  if (!selectedTable) {
    return (
      <Dashboard 
        user={user} 
        onSelectTable={handleSelectTable}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="App">
      <div className="app-header">
        <button onClick={handleBackToDashboard} className="back-button">
          ← Voltar ao Dashboard
        </button>
        <h2>
          {selectedTable.tableName} - {selectedTable.role === 'master' ? 'Mestre' : 'Jogador'}
        </h2>
        <button onClick={handleLogout} className="logout-button">
          Sair
        </button>
      </div>
      {selectedTable.role === 'master' ? (
        <MasterInterface user={selectedTable} />
      ) : (
        <CharacterSheet user={selectedTable} />
      )}
    </div>
  );
}

export default App;
