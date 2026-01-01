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

  return (
    <div className="character-sheet">
      <div className="sheet-header">
        <h1>Ficha de Personagem - BRUTAL RPG</h1>
        <div className="tensao-display">
          <label>Tensão:</label>
          <input
            type="number"
            value={character.tensao}
            onChange={(e) => updateCharacter({ tensao: parseInt(e.target.value) || 0 })}
            className="tensao-input"
          />
          <span className="tensao-gasta">Gasta: {calcularTensaoGasta()}</span>
          <span className="tensao-disponivel">Disponível: {character.tensao - calcularTensaoGasta()}</span>
        </div>
      </div>

      <div className="sheet-grid">
        {/* Informações Básicas */}
        <div className="sheet-section">
          <h2>Informações Básicas</h2>
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              value={character.nome}
              onChange={(e) => updateCharacter({ nome: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Pronomes:</label>
            <input
              type="text"
              value={character.pronomes}
              onChange={(e) => updateCharacter({ pronomes: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Intérprete:</label>
            <input
              type="text"
              value={character.interprete}
              onChange={(e) => updateCharacter({ interprete: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Arquétipo:</label>
            <select
              value={character.arquetipo}
              onChange={(e) => updateCharacter({ arquetipo: e.target.value })}
            >
              <option value="">Selecione...</option>
              {ARQUETIPOS.map(arq => (
                <option key={arq} value={arq}>{arq}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Apegos */}
        <div className="sheet-section">
          <h2>Apegos</h2>
          <div className="form-group">
            <label>Item Icônico:</label>
            <textarea
              value={character.apegos.itemIconico}
              onChange={(e) => updateCharacter({ 
                apegos: { ...character.apegos, itemIconico: e.target.value }
              })}
              rows="2"
            />
          </div>
          <div className="form-group">
            <label>Relação Afetiva:</label>
            <textarea
              value={character.apegos.relacaoAfetiva}
              onChange={(e) => updateCharacter({ 
                apegos: { ...character.apegos, relacaoAfetiva: e.target.value }
              })}
              rows="2"
            />
          </div>
          <div className="form-group">
            <label>Desejo Obscuro:</label>
            <textarea
              value={character.apegos.desejoObscuro}
              onChange={(e) => updateCharacter({ 
                apegos: { ...character.apegos, desejoObscuro: e.target.value }
              })}
              rows="2"
            />
          </div>
        </div>

        {/* Pilhas */}
        <div className="sheet-section">
          <h2>Pilha de Dados (máx. 6)</h2>
          <div className="checkbox-group">
            {character.pilhaDados.map((checked, i) => (
              <label key={i} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCheckbox('pilhaDados', i)}
                />
                Dado {i + 1}
              </label>
            ))}
          </div>
        </div>

        <div className="sheet-section">
          <h2>Pilha de Fuga (7)</h2>
          <div className="checkbox-group">
            {character.pilhaFuga.map((checked, i) => (
              <label key={i} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCheckbox('pilhaFuga', i)}
                />
                Fuga {i + 1}
              </label>
            ))}
          </div>
        </div>

        {/* Marcadores e Ferida */}
        <div className="sheet-section">
          <h2>Marcadores</h2>
          <textarea
            value={character.marcadores}
            onChange={(e) => updateCharacter({ marcadores: e.target.value })}
            rows="4"
            placeholder="Descreva seus marcadores..."
          />
        </div>

        <div className="sheet-section">
          <h2>Ferida</h2>
          <div className="form-group">
            <label>Descrição:</label>
            <textarea
              value={character.ferida.descricao}
              onChange={(e) => updateCharacter({ 
                ferida: { ...character.ferida, descricao: e.target.value }
              })}
              rows="2"
            />
          </div>
          <div className="checkbox-group">
            {character.ferida.niveis.map((checked, i) => (
              <label key={i} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCheckbox('ferida.niveis', i)}
                />
                Nível {i + 1}
              </label>
            ))}
          </div>
        </div>

        {/* Perícias */}
        <div className="sheet-section">
          <h2>Perícias (máx. 2 treinadas)</h2>
          {PERICIAS.map(pericia => (
            <div key={pericia} className="pericia-item">
              <span className="pericia-name">{pericia}</span>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={character.pericias[pericia].treinada}
                  onChange={() => togglePericiaTreinada(pericia)}
                />
                Treinada
              </label>
            </div>
          ))}
        </div>

        {/* Habilidades */}
        <div className="sheet-section">
          <h2>Habilidades</h2>
          <textarea
            value={character.habilidades}
            onChange={(e) => updateCharacter({ habilidades: e.target.value })}
            rows="6"
            placeholder="Descreva suas habilidades..."
          />
        </div>

        {/* Aparência */}
        <div className="sheet-section">
          <h2>Aparência</h2>
          <div className="form-group">
            <label>URL da Imagem:</label>
            <input
              type="text"
              value={character.aparencia}
              onChange={(e) => updateCharacter({ aparencia: e.target.value })}
              placeholder="https://..."
            />
          </div>
          {character.aparencia && (
            <div className="appearance-preview">
              <img src={character.aparencia} alt="Aparência do personagem" />
            </div>
          )}
        </div>

        {/* Vantagens Gerais */}
        <div className="sheet-section">
          <h2>Vantagens Gerais</h2>
          <label className="vantagem-item">
            <input
              type="checkbox"
              checked={character.vantagensGerais.choqueRealidade}
              onChange={() => toggleCheckbox('vantagensGerais.choqueRealidade')}
            />
            Choque de Realidade (6 pontos)
          </label>
          <label className="vantagem-item">
            <input
              type="checkbox"
              checked={character.vantagensGerais.cuidarFeridas}
              onChange={() => toggleCheckbox('vantagensGerais.cuidarFeridas')}
            />
            Cuidar de Feridas (1 ponto)
          </label>
          <label className="vantagem-item">
            <input
              type="checkbox"
              checked={character.vantagensGerais.tomarJeito}
              onChange={() => toggleCheckbox('vantagensGerais.tomarJeito')}
            />
            Tomar Jeito (3 pontos)
          </label>
        </div>

        {/* Vantagens de Especialidade */}
        <div className="sheet-section">
          <h2>Vantagens de Especialidade</h2>
          <label className="vantagem-item">
            <input
              type="checkbox"
              checked={character.vantagensEspecialidade.ombroAmigo}
              onChange={() => toggleCheckbox('vantagensEspecialidade.ombroAmigo')}
            />
            Ombro Amigo - Carisma (2 pontos)
          </label>
          <label className="vantagem-item">
            <input
              type="checkbox"
              checked={character.vantagensEspecialidade.adrenalina}
              onChange={() => toggleCheckbox('vantagensEspecialidade.adrenalina')}
            />
            Adrenalina - Vigor (2 pontos)
          </label>
          <label className="vantagem-item">
            <input
              type="checkbox"
              checked={character.vantagensEspecialidade.cacarRecurso}
              onChange={() => toggleCheckbox('vantagensEspecialidade.cacarRecurso')}
            />
            Caçar Recurso - Intelecto (3 pontos)
          </label>
          <label className="vantagem-item">
            <input
              type="checkbox"
              checked={character.vantagensEspecialidade.prepararProxima}
              onChange={() => toggleCheckbox('vantagensEspecialidade.prepararProxima')}
            />
            Preparar para a Próxima - Agilidade (3 pontos)
          </label>
          <label className="vantagem-item">
            <input
              type="checkbox"
              checked={character.vantagensEspecialidade.naoEsperaPorMim}
              onChange={() => toggleCheckbox('vantagensEspecialidade.naoEsperaPorMim')}
            />
            Ele Não Espera Por Mim - Força (3 pontos)
          </label>
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
