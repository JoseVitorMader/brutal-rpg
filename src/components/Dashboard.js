import React, { useState, useEffect } from 'react';
import { ref, push, set, onValue, get } from 'firebase/database';
import { database } from '../firebase';
import './Dashboard.css';

const Dashboard = ({ user, onSelectTable, onLogout }) => {
  const [myTables, setMyTables] = useState([]);
  const [myCharacters, setMyCharacters] = useState([]);
  const [showCreateTable, setShowCreateTable] = useState(false);
  const [showJoinTable, setShowJoinTable] = useState(false);
  const [showEditTable, setShowEditTable] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTransferOwnership, setShowTransferOwnership] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [newTableName, setNewTableName] = useState('');
  const [newTableDescription, setNewTableDescription] = useState('');
  const [joinTableId, setJoinTableId] = useState('');
  const [transferToUserId, setTransferToUserId] = useState('');
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

  const openEditTable = (table) => {
    setSelectedTable(table);
    setNewTableName(table.name);
    setNewTableDescription(table.description || '');
    setShowEditTable(true);
  };

  const editTable = async () => {
    if (!newTableName.trim()) {
      alert('Digite um nome para a mesa');
      return;
    }

    try {
      const tableRef = ref(database, `tables/${selectedTable.id}`);
      await set(tableRef.child('name'), newTableName);
      await set(tableRef.child('description'), newTableDescription);

      setShowEditTable(false);
      setNewTableName('');
      setNewTableDescription('');
      setSelectedTable(null);
      alert('Mesa atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao editar mesa:', error);
      alert('Erro ao editar mesa');
    }
  };

  const openDeleteConfirm = (table) => {
    setSelectedTable(table);
    setShowDeleteConfirm(true);
  };

  const deleteTable = async () => {
    try {
      const tableRef = ref(database, `tables/${selectedTable.id}`);
      await set(tableRef, null);

      setShowDeleteConfirm(false);
      setSelectedTable(null);
      alert('Mesa excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir mesa:', error);
      alert('Erro ao excluir mesa');
    }
  };

  const openTransferOwnership = (table) => {
    setSelectedTable(table);
    setTransferToUserId('');
    setShowTransferOwnership(true);
  };

  const transferOwnership = async () => {
    if (!transferToUserId) {
      alert('Selecione um membro');
      return;
    }

    try {
      // Atualizar papel do novo mestre
      await set(ref(database, `tables/${selectedTable.id}/members/${transferToUserId}/role`), 'master');
      
      // Atualizar papel do antigo mestre para jogador
      await set(ref(database, `tables/${selectedTable.id}/members/${user.uid}/role`), 'player');
      
      // Atualizar createdBy
      await set(ref(database, `tables/${selectedTable.id}/createdBy`), transferToUserId);

      setShowTransferOwnership(false);
      setSelectedTable(null);
      setTransferToUserId('');
      alert('Posse transferida com sucesso!');
    } catch (error) {
      console.error('Erro ao transferir posse:', error);
      alert('Erro ao transferir posse');
    }
  };

  const openLeaveConfirm = (table) => {
    setSelectedTable(table);
    setShowLeaveConfirm(true);
  };

  const leaveTable = async () => {
    try {
      // Remover membro da mesa
      await set(ref(database, `tables/${selectedTable.id}/members/${user.uid}`), null);
      
      // Remover personagem se existir
      await set(ref(database, `tables/${selectedTable.id}/characters/${user.uid}`), null);

      setShowLeaveConfirm(false);
      setSelectedTable(null);
      alert('Você saiu da mesa');
    } catch (error) {
      console.error('Erro ao sair da mesa:', error);
      alert('Erro ao sair da mesa');
    }
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
                    <div className="table-actions">
                      <button onClick={() => handleSelectTable(table)} className="enter-table-btn">
                        Entrar na Mesa
                      </button>
                      {table.role === 'master' && (
                        <div className="table-management">
                          <button onClick={() => openEditTable(table)} className="mgmt-btn edit" title="Editar Mesa">
                            ✏️
                          </button>
                          <button onClick={() => openTransferOwnership(table)} className="mgmt-btn transfer" title="Transferir Posse">
                            👑
                          </button>
                          <button onClick={() => openDeleteConfirm(table)} className="mgmt-btn delete" title="Excluir Mesa">
                            🗑️
                          </button>
                        </div>
                      )}
                      {table.role === 'player' && (
                        <button onClick={() => openLeaveConfirm(table)} className="leave-table-btn" title="Sair da Mesa">
                          🚪 Sair
                        </button>
                      )}
                    </div>
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

      {/* Modal Editar Mesa */}
      {showEditTable && (
        <div className="modal-overlay" onClick={() => setShowEditTable(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Mesa</h2>
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
              <div className="modal-actions">
                <button onClick={() => setShowEditTable(false)} className="cancel-btn">
                  Cancelar
                </button>
                <button onClick={editTable} className="confirm-btn">
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Excluir Mesa */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>⚠️ Excluir Mesa</h2>
            <div className="modal-form">
              <p className="modal-warning">
                Tem certeza que deseja excluir a mesa <strong>{selectedTable?.name}</strong>?
              </p>
              <p className="modal-warning">
                ⚠️ Esta ação não pode ser desfeita! Todos os personagens e dados da mesa serão perdidos.
              </p>
              <div className="modal-actions">
                <button onClick={() => setShowDeleteConfirm(false)} className="cancel-btn">
                  Cancelar
                </button>
                <button onClick={deleteTable} className="delete-confirm-btn">
                  Excluir Mesa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Transferir Posse */}
      {showTransferOwnership && (
        <div className="modal-overlay" onClick={() => setShowTransferOwnership(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>👑 Transferir Posse da Mesa</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Selecione o Novo Mestre *</label>
                <select
                  value={transferToUserId}
                  onChange={(e) => setTransferToUserId(e.target.value)}
                  className="member-select"
                >
                  <option value="">-- Selecione um membro --</option>
                  {selectedTable && Object.entries(selectedTable.members || {}).map(([uid, member]) => {
                    if (uid !== user.uid) {
                      return (
                        <option key={uid} value={uid}>
                          {member.displayName} ({member.role === 'master' ? 'Mestre' : 'Jogador'})
                        </option>
                      );
                    }
                    return null;
                  })}
                </select>
              </div>
              <p className="modal-info">
                👑 O membro selecionado se tornará o novo mestre da mesa.
              </p>
              <p className="modal-info">
                🎭 Você será rebaixado para jogador.
              </p>
              <div className="modal-actions">
                <button onClick={() => setShowTransferOwnership(false)} className="cancel-btn">
                  Cancelar
                </button>
                <button onClick={transferOwnership} className="confirm-btn">
                  Transferir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sair da Mesa */}
      {showLeaveConfirm && (
        <div className="modal-overlay" onClick={() => setShowLeaveConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🚪 Sair da Mesa</h2>
            <div className="modal-form">
              <p className="modal-warning">
                Tem certeza que deseja sair da mesa <strong>{selectedTable?.name}</strong>?
              </p>
              <p className="modal-warning">
                ⚠️ Seu personagem será removido e você não poderá mais acessar esta mesa.
              </p>
              <div className="modal-actions">
                <button onClick={() => setShowLeaveConfirm(false)} className="cancel-btn">
                  Cancelar
                </button>
                <button onClick={leaveTable} className="delete-confirm-btn">
                  Sair da Mesa
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
