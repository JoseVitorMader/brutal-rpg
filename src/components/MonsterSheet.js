import React, { useState } from 'react';
import './MonsterSheet.css';

const MonsterSheet = ({ monster, onUpdate, onClose }) => {
  const [monsterData, setMonsterData] = useState(monster || {
    nome: '',
    descricao: '',
    ameacas: '',
    pontosHorror: 0,
    nivelBrutalidade: '',
    armadilhas: Array(4).fill(false),
    sustos: Array(5).fill(false),
    etapasFuga: '',
    acoesUnicas: '',
    aparencia: '',
    habilidadePassiva: '',
    intentosHorriveis: [],
    acoesGerais: [],
    anotacoes: ''
  });

  // Garantir que arrays existem (para criaturas antigas)
  React.useEffect(() => {
    if (monster) {
      setMonsterData({
        nome: monster.nome || '',
        descricao: monster.descricao || '',
        ameacas: monster.ameacas || '',
        pontosHorror: monster.pontosHorror || 0,
        nivelBrutalidade: monster.nivelBrutalidade || '',
        armadilhas: monster.armadilhas || Array(4).fill(false),
        sustos: monster.sustos || Array(5).fill(false),
        etapasFuga: monster.etapasFuga || '',
        acoesUnicas: monster.acoesUnicas || '',
        aparencia: monster.aparencia || '',
        habilidadePassiva: monster.habilidadePassiva || '',
        intentosHorriveis: monster.intentosHorriveis || [],
        acoesGerais: monster.acoesGerais || [],
        anotacoes: monster.anotacoes || ''
      });
    }
  }, [monster]);

  const updateMonster = (updates) => {
    setMonsterData({ ...monsterData, ...updates });
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(monsterData);
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
    }
    
    updateMonster(newData);
  };

  const updateIntentoHorrivel = (index, field, value) => {
    const newIntentos = [...(monsterData.intentosHorriveis || [])];
    newIntentos[index] = { ...newIntentos[index], [field]: value };
    updateMonster({ intentosHorriveis: newIntentos });
  };

  const addIntentoHorrivel = () => {
    const newIntentos = [...(monsterData.intentosHorriveis || []), { ph: '', descricao: '' }];
    updateMonster({ intentosHorriveis: newIntentos });
  };

  const removeIntentoHorrivel = (index) => {
    const newIntentos = (monsterData.intentosHorriveis || []).filter((_, i) => i !== index);
    updateMonster({ intentosHorriveis: newIntentos });
  };

  const updateAcaoGeral = (index, field, value) => {
    const newAcoes = [...(monsterData.acoesGerais || [])];
    newAcoes[index] = { ...newAcoes[index], [field]: value };
    updateMonster({ acoesGerais: newAcoes });
  };

  const addAcaoGeral = () => {
    const newAcoes = [...(monsterData.acoesGerais || []), { acao: '', descricao: '' }];
    updateMonster({ acoesGerais: newAcoes });
  };

  const removeAcaoGeral = (index) => {
    const newAcoes = (monsterData.acoesGerais || []).filter((_, i) => i !== index);
    updateMonster({ acoesGerais: newAcoes });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Arquivo muito grande! Máximo 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        updateMonster({ aparencia: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="monster-sheet-overlay" onClick={onClose}>
      <div className="monster-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="monster-header">
          <h2>BRUTAL - Ficha do Monstro</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="monster-content">
          {/* Linha Superior - Nome, Ameaças, PH */}
          <div className="monster-top-row">
            <div className="monster-field nome-field">
              <label>NOME</label>
              <input
                type="text"
                value={monsterData.nome}
                onChange={(e) => updateMonster({ nome: e.target.value })}
                placeholder="Nome da criatura"
              />
            </div>

            <div className="monster-field">
              <label>DESCRIÇÃO RÁPIDA</label>
              <input
                type="text"
                value={monsterData.descricao}
                onChange={(e) => updateMonster({ descricao: e.target.value })}
                placeholder="Breve descrição do killer..."
              />
            </div>
            
            <div className="monster-field ph-field">
              <label>PONTOS DE HORROR</label>
              <input
                type="number"
                value={monsterData.pontosHorror}
                onChange={(e) => updateMonster({ pontosHorror: parseInt(e.target.value) || 0 })}
                className="ph-input"
              />
            </div>
          </div>

          {/* Ameaças */}
          <div className="monster-field" style={{marginBottom: '20px'}}>
            <label>AMEAÇAS</label>
            <textarea
              value={monsterData.ameacas}
              onChange={(e) => updateMonster({ ameacas: e.target.value })}
              rows="3"
              placeholder="Descreva as ameaças do killer..."
            />
          </div>

          {/* Armadilhas, Sustos, Brutalidade, Etapas de Fuga */}
          <div className="monster-checkboxes-row">
            <div className="checkbox-group">
              <label className="group-label">ARMADILHAS</label>
              <div className="checkbox-list horizontal">
                {monsterData.armadilhas.map((checked, i) => (
                  <label key={i} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCheckbox('armadilhas', i)}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="checkbox-group">
              <label className="group-label">NÍVEL DE BRUTALIDADE</label>
              <input
                type="text"
                value={monsterData.nivelBrutalidade}
                onChange={(e) => updateMonster({ nivelBrutalidade: e.target.value })}
                className="brutalidade-input"
                placeholder=""
              />
            </div>
          </div>

          <div className="monster-checkboxes-row">
            <div className="checkbox-group">
              <label className="group-label">SUSTOS</label>
              <div className="checkbox-list horizontal">
                {monsterData.sustos.map((checked, i) => (
                  <label key={i} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCheckbox('sustos', i)}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="checkbox-group">
              <label className="group-label">ETAPAS DE FUGA</label>
              <input
                type="text"
                value={monsterData.etapasFuga}
                onChange={(e) => updateMonster({ etapasFuga: e.target.value })}
                className="brutalidade-input"
                placeholder=""
              />
            </div>
          </div>

          {/* Layout 2 Colunas */}
          <div className="monster-two-columns">
            {/* Coluna Esquerda */}
            <div className="monster-left-column">
              {/* Ações Únicas */}
              <div className="monster-section">
                <h3>AÇÕES ÚNICAS</h3>
                <textarea
                  value={monsterData.acoesUnicas}
                  onChange={(e) => updateMonster({ acoesUnicas: e.target.value })}
                  rows="8"
                  placeholder="Descreva as ações únicas da criatura..."
                />
              </div>

              {/* Aparência */}
              <div className="monster-section">
                <h3>APARÊNCIA</h3>
                <div className="aparencia-upload">
                  {monsterData.aparencia ? (
                    <div className="monster-image-preview">
                      <img src={monsterData.aparencia} alt="Criatura" />
                      <button 
                        className="remove-image-btn"
                        onClick={() => updateMonster({ aparencia: '' })}
                      >
                        ✕ Remover
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="image-upload-input"
                        id="monster-image-upload"
                      />
                      <label htmlFor="monster-image-upload" className="upload-label">
                        📷 Adicionar Imagem
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Habilidade Passiva */}
              <div className="monster-section">
                <h3>HABILIDADE PASSIVA</h3>
                <textarea
                  value={monsterData.habilidadePassiva}
                  onChange={(e) => updateMonster({ habilidadePassiva: e.target.value })}
                  rows="6"
                  placeholder="Descreva a habilidade passiva..."
                />
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="monster-right-column">
              {/* Intentos Horríveis */}
              <div className="monster-section">
                <div className="section-header-with-btn">
                  <h3>INTENTO HORRÍVEL</h3>
                  <button className="add-row-btn" onClick={addIntentoHorrivel} type="button">
                    + Adicionar Intento
                  </button>
                </div>
                <div className="intentos-table">
                  {(monsterData.intentosHorriveis || []).length > 0 && (
                    <div className="table-header">
                      <span className="col-ph">PH</span>
                      <span className="col-descricao">INTENTO HORRÍVEL</span>
                      <span className="col-action"></span>
                    </div>
                  )}
                  {(monsterData.intentosHorriveis || []).length === 0 ? (
                    <p className="empty-table-message">Nenhum intento adicionado. Clique em "+ Adicionar Intento" para começar.</p>
                  ) : (
                    (monsterData.intentosHorriveis || []).map((intento, index) => (
                      <div key={index} className="table-row">
                        <input
                          type="text"
                          className="ph-cell"
                          value={intento.ph}
                          onChange={(e) => updateIntentoHorrivel(index, 'ph', e.target.value)}
                          placeholder="PH"
                        />
                        <input
                          type="text"
                          className="descricao-cell"
                          value={intento.descricao}
                          onChange={(e) => updateIntentoHorrivel(index, 'descricao', e.target.value)}
                          placeholder="Descrição do intento..."
                        />
                        <button 
                          className="remove-row-btn" 
                          onClick={() => removeIntentoHorrivel(index)}
                          type="button"
                          title="Remover intento"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Ações Gerais */}
              <div className="monster-section">
                <div className="section-header-with-btn">
                  <h3>AÇÕES GERAIS</h3>
                  <button className="add-row-btn" onClick={addAcaoGeral} type="button">
                    + Adicionar Ação
                  </button>
                </div>
                <div className="acoes-table">
                  {(monsterData.acoesGerais || []).length > 0 && (
                    <div className="table-header">
                      <span className="col-acao">AÇÃO</span>
                      <span className="col-descricao-acao">DESCRIÇÃO</span>
                      <span className="col-action"></span>
                    </div>
                  )}
                  {(monsterData.acoesGerais || []).length === 0 ? (
                    <p className="empty-table-message">Nenhuma ação adicionada. Clique em "+ Adicionar Ação" para começar.</p>
                  ) : (
                    (monsterData.acoesGerais || []).map((acao, index) => (
                      <div key={index} className="table-row">
                        <input
                          type="text"
                          className="acao-cell"
                          value={acao.acao}
                          onChange={(e) => updateAcaoGeral(index, 'acao', e.target.value)}
                          placeholder="Nome da ação"
                        />
                        <textarea
                          className="descricao-acao-cell"
                          value={acao.descricao}
                          onChange={(e) => updateAcaoGeral(index, 'descricao', e.target.value)}
                          rows="2"
                          placeholder="Descrição da ação..."
                        />
                        <button 
                          className="remove-row-btn" 
                          onClick={() => removeAcaoGeral(index)}
                          type="button"
                          title="Remover ação"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Anotações */}
          <div className="monster-section anotacoes-section">
            <h3>ANOTAÇÕES</h3>
            <textarea
              value={monsterData.anotacoes}
              onChange={(e) => updateMonster({ anotacoes: e.target.value })}
              rows="4"
              placeholder="Anotações gerais sobre a criatura..."
            />
          </div>

          <div className="monster-actions">
            <button className="save-monster-btn" onClick={handleSave}>
              💾 Salvar Criatura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonsterSheet;
