import React, { useState, useEffect } from 'react';
import { ref, onValue, set, push } from 'firebase/database';
import { database } from '../firebase';
import MonsterSheet from './MonsterSheet';
import DiceRoller from './DiceRoller';
import './MasterInterface.css';

const MasterInterface = ({ user }) => {
  const [characters, setCharacters] = useState([]);
  const [rolls, setRolls] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('rolls'); // rolls, characters, notes, monsters, masterRoll
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

  const updateCharacterResource = (charId, resourcePath, newValue) => {
    const characterRef = ref(database, `tables/${user.tableId}/characters/${charId}/${resourcePath}`);
    set(characterRef, newValue);
  };

  const adjustCharacterValue = (charId, field, currentValue, increase, max) => {
    let newValue = currentValue || 0;
    
    if (increase && newValue < max) {
      newValue++;
    } else if (!increase && newValue > 0) {
      newValue--;
    }

    updateCharacterResource(charId, field, newValue);
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
                    <span>Ferida:</span>
                    <span className="resource-count">
                      {char.ferida || 0} / 5
                    </span>
                  </div>
                  <div className="resource-item">
                    <span>Sequela:</span>
                    <span className="resource-count">
                      {char.sequela || 0} / 5
                    </span>
                  </div>
                  <div className="resource-item">
                    <span>Marcadores:</span>
                    <span className="resource-count">
                      {char.marcadores || 0}
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
                <p><strong>Pronomes:</strong> {selectedCharacter.pronomes || 'Não definido'}</p>
                <p><strong>Intérprete:</strong> {selectedCharacter.interprete}</p>
                <p><strong>Arquétipo:</strong> {selectedCharacter.arquetipo}</p>
              </div>

              <div className="modal-section">
                <h3>Recursos</h3>
                <div className="master-resource-control">
                  <div className="resource-control-row">
                    <label>Ferida:</label>
                    <div className="resource-controls-inline">
                      <button 
                        className="resource-btn-master decrease"
                        onClick={() => adjustCharacterValue(selectedCharacter.id, 'ferida', selectedCharacter.ferida, false, 5)}
                        title="Diminuir Ferida"
                      >−</button>
                      <span className="resource-value">
                        {selectedCharacter.ferida || 0} / 5
                      </span>
                      <button 
                        className="resource-btn-master increase"
                        onClick={() => adjustCharacterValue(selectedCharacter.id, 'ferida', selectedCharacter.ferida, true, 5)}
                        title="Aumentar Ferida"
                      >+</button>
                    </div>
                  </div>
                  
                  <div className="resource-control-row">
                    <label>Sequela:</label>
                    <div className="resource-controls-inline">
                      <button 
                        className="resource-btn-master decrease"
                        onClick={() => adjustCharacterValue(selectedCharacter.id, 'sequela', selectedCharacter.sequela, false, 5)}
                        title="Diminuir Sequela"
                      >−</button>
                      <span className="resource-value">
                        {selectedCharacter.sequela || 0} / 5
                      </span>
                      <button 
                        className="resource-btn-master increase"
                        onClick={() => adjustCharacterValue(selectedCharacter.id, 'sequela', selectedCharacter.sequela, true, 5)}
                        title="Aumentar Sequela"
                      >+</button>
                    </div>
                  </div>
                  
                  <div className="resource-control-row">
                    <label>Marcadores:</label>
                    <div className="resource-controls-inline">
                      <button 
                        className="resource-btn-master decrease"
                        onClick={() => adjustCharacterValue(selectedCharacter.id, 'marcadores', selectedCharacter.marcadores, false, 99)}
                        title="Diminuir Marcadores"
                      >−</button>
                      <span className="resource-value">
                        {selectedCharacter.marcadores || 0}
                      </span>
                      <button 
                        className="resource-btn-master increase"
                        onClick={() => adjustCharacterValue(selectedCharacter.id, 'marcadores', selectedCharacter.marcadores, true, 99)}
                        title="Aumentar Marcadores"
                      >+</button>
                    </div>
                  </div>

                  <div className="resource-control-row">
                    <label>Tensão:</label>
                    <div className="resource-controls-inline">
                      <button 
                        className="resource-btn-master decrease"
                        onClick={() => adjustCharacterValue(selectedCharacter.id, 'tensao', selectedCharacter.tensao, false, 99)}
                        title="Diminuir Tensão"
                      >−</button>
                      <span className="resource-value">
                        {selectedCharacter.tensao || 0}
                      </span>
                      <button 
                        className="resource-btn-master increase"
                        onClick={() => adjustCharacterValue(selectedCharacter.id, 'tensao', selectedCharacter.tensao, true, 99)}
                        title="Aumentar Tensão"
                      >+</button>
                    </div>
                  </div>

                  <div className="resource-control-row">
                    <label>Dificuldade:</label>
                    <div className="resource-controls-inline">
                      <button 
                        className="resource-btn-master decrease"
                        onClick={() => adjustCharacterValue(selectedCharacter.id, 'dificuldade', selectedCharacter.dificuldade, false, 6)}
                        title="Diminuir Dificuldade"
                      >−</button>
                      <span className="resource-value">
                        {selectedCharacter.dificuldade || 3}
                      </span>
                      <button 
                        className="resource-btn-master increase"
                        onClick={() => adjustCharacterValue(selectedCharacter.id, 'dificuldade', selectedCharacter.dificuldade, true, 6)}
                        title="Aumentar Dificuldade"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Habilidades Selecionadas</h3>
                {selectedCharacter.habilidadesSelecionadas && selectedCharacter.habilidadesSelecionadas.length > 0 ? (
                  <div className="habilidades-display">
                    {selectedCharacter.habilidadesSelecionadas.map((hab, i) => (
                      <div key={i} className="habilidade-display">
                        <h4>{typeof hab.nome === 'string' ? hab.nome : JSON.stringify(hab.nome)}</h4>
                        <p>{typeof hab.descricao === 'string' ? hab.descricao : JSON.stringify(hab.descricao)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Nenhuma habilidade selecionada</p>
                )}
                {selectedCharacter.cicatrizAdicionada && (
                  <div className="cicatriz-display">
                    <h4>Cicatriz Adicionada</h4>
                  </div>
                )}
              </div>

              <div className="modal-section">
                <h3>Apegos</h3>
                <p><strong>Item Icônico:</strong> {selectedCharacter.itemIconico || 'Não definido'}</p>
                <p><strong>Relação Afetiva:</strong> {selectedCharacter.relacaoAfetiva || 'Não definido'}</p>
                <p><strong>Desejo Obscuro:</strong> {selectedCharacter.desejoObscuro || 'Não definido'}</p>
              </div>

              <div className="modal-section full-width">
                <h3>Anotações</h3>
                <p style={{whiteSpace: 'pre-wrap'}}>{selectedCharacter.anotacoes || 'Nenhuma anotação'}</p>
              </div>

              {selectedCharacter.imagemPersonagem && (
                <div className="modal-section">
                  <h3>Aparência</h3>
                  <img src={selectedCharacter.imagemPersonagem} alt="Personagem" className="character-image" />
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

  const renderMasterRoll = () => (
    <div className="master-roll-panel">
      <h2>Rolagem do Mestre</h2>
      <div className="master-roll-info">
        <p>🎲 Use este espaço para fazer rolagens em nome de NPCs, Killers ou testes secretos.</p>
        <p>⚠️ As rolagens aparecerão no histórico visível para todos os jogadores.</p>
      </div>
      <div className="master-dice-roller">
        <DiceRoller 
          user={{
            tableId: user.tableId,
            userId: user.userId,
            email: user.email,
            username: user.username,
            role: 'master'
          }} 
          monsters={monsters}
        />
      </div>
    </div>
  );

  const renderMonsters = () => (
    <div className="monsters-panel">
      <div className="monsters-header">
        <h2>Killers</h2>
        <button onClick={createMonster} className="create-monster-btn">
          + Novo Killer
        </button>
      </div>
      {monsters.length === 0 ? (
        <p className="empty-message">Nenhum Killer criado ainda</p>
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
                {monster.descricao ? monster.descricao.substring(0, 100) + '...' : monster.ameacas ? monster.ameacas.substring(0, 100) + '...' : 'Sem descrição'}
              </p>
              <div className="monster-resources">
                <span>PH: {monster.pontosHorror || 0}</span>
                <span>Armadilhas: {monster.armadilhas?.filter(d => d).length || 0}/4</span>
                <span>Sustos: {monster.sustos?.filter(d => d).length || 0}/5</span>
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
          📊 Histórico
        </button>
        <button 
          className={`tab ${activeTab === 'masterRoll' ? 'active' : ''}`}
          onClick={() => setActiveTab('masterRoll')}
        >
          🎲 Rolar Dados
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
          👹 Killers
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
        {activeTab === 'masterRoll' && renderMasterRoll()}
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
