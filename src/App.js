import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from './firebase';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CharacterSheet from './components/CharacterSheet';
import MasterInterface from './components/MasterInterface';
import ArchetypeSelector from './components/ArchetypeSelector';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showArchetypeSelector, setShowArchetypeSelector] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const [hasCharacter, setHasCharacter] = useState(false);

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
    
    // Se for jogador, verificar se já tem personagem
    if (tableData.role === 'player') {
      const characterRef = ref(database, `tables/${tableData.tableId}/characters/${tableData.userId}`);
      onValue(characterRef, (snapshot) => {
        if (snapshot.exists()) {
          const charData = snapshot.val();
          // Verificar se já tem arquétipo definido
          if (charData.arquetipo && charData.arquetipo !== '' && charData.arquetipo !== 'Selecione o Arquetipo') {
            setHasCharacter(true);
            setShowArchetypeSelector(false);
          } else {
            // Primeira vez ou sem arquétipo - mostrar seletor
            setHasCharacter(false);
            setShowArchetypeSelector(true);
          }
        } else {
          // Novo personagem - mostrar seletor
          setHasCharacter(false);
          setShowArchetypeSelector(true);
        }
      }, { onlyOnce: true });
    }
  };

  const handleBackToDashboard = () => {
    setSelectedTable(null);
    setShowArchetypeSelector(false);
    setSelectedArchetype(null);
    setHasCharacter(false);
  };

  const handleSelectArchetype = (archetype) => {
    setSelectedArchetype(archetype);
    setShowArchetypeSelector(false);
    setHasCharacter(true);
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
      
      {/* Mostrar seletor de arquétipo para jogadores na primeira vez */}
      {selectedTable.role === 'player' && showArchetypeSelector && (
        <ArchetypeSelector onSelectArchetype={handleSelectArchetype} />
      )}
      
      {selectedTable.role === 'master' ? (
        <MasterInterface user={selectedTable} />
      ) : (
        hasCharacter && <CharacterSheet user={selectedTable} initialArchetype={selectedArchetype} />
      )}
    </div>
  );
}

export default App;
