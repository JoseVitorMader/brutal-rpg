import React, { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { database } from '../firebase';
import DiceRoller from './DiceRoller';
import './CharacterSheet.css';

const ARQUETIPOS = ['Selecione o Arquetipo', 'Atleta', 'Cética', 'Esbelto', 'Heroi', 'Inocente', 'Nerd', 'Relaxado', 'Valentona'];
const PERICIAS = ['Agilidade', 'Astúcia', 'Força', 'Carisma', 'Vigor'];

const VANTAGENS = {
  gerais: [
    { id: 'choqueRealidade', nome: 'Choque de Realidade', custo: 6 },
    { id: 'cuidarFeridas', nome: 'Cuidar de Feridas', custo: 1 },
    { id: 'tomarJeito', nome: 'Tomar Jeito', custo: 3 }
  ],
  especialidade: [
    { id: 'ombroAmigo', nome: 'Ombro Amigo', custo: 2 },
    { id: 'adrenalina', nome: 'Adrenalina', custo: 2 },
    { id: 'cacarRecurso', nome: 'Caçar Recurso', custo: 3 },
    { id: 'prepararProxima', nome: 'Preparar Próxima', custo: 3 },
    { id: 'naoEsperaPorMim', nome: 'Não Espera Por Mim', custo: 3 }
  ]
};

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
    inventarioVantagens: {
      compradas: [],
      usadas: []
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
    if (!character.inventarioVantagens) return 0;
    
    const todasVantagens = [...VANTAGENS.gerais, ...VANTAGENS.especialidade];
    const compradas = character.inventarioVantagens.compradas || [];
    
    return compradas.reduce((total, vantagemId) => {
      const vantagem = todasVantagens.find(v => v.id === vantagemId);
      return total + (vantagem ? vantagem.custo : 0);
    }, 0);
  };

  const comprarVantagem = (vantagemId) => {
    const todasVantagens = [...VANTAGENS.gerais, ...VANTAGENS.especialidade];
    const vantagem = todasVantagens.find(v => v.id === vantagemId);
    
    if (!vantagem) return;
    
    const tensaoDisponivel = character.tensao - calcularTensaoGasta();
    
    if (tensaoDisponivel < vantagem.custo) {
      alert(`Tensão insuficiente! Você precisa de ${vantagem.custo} pontos, mas tem apenas ${tensaoDisponivel} disponíveis.`);
      return;
    }
    
    const novasCompradas = [...(character.inventarioVantagens.compradas || []), vantagemId];
    updateCharacter({
      inventarioVantagens: {
        ...character.inventarioVantagens,
        compradas: novasCompradas
      }
    });
  };

  const desfazerCompra = (vantagemId) => {
    const novasCompradas = (character.inventarioVantagens.compradas || []).filter(id => id !== vantagemId);
    updateCharacter({
      inventarioVantagens: {
        ...character.inventarioVantagens,
        compradas: novasCompradas
      }
    });
  };

  const usarVantagem = (vantagemId) => {
    const novasCompradas = (character.inventarioVantagens.compradas || []).filter(id => id !== vantagemId);
    const novasUsadas = [...(character.inventarioVantagens.usadas || []), { id: vantagemId, timestamp: Date.now() }];
    
    updateCharacter({
      inventarioVantagens: {
        compradas: novasCompradas,
        usadas: novasUsadas
      }
    });
  };

  const cancelarUso = (vantagemId) => {
    const novasUsadas = (character.inventarioVantagens.usadas || []).filter(item => item.id !== vantagemId);
    const novasCompradas = [...(character.inventarioVantagens.compradas || []), vantagemId];
    
    updateCharacter({
      inventarioVantagens: {
        compradas: novasCompradas,
        usadas: novasUsadas
      }
    });
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
              placeholder="Seu nome aqui"
              className="char-name-input"
            />
          </div>
          <div className="char-origin-group">
            <label>PRONOMES</label>
            <input
              type="text"
              value={character.pronomes}
              onChange={(e) => updateCharacter({ pronomes: e.target.value })}
              placeholder=""
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
          <label>ARQUÉTIPOS</label>
          <select
            value={character.arquetipo}
            onChange={(e) => updateCharacter({ arquetipo: e.target.value })}
            className="char-class-input"
          >
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
            <div className="resource-wrapper">
              <div className="resource-circle dados-circle">
                <div className="circle-value">{character.pilhaDados.filter(d => d).length}</div>
                <div className="circle-label">DADOS</div>
                <div className="circle-max">/ 6</div>
              </div>
              <div className="resource-controls">
                <button 
                  className="resource-btn decrease"
                  onClick={() => {
                    const filled = character.pilhaDados.filter(d => d).length;
                    if (filled > 0) {
                      const newPilha = [...character.pilhaDados];
                      for (let i = newPilha.length - 1; i >= 0; i--) {
                        if (newPilha[i]) {
                          newPilha[i] = false;
                          updateCharacter({ pilhaDados: newPilha });
                          break;
                        }
                      }
                    }
                  }}
                  title="Diminuir Dados"
                >−</button>
                <button 
                  className="resource-btn increase"
                  onClick={() => {
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
                  }}
                  title="Aumentar Dados"
                >+</button>
              </div>
            </div>
            
            <div className="resource-wrapper">
              <div className="resource-circle fuga-circle">
                <div className="circle-value">{character.pilhaFuga.filter(d => d).length}</div>
                <div className="circle-label">FUGA</div>
                <div className="circle-max">/ 7</div>
              </div>
              <div className="resource-controls">
                <button 
                  className="resource-btn decrease"
                  onClick={() => {
                    const filled = character.pilhaFuga.filter(d => d).length;
                    if (filled > 0) {
                      const newPilha = [...character.pilhaFuga];
                      for (let i = newPilha.length - 1; i >= 0; i--) {
                        if (newPilha[i]) {
                          newPilha[i] = false;
                          updateCharacter({ pilhaFuga: newPilha });
                          break;
                        }
                      }
                    }
                  }}
                  title="Diminuir Fuga"
                >−</button>
                <button 
                  className="resource-btn increase"
                  onClick={() => {
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
                  }}
                  title="Aumentar Fuga"
                >+</button>
              </div>
            </div>
            
            <div className="resource-wrapper">
              <div className="resource-circle tensao-circle">
                <div className="circle-value">{character.tensao - calcularTensaoGasta()}</div>
                <div className="circle-label">TENSÃO</div>
                <div className="circle-max">/ {character.tensao}</div>
              </div>
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

          {/* DiceRoller Compacto */}
          <div className="dice-roller-compact">
            <DiceRoller 
              user={user} 
              character={character} 
              updateCharacter={updateCharacter}
            />
          </div>
        </div>

        {/* Coluna Direita - Combate, Habilidades, etc */}
        <div className="sheet-right-column">
          {/* Abas Superiores */}
          <div className="sheet-tabs">
            <button className="tab-btn active">COMBATE</button>
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

          {/* Sistema de Vantagens com Inventário */}
          <div className="vantagens-system">
            <h3>🛒 LOJA DE VANTAGENS</h3>
            
            <div className="vantagens-categoria">
              <h4>Vantagens Gerais</h4>
              {VANTAGENS.gerais.map(vantagem => {
                const jaComprada = (character.inventarioVantagens?.compradas || []).includes(vantagem.id);
                const tensaoDisponivel = character.tensao - calcularTensaoGasta();
                const podeComprar = !jaComprada && tensaoDisponivel >= vantagem.custo;
                
                return (
                  <div key={vantagem.id} className={`vantagem-loja-item ${jaComprada ? 'comprada' : ''}`}>
                    <span className="vantagem-nome">{vantagem.nome}</span>
                    <span className="vantagem-custo">({vantagem.custo} tensão)</span>
                    {!jaComprada ? (
                      <button 
                        onClick={() => comprarVantagem(vantagem.id)}
                        disabled={!podeComprar}
                        className="btn-comprar"
                        title={!podeComprar ? 'Tensão insuficiente' : 'Comprar vantagem'}
                      >
                        🛒 Comprar
                      </button>
                    ) : (
                      <button 
                        onClick={() => desfazerCompra(vantagem.id)}
                        className="btn-desfazer"
                      >
                        ↩️ Desfazer
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="vantagens-categoria">
              <h4>Vantagens de Especialidade</h4>
              {VANTAGENS.especialidade.map(vantagem => {
                const jaComprada = (character.inventarioVantagens?.compradas || []).includes(vantagem.id);
                const tensaoDisponivel = character.tensao - calcularTensaoGasta();
                const podeComprar = !jaComprada && tensaoDisponivel >= vantagem.custo;
                
                return (
                  <div key={vantagem.id} className={`vantagem-loja-item ${jaComprada ? 'comprada' : ''}`}>
                    <span className="vantagem-nome">{vantagem.nome}</span>
                    <span className="vantagem-custo">({vantagem.custo} tensão)</span>
                    {!jaComprada ? (
                      <button 
                        onClick={() => comprarVantagem(vantagem.id)}
                        disabled={!podeComprar}
                        className="btn-comprar"
                        title={!podeComprar ? 'Tensão insuficiente' : 'Comprar vantagem'}
                      >
                        🛒 Comprar
                      </button>
                    ) : (
                      <button 
                        onClick={() => desfazerCompra(vantagem.id)}
                        className="btn-desfazer"
                      >
                        ↩️ Desfazer
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <h3>📦 INVENTÁRIO (Vantagens Compradas)</h3>
            <div className="inventario-vantagens">
              {(!character.inventarioVantagens?.compradas || character.inventarioVantagens.compradas.length === 0) ? (
                <p className="inventario-vazio">Nenhuma vantagem comprada ainda</p>
              ) : (
                character.inventarioVantagens.compradas.map(vantagemId => {
                  const todasVantagens = [...VANTAGENS.gerais, ...VANTAGENS.especialidade];
                  const vantagem = todasVantagens.find(v => v.id === vantagemId);
                  if (!vantagem) return null;
                  
                  return (
                    <div key={vantagemId} className="vantagem-inventario-item">
                      <span className="vantagem-nome">{vantagem.nome}</span>
                      <button 
                        onClick={() => usarVantagem(vantagemId)}
                        className="btn-usar"
                        title="Usar esta vantagem"
                      >
                        ✓ Usar
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <h3>✅ VANTAGENS USADAS</h3>
            <div className="vantagens-usadas">
              {(!character.inventarioVantagens?.usadas || character.inventarioVantagens.usadas.length === 0) ? (
                <p className="inventario-vazio">Nenhuma vantagem usada ainda</p>
              ) : (
                character.inventarioVantagens.usadas.map((item, index) => {
                  const todasVantagens = [...VANTAGENS.gerais, ...VANTAGENS.especialidade];
                  const vantagem = todasVantagens.find(v => v.id === item.id);
                  if (!vantagem) return null;
                  
                  return (
                    <div key={index} className="vantagem-usada-item">
                      <span className="vantagem-nome">{vantagem.nome}</span>
                      <button 
                        onClick={() => cancelarUso(item.id)}
                        className="btn-cancelar"
                        title="Cancelar uso (erro)"
                      >
                        ↩️ Cancelar
                      </button>
                    </div>
                  );
                })
              )}
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
    </div>
  );
};

export default CharacterSheet;
