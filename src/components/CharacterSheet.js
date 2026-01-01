import React, { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { database } from '../firebase';
import DiceRoller from './DiceRoller';
import './CharacterSheet.css';

const ARQUETIPOS = ['Atleta', 'Cética', 'Esbelto', 'Heroi', 'Inocente', 'Nerd', 'Relaxado', 'Valentona'];
const PERICIAS = ['Agilidade', 'Astúcia', 'Força', 'Carisma', 'Vigor'];

const CharacterSheet = ({ user }) => {
  const [character, setCharacter] = useState({
    nome: '',
    pronomes: '',
    interprete: user.email || '',
    arquetipo: '',
    apegos: {
      itemIconico: '',
      relacaoAfetiva: '',
      desejoObscuro: ''
    },
    pilhaDados: Array(6).fill(false),
    pilhaFuga: Array(7).fill(false),
    marcadores: '',
    ferida: {
      descricao: '',
      niveis: Array(5).fill(false)
    },
    pericias: {
      Agilidade: { treinada: false },
      Astúcia: { treinada: false },
      Força: { treinada: false },
      Carisma: { treinada: false },
      Vigor: { treinada: false }
    },
    habilidades: '',
    aparencia: '',
    tensao: 0,
    vantagensGerais: {
      choqueRealidade: false,
      cuidarFeridas: false,
      tomarJeito: false
    },
    vantagensEspecialidade: {
      ombroAmigo: false,
      adrenalina: false,
      cacarRecurso: false,
      prepararProxima: false,
      naoEsperaPorMim: false
    }
  });

  const characterRef = ref(database, `tables/${user.tableId}/characters/${user.userId}`);

  useEffect(() => {
    const unsubscribe = onValue(characterRef, (snapshot) => {
      if (snapshot.exists()) {
        setCharacter(prevChar => ({ ...prevChar, ...snapshot.val() }));
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.tableId, user.userId]);

  const updateCharacter = (updates) => {
    const updatedCharacter = { ...character, ...updates };
    setCharacter(updatedCharacter);
    set(characterRef, updatedCharacter);
  };

  const toggleCheckbox = (path, index) => {
    const keys = path.split('.');
    const newCharacter = { ...character };
    let current = newCharacter;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    const lastKey = keys[keys.length - 1];
    if (Array.isArray(current[lastKey])) {
      current[lastKey][index] = !current[lastKey][index];
    } else {
      current[lastKey] = !current[lastKey];
    }
    
    setCharacter(newCharacter);
    set(characterRef, newCharacter);
  };

  const togglePericiaTreinada = (pericia) => {
    const treinadas = Object.values(character.pericias).filter(p => p.treinada).length;
    const isCurrentlyTreinada = character.pericias[pericia].treinada;
    
    if (!isCurrentlyTreinada && treinadas >= 2) {
      alert('Você já tem 2 perícias treinadas (máximo permitido)');
      return;
    }

    const newPericias = {
      ...character.pericias,
      [pericia]: { treinada: !isCurrentlyTreinada }
    };
    
    updateCharacter({ pericias: newPericias });
  };

  const calcularTensaoGasta = () => {
    let total = 0;
    if (character.vantagensGerais.choqueRealidade) total += 6;
    if (character.vantagensGerais.cuidarFeridas) total += 1;
    if (character.vantagensGerais.tomarJeito) total += 3;
    if (character.vantagensEspecialidade.ombroAmigo) total += 2;
    if (character.vantagensEspecialidade.adrenalina) total += 2;
    if (character.vantagensEspecialidade.cacarRecurso) total += 3;
    if (character.vantagensEspecialidade.prepararProxima) total += 3;
    if (character.vantagensEspecialidade.naoEsperaPorMim) total += 3;
    return total;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Limitar tamanho do arquivo (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Arquivo muito grande! Máximo 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        updateCharacter({ aparencia: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="character-sheet">
      {/* Header Compacto */}
      <div className="sheet-header-compact">
        <div className="char-avatar">
          {character.aparencia ? (
            <img src={character.aparencia} alt={character.nome} />
          ) : (
            <div className="avatar-placeholder">?</div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="avatar-upload"
            id="avatar-upload"
          />
          <label htmlFor="avatar-upload" className="avatar-upload-label">📷</label>
        </div>
        
        <div className="char-identity">
          <div className="char-name-group">
            <label>PERSONAGEM</label>
            <input
              type="text"
              value={character.nome}
              onChange={(e) => updateCharacter({ nome: e.target.value })}
              placeholder="Miguel de Andrade"
              className="char-name-input"
            />
          </div>
          <div className="char-origin-group">
            <label>ORIGEM</label>
            <input
              type="text"
              value={character.pronomes}
              onChange={(e) => updateCharacter({ pronomes: e.target.value })}
              placeholder="Religioso"
              className="char-origin-input"
            />
          </div>
        </div>

        <div className="char-class-group">
          <label>JOGADOR</label>
          <input
            type="text"
            value={character.interprete}
            onChange={(e) => updateCharacter({ interprete: e.target.value })}
            className="char-jogador-input"
          />
          <label>CLASSE</label>
          <select
            value={character.arquetipo}
            onChange={(e) => updateCharacter({ arquetipo: e.target.value })}
            className="char-class-input"
          >
            <option value="">ESP. TÉCNICO</option>
            {ARQUETIPOS.map(arq => (
              <option key={arq} value={arq}>{arq}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Layout Principal - 2 Colunas */}
      <div className="sheet-main-layout">
        {/* Coluna Esquerda - Recursos e Perícias */}
        <div className="sheet-left-column">
          {/* Recursos Circulares */}
          <div className="resources-circle-section">
            <div className="resource-circle dados-circle" onClick={() => {
              const filled = character.pilhaDados.filter(d => d).length;
              if (filled < 6) {
                const newPilha = [...character.pilhaDados];
                for (let i = 0; i < newPilha.length; i++) {
                  if (!newPilha[i]) {
                    newPilha[i] = true;
                    updateCharacter({ pilhaDados: newPilha });
                    break;
                  }
                }
              }
            }}>
              <div className="circle-value">{character.pilhaDados.filter(d => d).length}</div>
              <div className="circle-label">DADOS</div>
              <div className="circle-max">/ 6</div>
            </div>
            <div className="resource-circle fuga-circle" onClick={() => {
              const filled = character.pilhaFuga.filter(d => d).length;
              if (filled < 7) {
                const newPilha = [...character.pilhaFuga];
                for (let i = 0; i < newPilha.length; i++) {
                  if (!newPilha[i]) {
                    newPilha[i] = true;
                    updateCharacter({ pilhaFuga: newPilha });
                    break;
                  }
                }
              }
            }}>
              <div className="circle-value">{character.pilhaFuga.filter(d => d).length}</div>
              <div className="circle-label">FUGA</div>
              <div className="circle-max">/ 7</div>
            </div>
            <div className="resource-circle tensao-circle">
              <div className="circle-value">{character.tensao - calcularTensaoGasta()}</div>
              <div className="circle-label">TENSÃO</div>
              <div className="circle-max">/ {character.tensao}</div>
            </div>
          </div>

          {/* Tensão Total */}
          <div className="tensao-total-box">
            <label>TENSÃO TOTAL</label>
            <input
              type="number"
              value={character.tensao}
              onChange={(e) => updateCharacter({ tensao: parseInt(e.target.value) || 0 })}
              className="tensao-total-input"
            />
          </div>

          {/* Perícias */}
          <div className="pericias-section">
            <h2>PERÍCIAS</h2>
            <div className="pericias-table">
              <div className="pericias-header">
                <span>PERÍCIA</span>
                <span>DADOS</span>
                <span>BÔNUS</span>
                <span>Treino</span>
              </div>
              {PERICIAS.map(pericia => (
                <div key={pericia} className="pericia-row">
                  <span className="pericia-name-cell">{pericia}</span>
                  <span className="pericia-dados">( D6 )</span>
                  <span className="pericia-bonus">( 0 )</span>
                  <label className="pericia-treino-cell">
                    <input
                      type="checkbox"
                      checked={character.pericias[pericia].treinada}
                      onChange={() => togglePericiaTreinada(pericia)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita - Combate, Habilidades, etc */}
        <div className="sheet-right-column">
          {/* Abas Superiores */}
          <div className="sheet-tabs">
            <button className="tab-btn active">COMBATE</button>
            <button className="tab-btn">HABILIDADES</button>
            <button className="tab-btn">RITUAIS</button>
            <button className="tab-btn">INVENTÁRIO</button>
            <button className="tab-btn">DESCRIÇÃO</button>
          </div>

          {/* Área de Apegos */}
          <div className="apegos-compact">
            <div className="apego-item">
              <label>ITEM ICÔNICO</label>
              <input
                type="text"
                value={character.apegos.itemIconico}
                onChange={(e) => updateCharacter({ 
                  apegos: { ...character.apegos, itemIconico: e.target.value }
                })}
              />
            </div>
            <div className="apego-item">
              <label>RELAÇÃO AFETIVA</label>
              <input
                type="text"
                value={character.apegos.relacaoAfetiva}
                onChange={(e) => updateCharacter({ 
                  apegos: { ...character.apegos, relacaoAfetiva: e.target.value }
                })}
              />
            </div>
            <div className="apego-item">
              <label>DESEJO OBSCURO</label>
              <input
                type="text"
                value={character.apegos.desejoObscuro}
                onChange={(e) => updateCharacter({ 
                  apegos: { ...character.apegos, desejoObscuro: e.target.value }
                })}
              />
            </div>
          </div>

          {/* Vantagens */}
          <div className="vantagens-compact">
            <h3>VANTAGENS GERAIS</h3>
            <div className="vantagens-list">
              <label className="vantagem-checkbox">
                <input
                  type="checkbox"
                  checked={character.vantagensGerais.choqueRealidade}
                  onChange={() => toggleCheckbox('vantagensGerais.choqueRealidade')}
                />
                <span>Choque de Realidade (6)</span>
              </label>
              <label className="vantagem-checkbox">
                <input
                  type="checkbox"
                  checked={character.vantagensGerais.cuidarFeridas}
                  onChange={() => toggleCheckbox('vantagensGerais.cuidarFeridas')}
                />
                <span>Cuidar de Feridas (1)</span>
              </label>
              <label className="vantagem-checkbox">
                <input
                  type="checkbox"
                  checked={character.vantagensGerais.tomarJeito}
                  onChange={() => toggleCheckbox('vantagensGerais.tomarJeito')}
                />
                <span>Tomar Jeito (3)</span>
              </label>
            </div>
            
            <h3>VANTAGENS DE ESPECIALIDADE</h3>
            <div className="vantagens-list">
              <label className="vantagem-checkbox">
                <input
                  type="checkbox"
                  checked={character.vantagensEspecialidade.ombroAmigo}
                  onChange={() => toggleCheckbox('vantagensEspecialidade.ombroAmigo')}
                />
                <span>Ombro Amigo (2)</span>
              </label>
              <label className="vantagem-checkbox">
                <input
                  type="checkbox"
                  checked={character.vantagensEspecialidade.adrenalina}
                  onChange={() => toggleCheckbox('vantagensEspecialidade.adrenalina')}
                />
                <span>Adrenalina (2)</span>
              </label>
              <label className="vantagem-checkbox">
                <input
                  type="checkbox"
                  checked={character.vantagensEspecialidade.cacarRecurso}
                  onChange={() => toggleCheckbox('vantagensEspecialidade.cacarRecurso')}
                />
                <span>Caçar Recurso (3)</span>
              </label>
              <label className="vantagem-checkbox">
                <input
                  type="checkbox"
                  checked={character.vantagensEspecialidade.prepararProxima}
                  onChange={() => toggleCheckbox('vantagensEspecialidade.prepararProxima')}
                />
                <span>Preparar Próxima (3)</span>
              </label>
              <label className="vantagem-checkbox">
                <input
                  type="checkbox"
                  checked={character.vantagensEspecialidade.naoEsperaPorMim}
                  onChange={() => toggleCheckbox('vantagensEspecialidade.naoEsperaPorMim')}
                />
                <span>Não Espera Por Mim (3)</span>
              </label>
            </div>
          </div>

          {/* Habilidades */}
          <div className="habilidades-compact">
            <h3>HABILIDADES</h3>
            <textarea
              value={character.habilidades}
              onChange={(e) => updateCharacter({ habilidades: e.target.value })}
              rows="4"
              placeholder="Descreva suas habilidades especiais..."
            />
          </div>

          {/* Marcadores */}
          <div className="marcadores-compact">
            <h3>MARCADORES / FERIDA</h3>
            <textarea
              value={character.marcadores}
              onChange={(e) => updateCharacter({ marcadores: e.target.value })}
              rows="3"
              placeholder="Marcadores e descrição de feridas..."
            />
            <div className="ferida-niveis">
              {character.ferida.niveis.map((checked, i) => (
                <label key={i} className="ferida-box">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCheckbox('ferida.niveis', i)}
                  />
                  <span>{i + 1}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sistema de Rolagem */}
      <DiceRoller 
        user={user} 
        character={character}
        updateCharacter={updateCharacter}
      />
    </div>
  );
};

export default CharacterSheet;
