import React, { useState, useEffect } from 'react';
import { ref, onValue, set, push } from 'firebase/database';
import { database } from '../firebase';
import MonsterSheet from './MonsterSheet';
import './MasterInterface.css';

const MasterInterface = ({ user }) => {
  const [characters, setCharacters] = useState([]);
  const [rolls, setRolls] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('rolls'); // rolls, characters, notes, monsters
  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [showMonsterSheet, setShowMonsterSheet] = useState(false);
  const [members, setMembers] = useState({});

  useEffect(() => {
    // Buscar membros da mesa
    const membersRef = ref(database, `tables/${user.tableId}/members`);
    const unsubscribeMembers = onValue(membersRef, (snapshot) => {
      if (snapshot.exists()) {
        setMembers(snapshot.val());
      }
    });

    // Buscar personagens da mesa
    const charactersRef = ref(database, `tables/${user.tableId}/characters`);
    const unsubscribeCharacters = onValue(charactersRef, (snapshot) => {
      if (snapshot.exists()) {
        const charsData = [];
        snapshot.forEach((childSnapshot) => {
          charsData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        setCharacters(charsData);
      }
    });

    // Buscar rolagens
    const rollsRef = ref(database, `tables/${user.tableId}/rolls`);
    const unsubscribeRolls = onValue(rollsRef, (snapshot) => {
      if (snapshot.exists()) {
        const rollsData = [];
        snapshot.forEach((childSnapshot) => {
          rollsData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        // Ordenar por timestamp mais recente
        rollsData.sort((a, b) => b.timestamp - a.timestamp);
        setRolls(rollsData);
      }
    });

    // Buscar monstros
    const monstersRef = ref(database, `tables/${user.tableId}/monsters`);
    const unsubscribeMonsters = onValue(monstersRef, (snapshot) => {
      if (snapshot.exists()) {
        const monstersData = [];
        snapshot.forEach((childSnapshot) => {
          monstersData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        setMonsters(monstersData);
      }
    });

    return () => {
      unsubscribeMembers();
      unsubscribeCharacters();
      unsubscribeRolls();
      unsubscribeMonsters();
    };
  }, [user.tableId]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const createMonster = () => {
    setSelectedMonster(null);
    setShowMonsterSheet(true);
  };

  const saveMonster = (monsterData) => {
    if (selectedMonster && selectedMonster.id) {
      // Atualizar monstro existente
      const monsterRef = ref(database, `tables/${user.tableId}/monsters/${selectedMonster.id}`);
      set(monsterRef, monsterData);
    } else {
      // Criar novo monstro
      const monstersRef = ref(database, `tables/${user.tableId}/monsters`);
      push(monstersRef, monsterData);
    }
    setShowMonsterSheet(false);
  };

  const editMonster = (monster) => {
    setSelectedMonster(monster);
    setShowMonsterSheet(true);
  };

  const renderRolls = () => (
    <div className="rolls-panel">
      <h2>Histórico de Rolagens</h2>
      {rolls.length === 0 ? (
        <p className="empty-message">Nenhuma rolagem ainda</p>
      ) : (
        <div className="rolls-list">
          {rolls.map(roll => (
            <div key={roll.id} className="roll-card">
              <div className="roll-header">
                <strong>{roll.nomePersonagem || 'Sem Nome'}</strong>
                <span className="roll-player">({roll.nomeJogador || 'Jogador'})</span>
                <span className="roll-time">{formatTimestamp(roll.timestamp)}</span>
              </div>
              <div className="roll-details">
                <p><strong>Perícia:</strong> {roll.pericia} {roll.treinada ? '(Treinada)' : ''}</p>
                <p><strong>Dados:</strong> {roll.numDados}</p>
                <div className="roll-dice-display">
                  {roll.dados.map((dado, index) => (
                    <span 
                      key={index}
                      className={`mini-dice ${dado >= roll.valorSucesso ? 'success' : 'failure'}`}
                    >
                      {dado}
                    </span>
                  ))}
                </div>
                <div className="roll-summary">
                  <span className="success-badge">✓ {roll.sucessos} Sucessos</span>
                  <span className="failure-badge">✗ {roll.fracassos} Fracassos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCharacters = () => (
    <div className="characters-panel">
      <h2>Fichas dos Jogadores</h2>
      <div className="characters-grid">
        {characters.length === 0 ? (
          <p className="empty-message">Nenhum personagem criado ainda</p>
        ) : (
          characters.map(char => (
            <div 
              key={char.id} 
              className="character-card"
              onClick={() => setSelectedCharacter(char)}
            >
              <h3>{char.nome || 'Sem Nome'}</h3>
              <div className="character-quick-info">
                <p><strong>Intérprete:</strong> {char.interprete}</p>
                <p><strong>Arquétipo:</strong> {char.arquetipo || 'Não definido'}</p>
                <p><strong>Tensão:</strong> {char.tensao || 0}</p>
                <div className="resource-bars">
                  <div className="resource-item">
                    <span>Dados:</span>
                    <span className="resource-count">
                      {char.pilhaDados?.filter(d => d).length || 0} / 6
                    </span>
                  </div>
                  <div className="resource-item">
                    <span>Fuga:</span>
                    <span className="resource-count">
                      {char.pilhaFuga?.filter(d => d).length || 0} / 7
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedCharacter && (
        <div className="character-modal" onClick={() => setSelectedCharacter(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedCharacter(null)}>×</button>
            <h2>{selectedCharacter.nome}</h2>
            
            <div className="modal-grid">
              <div className="modal-section">
                <h3>Informações Básicas</h3>
                <p><strong>Pronomes:</strong> {selectedCharacter.pronomes}</p>
                <p><strong>Intérprete:</strong> {selectedCharacter.interprete}</p>
                <p><strong>Arquétipo:</strong> {selectedCharacter.arquetipo}</p>
                <p><strong>Tensão:</strong> {selectedCharacter.tensao}</p>
              </div>

              <div className="modal-section">
                <h3>Apegos</h3>
                <p><strong>Item Icônico:</strong> {selectedCharacter.apegos?.itemIconico}</p>
                <p><strong>Relação Afetiva:</strong> {selectedCharacter.apegos?.relacaoAfetiva}</p>
                <p><strong>Desejo Obscuro:</strong> {selectedCharacter.apegos?.desejoObscuro}</p>
              </div>

              <div className="modal-section">
                <h3>Perícias</h3>
                {Object.entries(selectedCharacter.pericias || {}).map(([pericia, data]) => (
                  <p key={pericia}>
                    {pericia}: {data.treinada ? '✓ Treinada' : '○ Não treinada'}
                  </p>
                ))}
              </div>

              <div className="modal-section">
                <h3>Recursos</h3>
                <p><strong>Pilha de Dados:</strong> {selectedCharacter.pilhaDados?.filter(d => d).length || 0} / 6</p>
                <p><strong>Pilha de Fuga:</strong> {selectedCharacter.pilhaFuga?.filter(d => d).length || 0} / 7</p>
                <p><strong>Ferida:</strong> {selectedCharacter.ferida?.niveis?.filter(d => d).length || 0} / 5</p>
              </div>

              <div className="modal-section">
                <h3>Habilidades</h3>
                <p>{selectedCharacter.habilidades || 'Nenhuma habilidade descrita'}</p>
              </div>

              <div className="modal-section">
                <h3>Marcadores</h3>
                <p>{selectedCharacter.marcadores || 'Nenhum marcador'}</p>
              </div>

              {selectedCharacter.aparencia && (
                <div className="modal-section">
                  <h3>Aparência</h3>
                  <img src={selectedCharacter.aparencia} alt="Personagem" className="character-image" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderNotes = () => (
    <div className="notes-panel">
      <h2>Anotações do Mestre</h2>
      <textarea
        className="master-notes"
        placeholder="Digite suas anotações aqui..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows="20"
      />
      <div className="notes-info">
        <p>💡 Use este espaço para anotações de campanha, NPCs, eventos importantes, etc.</p>
      </div>
    </div>
  );

  const renderMonsters = () => (
    <div className="monsters-panel">
      <div className="monsters-header">
        <h2>Criaturas e NPCs</h2>
        <button onClick={createMonster} className="create-monster-btn">
          + Nova Criatura
        </button>
      </div>
      {monsters.length === 0 ? (
        <p className="empty-message">Nenhuma criatura criada ainda</p>
      ) : (
        <div className="monsters-grid">
          {monsters.map(monster => (
            <div key={monster.id} className="monster-card" onClick={() => editMonster(monster)}>
              <h3>{monster.nome || 'Sem Nome'}</h3>
              {monster.aparencia && (
                <div className="monster-mini-image">
                  <img src={monster.aparencia} alt={monster.nome} />
                </div>
              )}
              <p className="monster-description">
                {monster.descricao ? monster.descricao.substring(0, 100) + '...' : 'Sem descrição'}
              </p>
              <div className="monster-resources">
                <span>Dados: {monster.pilhaDados?.filter(d => d).length || 0}/6</span>
                <span>Ferida: {monster.ferida?.niveis?.filter(d => d).length || 0}/5</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="master-interface">
      <div className="master-header">
        <h1>Interface do Mestre</h1>
        <div className="table-info">
          <span>Mesa: {user.tableId}</span>
          <span>Mestre: {user.username}</span>
          <span>Jogadores: {characters.length}</span>
        </div>
      </div>

      <div className="master-tabs">
        <button 
          className={`tab ${activeTab === 'rolls' ? 'active' : ''}`}
          onClick={() => setActiveTab('rolls')}
        >
          🎲 Rolagens
        </button>
        <button 
          className={`tab ${activeTab === 'characters' ? 'active' : ''}`}
          onClick={() => setActiveTab('characters')}
        >
          📋 Fichas
        </button>
        <button 
          className={`tab ${activeTab === 'monsters' ? 'active' : ''}`}
          onClick={() => setActiveTab('monsters')}
        >
          👹 Criaturas
        </button>
        <button 
          className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          📝 Anotações
        </button>
      </div>

      <div className="master-content">
        {activeTab === 'rolls' && renderRolls()}
        {activeTab === 'characters' && renderCharacters()}
        {activeTab === 'monsters' && renderMonsters()}
        {activeTab === 'notes' && renderNotes()}
      </div>

      {showMonsterSheet && (
        <MonsterSheet
          monster={selectedMonster}
          onUpdate={saveMonster}
          onClose={() => setShowMonsterSheet(false)}
        />
      )}
    </div>
  );
};

export default MasterInterface;
