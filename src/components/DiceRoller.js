import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { database } from '../firebase';
import './DiceRoller.css';

const PERICIAS = ['Agilidade', 'Astúcia', 'Força', 'Carisma', 'Vigor'];

const DiceRoller = ({ user, character, updateCharacter }) => {
  const [numDados, setNumDados] = useState(1);
  const [periciaSelecionada, setPericiaSelecionada] = useState('');
  const [resultado, setResultado] = useState(null);

  const rolarDados = () => {
    if (!periciaSelecionada) {
      alert('Selecione uma perícia antes de rolar');
      return;
    }

    // Verificar quantos dados estão disponíveis na pilha
    const dadosDisponiveis = character.pilhaDados.filter(d => d).length;
    if (numDados > dadosDisponiveis) {
      alert(`Você só tem ${dadosDisponiveis} dados disponíveis na pilha!`);
      return;
    }

    // Rolar os dados
    const resultadosDados = [];
    for (let i = 0; i < numDados; i++) {
      resultadosDados.push(Math.floor(Math.random() * 6) + 1);
    }

    // Verificar se a perícia é treinada
    const isPericiaTreinada = character.pericias[periciaSelecionada]?.treinada || false;
    const valorSucesso = isPericiaTreinada ? 3 : 4;

    // Calcular sucessos
    const sucessos = resultadosDados.filter(dado => dado >= valorSucesso).length;
    const fracassos = resultadosDados.filter(dado => dado < valorSucesso).length;

    const resultadoRolagem = {
      nomePersonagem: character.nome || 'Sem Nome',
      nomeJogador: character.interprete || user.email || 'Jogador',
      pericia: periciaSelecionada,
      treinada: isPericiaTreinada,
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

    // Se houve fracassos, remover dados da pilha
    if (fracassos > 0) {
      const novaPilha = [...character.pilhaDados];
      let dadosRemovidos = 0;
      
      for (let i = novaPilha.length - 1; i >= 0 && dadosRemovidos < fracassos; i--) {
        if (novaPilha[i]) {
          novaPilha[i] = false;
          dadosRemovidos++;
        }
      }
      
      updateCharacter({ pilhaDados: novaPilha });
    }
  };

  const getDiceColor = (valor, valorSucesso) => {
    return valor >= valorSucesso ? 'success' : 'failure';
  };

  return (
    <div className="dice-roller">
      <h2>Sistema de Rolagem</h2>
      
      <div className="roller-controls">
        <div className="control-group">
          <label>Quantidade de Dados:</label>
          <input
            type="number"
            min="1"
            max="6"
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
            {PERICIAS.map(pericia => (
              <option key={pericia} value={pericia}>
                {pericia} {character.pericias[pericia]?.treinada ? '(Treinada)' : ''}
              </option>
            ))}
          </select>
        </div>

        <button onClick={rolarDados} className="roll-button">
          🎲 Rolar Dados
        </button>
      </div>

      <div className="dice-info">
        <p>
          <strong>Sucesso:</strong> {periciaSelecionada && character.pericias[periciaSelecionada]?.treinada 
            ? '3 ou mais (Perícia Treinada)' 
            : '4 ou mais (Sem Treino)'}
        </p>
        <p>
          <strong>Dados Disponíveis:</strong> {character.pilhaDados.filter(d => d).length} / 6
        </p>
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

          {resultado.fracassos > 0 && (
            <div className="warning-message">
              ⚠️ {resultado.fracassos} dado(s) removido(s) da pilha de dados!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
