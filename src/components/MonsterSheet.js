import React, { useState } from 'react';
import './MonsterSheet.css';

const MonsterSheet = ({ monster, onUpdate, onClose }) => {
  const [monsterData, setMonsterData] = useState(monster || {
    nome: '',
    descricao: '',
    aparencia: '',
    pericias: {
      Agilidade: { treinada: false },
      Astúcia: { treinada: false },
      Força: { treinada: false },
      Carisma: { treinada: false },
      Vigor: { treinada: false }
    },
    pilhaDados: Array(6).fill(false),
    ferida: {
      descricao: '',
      niveis: Array(5).fill(false)
    },
    habilidadesEspeciais: '',
    fraquezas: '',
    objetivo: ''
  });

  const updateMonster = (updates) => {
    const updated = { ...monsterData, ...updates };
    setMonsterData(updated);
    if (onUpdate) {
      onUpdate(updated);
    }
  };

  const toggleCheckbox = (path, index) => {
    const keys = path.split('.');
    const newData = { ...monsterData };
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    const lastKey = keys[keys.length - 1];
    if (Array.isArray(current[lastKey])) {
      current[lastKey][index] = !current[lastKey][index];
    } else {
      current[lastKey] = !current[lastKey];
    }
    
    updateMonster(newData);
  };

  return (
    <div className="monster-sheet-overlay" onClick={onClose}>
      <div className="monster-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="monster-header">
          <h2>Ficha de Criatura/NPC</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="monster-content">
          <div className="monster-section">
            <label>Nome da Criatura:</label>
            <input
              type="text"
              value={monsterData.nome}
              onChange={(e) => updateMonster({ nome: e.target.value })}
              placeholder="Ex: A Coisa na Floresta"
            />
          </div>

          <div className="monster-section">
            <label>Descrição:</label>
            <textarea
              value={monsterData.descricao}
              onChange={(e) => updateMonster({ descricao: e.target.value })}
              rows="3"
              placeholder="Aparência geral, comportamento, o que os jogadores veem..."
            />
          </div>

          <div className="monster-section">
            <label>Imagem (URL):</label>
            <input
              type="text"
              value={monsterData.aparencia}
              onChange={(e) => updateMonster({ aparencia: e.target.value })}
              placeholder="https://..."
            />
            {monsterData.aparencia && (
              <div className="monster-image-preview">
                <img src={monsterData.aparencia} alt="Criatura" />
              </div>
            )}
          </div>

          <div className="monster-section">
            <h3>Perícias</h3>
            {Object.keys(monsterData.pericias).map(pericia => (
              <label key={pericia} className="pericia-checkbox">
                <input
                  type="checkbox"
                  checked={monsterData.pericias[pericia].treinada}
                  onChange={() => {
                    const newPericias = {
                      ...monsterData.pericias,
                      [pericia]: { treinada: !monsterData.pericias[pericia].treinada }
                    };
                    updateMonster({ pericias: newPericias });
                  }}
                />
                {pericia}
              </label>
            ))}
          </div>

          <div className="monster-section">
            <h3>Pilha de Dados</h3>
            <div className="dice-checkboxes">
              {monsterData.pilhaDados.map((checked, i) => (
                <label key={i}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCheckbox('pilhaDados', i)}
                  />
                  D{i + 1}
                </label>
              ))}
            </div>
          </div>

          <div className="monster-section">
            <h3>Ferida</h3>
            <textarea
              value={monsterData.ferida.descricao}
              onChange={(e) => updateMonster({ 
                ferida: { ...monsterData.ferida, descricao: e.target.value }
              })}
              rows="2"
              placeholder="Descrição da ferida..."
            />
            <div className="dice-checkboxes">
              {monsterData.ferida.niveis.map((checked, i) => (
                <label key={i}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCheckbox('ferida.niveis', i)}
                  />
                  Nv {i + 1}
                </label>
              ))}
            </div>
          </div>

          <div className="monster-section">
            <label>Habilidades Especiais:</label>
            <textarea
              value={monsterData.habilidadesEspeciais}
              onChange={(e) => updateMonster({ habilidadesEspeciais: e.target.value })}
              rows="4"
              placeholder="Poderes, ataques especiais, imunidades..."
            />
          </div>

          <div className="monster-section">
            <label>Fraquezas:</label>
            <textarea
              value={monsterData.fraquezas}
              onChange={(e) => updateMonster({ fraquezas: e.target.value })}
              rows="3"
              placeholder="Como derrotar ou afastar a criatura..."
            />
          </div>

          <div className="monster-section">
            <label>Objetivo/Motivação:</label>
            <textarea
              value={monsterData.objetivo}
              onChange={(e) => updateMonster({ objetivo: e.target.value })}
              rows="3"
              placeholder="O que a criatura quer? Por que está aqui?"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonsterSheet;
