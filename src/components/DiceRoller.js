import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { database } from '../firebase';
import './DiceRoller.css';

const PERICIAS = ['Agilidade', 'Astúcia', 'Força', 'Carisma', 'Vigor'];

const DiceRoller = ({ user, character, updateCharacter, monsters }) => {
  const [numDados, setNumDados] = useState(1);
  const [periciaSelecionada, setPericiaSelecionada] = useState('');
  const [isPericiaTreinada, setIsPericiaTreinada] = useState(false);
  const [nomePersonagem, setNomePersonagem] = useState('');
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [resultado, setResultado] = useState(null);
  
  // Modo mestre: não tem character definido
  const isMasterMode = !character;

  const rolarDados = () => {
    if (!periciaSelecionada) {
      alert('Selecione uma perícia antes de rolar');
      return;
    }

    if (isMasterMode && !nomePersonagem.trim()) {
      alert('Digite o nome do personagem/criatura');
      return;
    }

    // Verificar quantos dados estão disponíveis (baseado em marcadores)
    if (!isMasterMode) {
      const marcadoresDisponiveis = character.marcadores || 0;
      // Cada marcador vale 1 dado
      if (numDados > marcadoresDisponiveis) {
        alert(`Você só tem ${marcadoresDisponiveis} marcadores disponíveis!`);
        return;
      }
    }

    // Rolar os dados
    const resultadosDados = [];
    for (let i = 0; i < numDados; i++) {
      resultadosDados.push(Math.floor(Math.random() * 6) + 1);
    }

    // Verificar se a perícia é treinada
    let treinada = false;
    if (isMasterMode) {
      treinada = selectedMonster ? (selectedMonster.pericias[periciaSelecionada]?.treinada || false) : isPericiaTreinada;
    } else {
      treinada = character.pericias[periciaSelecionada]?.treinada || false;
    }
    const valorSucesso = treinada ? 3 : 4;

    // Calcular sucessos
    const sucessos = resultadosDados.filter(dado => dado >= valorSucesso).length;
    const fracassos = resultadosDados.filter(dado => dado < valorSucesso).length;

    const resultadoRolagem = {
      nomePersonagem: isMasterMode ? (selectedMonster ? selectedMonster.nome : nomePersonagem) : (character.nome || 'Sem Nome'),
      nomeJogador: isMasterMode ? `Mestre: ${user.email || user.username || 'Mestre'}` : (character.interprete || user.email || 'Jogador'),
      pericia: periciaSelecionada,
      treinada: treinada,
      numDados,
      dados: resultadosDados,
      sucessos,
      fracassos,
      valorSucesso,
      timestamp: Date.now()
    };

    setResultado(resultadoRolagem);

    // Salvar rolagem no Firebase
    const rolagemRef = ref(database, `tables/${user.tableId}/rolls`);
    push(rolagemRef, resultadoRolagem);

    // Se houve fracassos, aumentar ferida (apenas para jogadores)
    if (!isMasterMode && fracassos > 0) {
      const ferida = character.ferida || 0;
      const novaFerida = Math.min(5, ferida + fracassos);
      
      updateCharacter({ ferida: novaFerida });
    }
  };

  const getDiceColor = (valor, valorSucesso) => {
    return valor >= valorSucesso ? 'success' : 'failure';
  };

  return (
    <div className="dice-roller">
      <h2>Sistema de Rolagem</h2>
      
      <div className="roller-controls">
        {isMasterMode && monsters && monsters.length > 0 && (
          <div className="control-group">
            <label>Selecionar Criatura:</label>
            <select
              value={selectedMonster ? selectedMonster.id : ''}
              onChange={(e) => {
                const monster = monsters.find(m => m.id === e.target.value);
                setSelectedMonster(monster || null);
                setNomePersonagem(monster ? monster.nome : '');
              }}
              className="pericia-select"
            >
              <option value="">-- Nova Rolagem --</option>
              {monsters.map(monster => (
                <option key={monster.id} value={monster.id}>
                  {monster.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        {isMasterMode && !selectedMonster && (
          <div className="control-group">
            <label>Nome do Personagem/Criatura:</label>
            <input
              type="text"
              value={nomePersonagem}
              onChange={(e) => setNomePersonagem(e.target.value)}
              placeholder="Ex: Zumbi, Cultista, etc"
              className="dice-input"
            />
          </div>
        )}

        <div className="control-group">
          <label>Quantidade de Dados:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={numDados}
            onChange={(e) => setNumDados(parseInt(e.target.value) || 1)}
            className="dice-input"
          />
        </div>

        <div className="control-group">
          <label>Perícia:</label>
          <select
            value={periciaSelecionada}
            onChange={(e) => setPericiaSelecionada(e.target.value)}
            className="pericia-select"
          >
            <option value="">Selecione...</option>
            {PERICIAS.map(pericia => {
              if (isMasterMode) {
                return <option key={pericia} value={pericia}>{pericia}</option>;
              } else {
                return (
                  <option key={pericia} value={pericia}>
                    {pericia} {character.pericias[pericia]?.treinada ? '(Treinada)' : ''}
                  </option>
                );
              }
            })}
          </select>
        </div>

        {isMasterMode && !selectedMonster && (
          <div className="control-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPericiaTreinada}
                onChange={(e) => setIsPericiaTreinada(e.target.checked)}
              />
              <span>Perícia Treinada (sucesso em 3+)</span>
            </label>
          </div>
        )}

        <button onClick={rolarDados} className="roll-button">
          🎲 Rolar Dados
        </button>
      </div>

      <div className="dice-info">
        <p>
          <strong>Sucesso:</strong> {
            isMasterMode 
              ? (selectedMonster && periciaSelecionada
                  ? (selectedMonster.pericias && selectedMonster.pericias[periciaSelecionada]?.treinada ? '3 ou mais (Perícia Treinada)' : '4 ou mais (Sem Treino)')
                  : (isPericiaTreinada ? '3 ou mais (Perícia Treinada)' : '4 ou mais (Sem Treino)'))
              : (periciaSelecionada && character.pericias && character.pericias[periciaSelecionada]?.treinada 
                  ? '3 ou mais (Perícia Treinada)' 
                  : '4 ou mais (Sem Treino)')
          }
        </p>
        {!isMasterMode && (
          <>
            <p>
              <strong>Marcadores Disponíveis:</strong> {character.marcadores || 0}
            </p>
            <p className="info-text">
              💡 Cada fracasso adiciona 1 ferida. Ferida atual: {character.ferida || 0}/5
            </p>
          </>
        )}
      </div>

      {resultado && (
        <div className="roll-result">
          <h3>Resultado da Rolagem</h3>
          <div className="result-info">
            <p><strong>Perícia:</strong> {resultado.pericia} {resultado.treinada ? '(Treinada)' : ''}</p>
            <p><strong>Dados Rolados:</strong> {resultado.numDados}</p>
          </div>
          
          <div className="dice-display">
            {resultado.dados.map((dado, index) => (
              <div 
                key={index} 
                className={`dice ${getDiceColor(dado, resultado.valorSucesso)}`}
              >
                {dado}
              </div>
            ))}
          </div>

          <div className="result-summary">
            <div className="success-count">
              ✓ Sucessos: {resultado.sucessos}
            </div>
            <div className="failure-count">
              ✗ Fracassos: {resultado.fracassos}
            </div>
          </div>

          {resultado.fracassos > 0 && !isMasterMode && (
            <div className="warning-message">
              ⚠️ {resultado.fracassos} ferida(s) adicionada(s)! Total: {(character.ferida || 0)}/5
            </div>
          )}

          {resultado.fracassos > 0 && isMasterMode && (
            <div className="info-message">
              ℹ️ Como é uma rolagem do mestre, nenhuma ferida foi adicionada.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
