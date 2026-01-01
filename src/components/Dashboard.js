import React, { useState, useEffect } from 'react';
import { ref, push, set, onValue, get } from 'firebase/database';
import { database } from '../firebase';
import './Dashboard.css';

const Dashboard = ({ user, onSelectTable, onLogout }) => {
  const [myTables, setMyTables] = useState([]);
  const [myCharacters, setMyCharacters] = useState([]);
  const [showCreateTable, setShowCreateTable] = useState(false);
  const [showJoinTable, setShowJoinTable] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableDescription, setNewTableDescription] = useState('');
  const [joinTableId, setJoinTableId] = useState('');
  const [activeTab, setActiveTab] = useState('tables'); // tables, characters

  useEffect(() => {
    // Buscar mesas do usuário
    const tablesRef = ref(database, 'tables');
    const unsubscribeTables = onValue(tablesRef, (snapshot) => {
      const tables = [];
      if (snapshot.exists()) {
        snapshot.forEach((tableSnapshot) => {
          const tableData = tableSnapshot.val();
          const tableId = tableSnapshot.key;
          
          // Verificar se o usuário está nesta mesa
          if (tableData.members && tableData.members[user.uid]) {
            tables.push({
              id: tableId,
              ...tableData,
              role: tableData.members[user.uid].role
            });
          }
        });
      }
      setMyTables(tables);
    });

    // Buscar personagens do usuário
    const charactersRef = ref(database, 'tables');
    const unsubscribeCharacters = onValue(charactersRef, (snapshot) => {
      const characters = [];
      if (snapshot.exists()) {
        snapshot.forEach((tableSnapshot) => {
          const tableId = tableSnapshot.key;
          const characterRef = tableSnapshot.child(`characters/${user.uid}`);
          
          if (characterRef.exists()) {
            characters.push({
              tableId: tableId,
              tableName: tableSnapshot.val().name,
              ...characterRef.val()
            });
          }
        });
      }
      setMyCharacters(characters);
    });

    return () => {
      unsubscribeTables();
      unsubscribeCharacters();
    };
  }, [user.uid]);

  const createTable = async () => {
    if (!newTableName.trim()) {
      alert('Digite um nome para a mesa');
      return;
    }

    try {
      const tablesRef = ref(database, 'tables');
      const newTableRef = push(tablesRef);
      
      await set(newTableRef, {
        name: newTableName,
        description: newTableDescription,
        createdBy: user.uid,
        createdAt: Date.now(),
        members: {
          [user.uid]: {
            role: 'master',
            displayName: user.email.split('@')[0],
            joinedAt: Date.now()
          }
        }
      });

      setShowCreateTable(false);
      setNewTableName('');
      setNewTableDescription('');
      alert('Mesa criada com sucesso! Você é o mestre.');
    } catch (error) {
      console.error('Erro ao criar mesa:', error);
      alert('Erro ao criar mesa');
    }
  };

  const joinTable = async () => {
    if (!joinTableId.trim()) {
      alert('Digite o ID da mesa');
      return;
    }

    try {
      const tableRef = ref(database, `tables/${joinTableId}`);
      const snapshot = await get(tableRef);

      if (!snapshot.exists()) {
        alert('Mesa não encontrada');
        return;
      }

      const tableData = snapshot.val();
      
      // Verificar se já está na mesa
      if (tableData.members && tableData.members[user.uid]) {
        alert('Você já está nesta mesa');
        return;
      }

      // Adicionar como jogador
      await set(ref(database, `tables/${joinTableId}/members/${user.uid}`), {
        role: 'player',
        displayName: user.email.split('@')[0],
        joinedAt: Date.now()
      });

      setShowJoinTable(false);
      setJoinTableId('');
      alert('Você entrou na mesa como jogador!');
    } catch (error) {
      console.error('Erro ao entrar na mesa:', error);
      alert('Erro ao entrar na mesa');
    }
  };

  const handleSelectTable = (table) => {
    onSelectTable({
      tableId: table.id,
      tableName: table.name,
      role: table.role,
      userId: user.uid,
      email: user.email
    });
  };

  const copyTableId = (tableId) => {
    navigator.clipboard.writeText(tableId);
    alert('ID da mesa copiado! Compartilhe com seus jogadores.');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>BRUTAL RPG</h1>
        <div className="user-info">
          <span>👤 {user.email}</span>
          <button onClick={onLogout} className="logout-btn">Sair</button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'tables' ? 'active' : ''}
          onClick={() => setActiveTab('tables')}
        >
          🎲 Minhas Mesas
        </button>
        <button
          className={activeTab === 'characters' ? 'active' : ''}
          onClick={() => setActiveTab('characters')}
        >
          📋 Minhas Fichas
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'tables' && (
          <div className="tables-section">
            <div className="section-actions">
              <button onClick={() => setShowCreateTable(true)} className="action-btn primary">
                ➕ Criar Mesa
              </button>
              <button onClick={() => setShowJoinTable(true)} className="action-btn secondary">
                🚪 Entrar em Mesa
              </button>
            </div>

            {myTables.length === 0 ? (
              <div className="empty-state">
                <p>Você ainda não participa de nenhuma mesa</p>
                <p>Crie uma nova mesa ou entre em uma existente!</p>
              </div>
            ) : (
              <div className="tables-grid">
                {myTables.map(table => (
                  <div key={table.id} className="table-card">
                    <div className="table-header">
                      <h3>{table.name}</h3>
                      <span className={`role-badge ${table.role}`}>
                        {table.role === 'master' ? '🎩 Mestre' : '🎭 Jogador'}
                      </span>
                    </div>
                    <p className="table-description">
                      {table.description || 'Sem descrição'}
                    </p>
                    <div className="table-info">
                      <span>👥 {Object.keys(table.members || {}).length} membro(s)</span>
                      <span className="table-id" onClick={() => copyTableId(table.id)}>
                        📋 ID: {table.id.substring(0, 8)}...
                      </span>
                    </div>
                    <button onClick={() => handleSelectTable(table)} className="enter-table-btn">
                      Entrar na Mesa
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'characters' && (
          <div className="characters-section">
            {myCharacters.length === 0 ? (
              <div className="empty-state">
                <p>Você ainda não criou nenhum personagem</p>
                <p>Entre em uma mesa e crie sua ficha!</p>
              </div>
            ) : (
              <div className="characters-grid">
                {myCharacters.map((char, index) => (
                  <div key={index} className="character-card">
                    <div className="char-header">
                      <h3>{char.nome || 'Sem Nome'}</h3>
                      <span className="char-archetype">{char.arquetipo || 'Sem Arquétipo'}</span>
                    </div>
                    {char.aparencia && (
                      <div className="char-image">
                        <img src={char.aparencia} alt={char.nome} />
                      </div>
                    )}
                    <div className="char-info">
                      <p><strong>Mesa:</strong> {char.tableName}</p>
                      <p><strong>Intérprete:</strong> {char.interprete}</p>
                      <p><strong>Tensão:</strong> {char.tensao || 0}</p>
                    </div>
                    <div className="char-resources">
                      <span>🎲 Dados: {char.pilhaDados?.filter(d => d).length || 0}/6</span>
                      <span>🏃 Fuga: {char.pilhaFuga?.filter(d => d).length || 0}/7</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Criar Mesa */}
      {showCreateTable && (
        <div className="modal-overlay" onClick={() => setShowCreateTable(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Nova Mesa</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Nome da Mesa *</label>
                <input
                  type="text"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="Ex: Campanha de Terror"
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={newTableDescription}
                  onChange={(e) => setNewTableDescription(e.target.value)}
                  placeholder="Descreva sua campanha..."
                  rows="4"
                />
              </div>
              <p className="modal-info">
                🎩 Você será o mestre desta mesa
              </p>
              <div className="modal-actions">
                <button onClick={() => setShowCreateTable(false)} className="cancel-btn">
                  Cancelar
                </button>
                <button onClick={createTable} className="confirm-btn">
                  Criar Mesa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Entrar em Mesa */}
      {showJoinTable && (
        <div className="modal-overlay" onClick={() => setShowJoinTable(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Entrar em Mesa</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>ID da Mesa *</label>
                <input
                  type="text"
                  value={joinTableId}
                  onChange={(e) => setJoinTableId(e.target.value)}
                  placeholder="Cole o ID da mesa aqui"
                />
              </div>
              <p className="modal-info">
                🎭 Você entrará como jogador nesta mesa
              </p>
              <div className="modal-actions">
                <button onClick={() => setShowJoinTable(false)} className="cancel-btn">
                  Cancelar
                </button>
                <button onClick={joinTable} className="confirm-btn">
                  Entrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
