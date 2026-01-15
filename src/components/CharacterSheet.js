import React, { useState, useEffect } from 'react';
import { ref, set, onValue, push } from 'firebase/database';
import { database } from '../firebase';
import { getArquetipoData } from '../data/arquetipos';
import { getHabilidadesData } from '../data/habilidades';
import { ACOES_COMUNS } from '../data/acoes';
import ArchetypeSelector from './ArchetypeSelector';
import './CharacterSheet.css';

// Lista de todos os arquétipos para a aba INICIATIVA
const ARQUETIPOS_LIST = [
  { nome: 'Heroína', frase: 'Vim salvar o dia!', cor: 'yellow', imagem: '/images/characters/heroina-mini-profile.png' },
  { nome: 'Atleta', frase: 'Sou forte, ok?', cor: 'blue', imagem: '/images/characters/atleta-mini-profile.png' },
  { nome: 'Valentona', frase: 'Ninguém mexe comigo!', cor: 'red', imagem: '/images/characters/valentona-mini-profile.png' },
  { nome: 'Esbelta', frase: 'Sou gostosa demais para morrer!', cor: 'purple', imagem: '/images/characters/esbelta-mini-profile.png' },
  { nome: 'Inocente', frase: 'Alguém me ajuda!', cor: 'cyan', imagem: '/images/characters/inocente-mini-profile.png' },
  { nome: 'Nerd', frase: 'Não sou muito boa de briga!', cor: 'violet', imagem: '/images/characters/nerd-mini-profile.png' },
  { nome: 'Relaxada', frase: 'Uh? Que?', cor: 'green', imagem: '/images/characters/relaxada-mini-profile.png' },
  { nome: 'Cética', frase: 'Isso não está acontecendo!', cor: 'gray', imagem: '/images/characters/cetica-mini-profile.png' }
];

const CharacterSheet = ({ user, initialArchetype }) => {
  const [activeTab, setActiveTab] = useState('iniciativa');
  const [showArchetypeSelector, setShowArchetypeSelector] = useState(false);
  const [showHabilidadeSelector, setShowHabilidadeSelector] = useState(false);
  const [character, setCharacter] = useState({
    nome: 'Nova personagem',
    pronomes: '',
    interprete: user.email || '',
    arquetipo: initialArchetype || 'Cética',
    ferida: 0,
    sequela: 0,
    marcadores: 0,
    recursos: '',
    dificuldade: 3,
    tensao: 0,
    habilidadesSelecionadas: [],
    cicatrizAdicionada: false,
    anotacoes: '',
    aparencia: '',
    apegos: '',
    itemIconico: '',
    relacaoAfetiva: '',
    desejoObscuro: '',
    imagemPersonagem: ''
  });

  // Sistema de dados
  const [pilhaComum, setPilhaComum] = useState([
    { id: 1, valor: 6 },
    { id: 2, valor: 6 },
    { id: 3, valor: 6 },
    { id: 4, valor: 6 },
    { id: 5, valor: 6 },
    { id: 6, valor: 6 }
  ]);
  const [pilhaFuga, setPilhaFuga] = useState([]);
  const [dadosRolagem, setDadosRolagem] = useState([]);
  const [draggedDice, setDraggedDice] = useState(null);

  // Sistema de marcadores (funciona como dados)
  const [marcadoresLista, setMarcadoresLista] = useState([]);
  const characterPath = `tables/${user.tableId}/characters/${user.userId}`;

  // Função para limpar e migrar dados antigos
  const cleanCharacterData = React.useCallback((data) => {
    const cleaned = {
      nome: typeof data.nome === 'string' ? data.nome : 'Nova personagem',
      pronomes: typeof data.pronomes === 'string' ? data.pronomes : '',
      interprete: typeof data.interprete === 'string' ? data.interprete : user.email || '',
      arquetipo: typeof data.arquetipo === 'string' ? data.arquetipo : 'Cética',
      ferida: typeof data.ferida === 'number' ? data.ferida : 0,
      sequela: typeof data.sequela === 'number' ? data.sequela : 0,
      marcadores: typeof data.marcadores === 'number' ? data.marcadores : 0,
      recursos: typeof data.recursos === 'string' ? data.recursos : '',
      dificuldade: typeof data.dificuldade === 'number' ? data.dificuldade : 3,
      tensao: typeof data.tensao === 'number' ? data.tensao : 0,
      habilidadesSelecionadas: Array.isArray(data.habilidadesSelecionadas)
        ? data.habilidadesSelecionadas
        : (data.habilidadeSelecionada && typeof data.habilidadeSelecionada === 'object' && data.habilidadeSelecionada.nome ? [data.habilidadeSelecionada] : []),
      cicatrizAdicionada: typeof data.cicatrizAdicionada === 'boolean' ? data.cicatrizAdicionada : false,
      anotacoes: typeof data.anotacoes === 'string' ? data.anotacoes : '',
      aparencia: typeof data.aparencia === 'string' ? data.aparencia : '',
      apegos: typeof data.apegos === 'string' ? data.apegos : '',
      itemIconico: typeof data.itemIconico === 'string' ? data.itemIconico : '',
      relacaoAfetiva: typeof data.relacaoAfetiva === 'string' ? data.relacaoAfetiva : '',
      desejoObscuro: typeof data.desejoObscuro === 'string' ? data.desejoObscuro : '',
      imagemPersonagem: typeof data.imagemPersonagem === 'string' ? data.imagemPersonagem : ''
    };
    return cleaned;
  }, [user.email]);

  useEffect(() => {
    const characterRef = ref(database, characterPath);
    const unsubscribe = onValue(characterRef, (snapshot) => {
      if (snapshot.exists()) {
        const loadedChar = cleanCharacterData(snapshot.val());
        // Se não tem habilidades selecionadas, define a primeira do arquétipo
        if (!loadedChar.habilidadesSelecionadas || loadedChar.habilidadesSelecionadas.length === 0) {
          const habilidadesData = getHabilidadesData(loadedChar.arquetipo);
          if (habilidadesData?.habilidades?.[0]) {
            loadedChar.habilidadesSelecionadas = [habilidadesData.habilidades[0]];
          }
        }
        setCharacter(prevChar => ({ ...prevChar, ...loadedChar }));
      } else if (initialArchetype) {
        const habilidadesData = getHabilidadesData(initialArchetype);
        const newCharacter = {
          nome: 'Nova personagem',
          pronomes: '',
          interprete: user.email || '',
          arquetipo: initialArchetype,
          ferida: 0,
          sequela: 0,
          marcadores: 0,
          recursos: '',
          dificuldade: 3,
          rolagens: '',
          pilhaDados: 6,
          pilhaFuga: 0,
          tensao: 0,
          habilidadesSelecionadas: habilidadesData?.habilidades?.[0] ? [habilidadesData.habilidades[0]] : [],
          cicatrizAdicionada: false
        };
        setCharacter(newCharacter);
        set(ref(database, characterPath), newCharacter);
      }
    });

    return () => unsubscribe(); //eslint-disable-next-line
  }, [characterPath, cleanCharacterData, initialArchetype]);

  const updateCharacter = (updates) => {
    const updatedCharacter = { ...character, ...updates };
    setCharacter(updatedCharacter);
    set(ref(database, characterPath), updatedCharacter);
  };

  const changeValue = (field, delta) => {
    const newValue = (character[field] || 0) + delta;
    updateCharacter({ [field]: Math.max(0, newValue) });
  };

  const handleArchetypeChange = (newArchetype) => {
    const habilidadesData = getHabilidadesData(newArchetype);
    updateCharacter({ 
      arquetipo: newArchetype,
          habilidadesSelecionadas: habilidadesData?.habilidades?.[0] ? [habilidadesData.habilidades[0]] : [],
      cicatrizAdicionada: false
    });
    setShowArchetypeSelector(false);
  };

  const handleHabilidadeSelect = (habilidade) => {
    const current = Array.isArray(character.habilidadesSelecionadas) ? character.habilidadesSelecionadas : [];
    const exists = current.some(h => h && h.nome === habilidade.nome);
    let updated;
    if (exists) {
      updated = current.filter(h => h.nome !== habilidade.nome);
    } else {
      updated = [...current, habilidade];
    }
    updateCharacter({ habilidadesSelecionadas: updated });
  };

  const handleCicatrizAdd = () => {
    const habilidadesData = getHabilidadesData(character.arquetipo);
    if (habilidadesData && habilidadesData.cicatriz) {
      updateCharacter({ cicatrizAdicionada: true });
    }
  };

  const handleCicatrizRemove = () => {
    updateCharacter({ cicatrizAdicionada: false });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCharacter({ imagemPersonagem: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Funções de Drag and Drop
  const handleDragStart = (e, dice, source) => {
    setDraggedDice({ dice, source });
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e, target) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (!draggedDice) return;

    const { dice, source } = draggedDice;

    // Não fazer nada se soltar no mesmo lugar
    if (source === target) {
      setDraggedDice(null);
      return;
    }

    // Remover do source
    if (source === 'comum') {
      setPilhaComum(prev => prev.filter(d => d.id !== dice.id));
    } else if (source === 'fuga') {
      setPilhaFuga(prev => prev.filter(d => d.id !== dice.id));
    } else if (source === 'rolagem') {
      setDadosRolagem(prev => prev.filter(d => d.id !== dice.id));
    }

    // Adicionar ao target
    if (target === 'comum') {
      setPilhaComum(prev => [...prev, dice]);
    } else if (target === 'fuga') {
      setPilhaFuga(prev => [...prev, dice]);
    } else if (target === 'rolagem') {
      setDadosRolagem(prev => [...prev, dice]);
    }

    setDraggedDice(null);
  };

  // Rolar dados
  const rolarDados = () => {
    if (dadosRolagem.length === 0) {
      alert('Adicione dados na área de rolagem antes de rolar!');
      return;
    }

    // Rolar todos os dados
    const dadosRolados = dadosRolagem.map(dice => ({
      ...dice,
      valor: Math.floor(Math.random() * 6) + 1
    }));
    
    setDadosRolagem(dadosRolados);

    // Calcular sucessos e fracassos baseado na dificuldade
    const dificuldade = character.dificuldade || 3;
    const valoresDados = dadosRolados.map(d => d.valor);
    const sucessos = valoresDados.filter(v => v >= dificuldade).length;
    const fracassos = valoresDados.filter(v => v < dificuldade).length;

    // Salvar no Firebase
    const resultadoRolagem = {
      nomePersonagem: character.nome || 'Sem Nome',
      nomeJogador: character.interprete || user.email || 'Jogador',
      pericia: 'Rolagem Manual', // Como não há seleção de perícia no sistema drag-and-drop
      treinada: false,
      numDados: dadosRolagem.length,
      dados: valoresDados,
      sucessos,
      fracassos,
      valorSucesso: dificuldade,
      timestamp: Date.now()
    };

    const rolagemRef = ref(database, `tables/${user.tableId}/rolls`);
    push(rolagemRef, resultadoRolagem);

    // Se houver fracassos, adicionar feridas
    if (fracassos > 0) {
      const ferida = character.ferida || 0;
      const novaFerida = Math.min(5, ferida + fracassos);
      updateCharacter({ ferida: novaFerida });
    }
  };

  // Descartar dados abaixo da dificuldade
  const descartarDados = () => {
    const dadosRestantes = dadosRolagem.filter(d => d.valor >= character.dificuldade);
    setDadosRolagem(dadosRestantes);
    // Opcionalmente, você pode fazer algo com os dados descartados
  };

  // Sacrificar - move dados da rolagem para pilha de fuga
  const sacrificarDados = () => {
    setPilhaFuga(prev => [...prev, ...dadosRolagem]);
    setDadosRolagem([]);
  };

  // Arriscar tudo - limpa todos os dados
  const arriscarTudo = () => {
    setPilhaComum([]);
    setPilhaFuga([]);
    setDadosRolagem([]);
  };
  
  // Adicionar novo dado à pilha comum
  const adicionarDado = () => {
    const maxId = Math.max(0, ...pilhaComum.map(d => d.id), ...pilhaFuga.map(d => d.id), ...dadosRolagem.map(d => d.id));
    setPilhaComum(prev => [...prev, { id: maxId + 1, valor: 6 }]);
  };

  // Adicionar marcador
  const adicionarMarcador = () => {
    const maxId = Math.max(0, ...marcadoresLista.map(m => m.id));
    setMarcadoresLista(prev => [...prev, { id: maxId + 1 }]);
  };

  // Remover marcador
  const removerMarcador = () => {
    if (marcadoresLista.length > 0) {
      setMarcadoresLista(prev => prev.slice(0, -1));
    }
  };
  
  const arquetipoData = getArquetipoData(character.arquetipo);
  const qualidades = arquetipoData ? arquetipoData.qualidades : ['Firme', 'Sagaz'];

  return (
    <>
      <div className="character-sheet-new">
        <div>
        {/* Compact Header Section */}
        <div className="compact-header-new">
          {/* Box 1: Avatar + Nome + Pronomes */}
          <div className="header-box char-info-box">
            <div className="char-avatar-mini">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <div 
                className="brutal-icon-triangle"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {character.imagemPersonagem ? (
                  <img src={character.imagemPersonagem} alt="Personagem" className="character-image" />
                ) : (
                  <div className="image-placeholder">+</div>
                )}
              </div>
            </div>
            <div className="char-fields">
              <div className="info-field-inline">
                <label>Nome</label>
                <input
                  type="text"
                  value={character.nome}
                  onChange={(e) => updateCharacter({ nome: e.target.value })}
                  placeholder="Nova personagem"
                />
              </div>
              <div className="info-field-split">
                <div className="info-field-inline">
                  <label>Pronomes</label>
                  <input
                    type="text"
                    value={character.pronomes}
                    onChange={(e) => updateCharacter({ pronomes: e.target.value })}
                  />
                </div>
                <div className="info-field-inline">
                  <label>Intérprete</label>
                  <input
                    type="text"
                    value={character.interprete}
                    onChange={(e) => updateCharacter({ interprete: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Ferida + Sequela */}
          <div className="header-box status-box-compact">
            <div className="status-item">
              <label>FERIDA</label>
              <div className="status-control-compact">
                <button onClick={() => changeValue('ferida', 1)}>+</button>
                <div className="status-value">{character.ferida}</div>
                <button onClick={() => changeValue('ferida', -1)}>−</button>
              </div>
            </div>
            <div className="status-item">
              <label>SEQUELA</label>
              <div className="status-control-compact">
                <button onClick={() => changeValue('sequela', 1)}>+</button>
                <div className="status-value">{character.sequela}</div>
                <button onClick={() => changeValue('sequela', -1)}>−</button>
              </div>
            </div>
          </div>

          {/* Box 3: Marcadores */}
          <div className="header-box marcadores-box">
            <label>MARCADORES</label>
            <div className="marcadores-grid">
              {marcadoresLista.map((marcador) => (
                <div key={marcador.id} className="marcador-item" onClick={removerMarcador}>
                  <div className="marcador-circle"></div>
                </div>
              ))}
              {marcadoresLista.length < 6 && (
                <div className="marcador-add" onClick={adicionarMarcador}>
                  <span>+</span>
                </div>
              )}
            </div>
          </div>

          {/* Box 4: Tensão + Botões */}
          <div className="header-box actions-box">
            <div className="tensao-compact">
              <div className="tensao-icon-wrapper-small">
                <img src="/images/objects/brutal-icon.webp" alt="Tensão" className="tensao-icon" />
                <span className="tensao-value">{character.tensao}</span>
              </div>
              <div className="tensao-label-small">PONTOS DE TENSÃO</div>
              <div className="tensao-controls-small">
                <button onClick={() => changeValue('tensao', -1)}>−</button>
                <button onClick={() => changeValue('tensao', 1)}>+</button>
              </div>
            </div>
            <button className="btn-arriscar-small" onClick={arriscarTudo}>
              ARRISCAR TUDO
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="sheet-content-new">
        {/* Left Column */}
        <div className="left-column-new">
          {/* Arquétipo Section */}
          <div className="arquetipo-section">
            <div className="arquetipo-header">
              <h3>{character.arquetipo || 'Selecione um Arquétipo'}</h3>
              <button type="button" className="edit-link" onClick={() => setShowArchetypeSelector(true)}>
                <img src="/images/objects/brutal-edit-icon.svg" alt="Edit" />
              </button>
            </div>
            
            <div className="arquetipo-qualities">
              <span className="quality-badge">{qualidades[0]}</span>
              <span className="quality-badge">{qualidades[1]}</span>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="tabs-section">
            <button 
              className={`tab-btn ${activeTab === 'vantagens' ? 'active' : ''}`}
              onClick={() => setActiveTab('vantagens')}
            >
              VANTAGENS
            </button>
            <button 
              className={`tab-btn ${activeTab === 'habilidades' ? 'active' : ''}`}
              onClick={() => setActiveTab('habilidades')}
            >
              HABILIDADES
            </button>
            <button 
              className={`tab-btn ${activeTab === 'acoes' ? 'active' : ''}`}
              onClick={() => setActiveTab('acoes')}
            >
              AÇÕES
            </button>
            <button 
              className={`tab-btn ${activeTab === 'iniciativa' ? 'active' : ''}`}
              onClick={() => setActiveTab('iniciativa')}
            >
              INICIATIVA
            </button>
            <button 
              className={`tab-btn ${activeTab === 'detalhes' ? 'active' : ''}`}
              onClick={() => setActiveTab('detalhes')}
            >
              DETALHES
            </button>
          </div>

          {/* Tab Content - Vantagens */}
          {activeTab === 'vantagens' && arquetipoData && (
            <div className="tab-content vantagens-content">
              {arquetipoData.vantagens.map((vantagem, index) => (
                <div key={index} className="vantagem-card">
                  <div className="vantagem-header">
                    <div className="vantagem-icon">
                      <img src="/images/objects/brutal-icon.webp" alt="fire" />
                      <span className="vantagem-cost">{vantagem.custo}</span>
                    </div>
                    <div className="vantagem-info">
                      <div className="vantagem-type">{vantagem.categoria}</div>
                      <div className="vantagem-refresh">
                        <img src="/images/objects/brutal-recarga-icon.svg" alt="refresh" />
                        <span>{vantagem.restricao || vantagem.categoria}</span>
                      </div>
                    </div>
                  </div>
                  <h4 className="vantagem-title">{vantagem.nome}</h4>
                  <p className="vantagem-description">{vantagem.descricao}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content - Habilidades */}
          {activeTab === 'habilidades' && arquetipoData && (
            <div className="tab-content habilidades-content">
              {(() => {
                const habilidadesData = getHabilidadesData(character.arquetipo);
                return (
                  <>
                    {/* Habilidades Selecionadas */}
                    <div className="habilidade-section">
                      <h3>Habilidades</h3>
                      {character.habilidadesSelecionadas && character.habilidadesSelecionadas.length > 0 ? (
                        <div className="habilidades-list">
                          {character.habilidadesSelecionadas.map((hab, idx) => (
                            <div key={idx} className="habilidade-card">
                              <div className="vantagem-header">
                                <div className="vantagem-icon-container">
                                  <img src="/images/objects/brutal-skull-icon.svg" alt="habilidade" />
                                </div>
                                <div className="vantagem-info">
                                  <div className="vantagem-refresh">
                                    <img src="/images/objects/brutal-recarga-icon.svg" alt="refresh" />
                                    <span>{hab.restricao}</span>
                                  </div>
                                </div>
                                <button 
                                  className="remove-icon-btn"
                                  onClick={() => handleHabilidadeSelect(hab)}
                                  title="Remover habilidade"
                                >
                                  ❌
                                </button>
                              </div>
                              <h4 className="vantagem-title">{hab.nome}</h4>
                              <p className="vantagem-description">{hab.descricao}</p>
                            </div>
                          ))}
                          <button 
                            className="edit-habilidades-btn"
                            onClick={() => setShowHabilidadeSelector(true)}
                            title="Editar habilidades"
                          >
                            <img src="/images/objects/brutal-edit-icon.svg" alt="Editar" className="edit-btn-icon" />
                            <span>Editar Habilidades</span>
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="select-habilidade-btn"
                          onClick={() => setShowHabilidadeSelector(true)}
                        >
                          Selecionar Habilidade
                        </button>
                      )}
                    </div>

                    {/* Cicatriz */}
                    <div className="cicatriz-section">
                      <h3>Cicatriz</h3>
                      {character.cicatrizAdicionada && habilidadesData?.cicatriz ? (
                        <div className="cicatriz-card">
                          <div className="vantagem-header">
                            <div className="vantagem-icon-container">
                              <img src="/images/objects/heart-icon.svg" alt="cicatriz" />
                            </div>
                            <div className="vantagem-info">
                              <div className="vantagem-refresh">
                                <img src="/images/objects/brutal-recarga-icon.svg" alt="refresh" />
                                <span>{habilidadesData.cicatriz.restricao}</span>
                              </div>
                            </div>
                            <button 
                              className="remove-icon-btn"
                              onClick={handleCicatrizRemove}
                              title="Remover cicatriz"
                            >
                              ❌
                            </button>
                          </div>
                          <h4 className="vantagem-title">{habilidadesData.cicatriz.nome}</h4>
                          <p className="vantagem-description">{habilidadesData.cicatriz.descricao}</p>
                        </div>
                      ) : (
                        <button 
                          className="add-cicatriz-btn"
                          onClick={handleCicatrizAdd}
                        >
                          Adicionar Cicatriz
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Tab Content - Ações */}
          {activeTab === 'acoes' && (
            <div className="tab-content acoes-content">
              <div className="acoes-grid">
                {ACOES_COMUNS.map((acao, index) => (
                  <div key={index} className="acao-card">

                    <h4 className="acao-title">{acao.nome}</h4>
                    <p className="acao-description">{acao.descricao}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content - Iniciativa */}
          {activeTab === 'iniciativa' && (
            <div className="tab-content iniciativa-content">
              {ARQUETIPOS_LIST.map((arq, index) => (
                <div 
                  key={index} 
                  className={`character-list-item ${arq.nome === character.arquetipo ? 'is-you' : ''}`}
                  data-color={arq.cor}
                >
                  <span className="char-number">{index + 1}</span>
                  <div className="char-info-wrapper">
                    <div className="char-name-tag">{arq.nome.toUpperCase()}</div>
                    <div className="char-quote">{arq.frase}</div>
                  </div>
                  {arq.nome === character.arquetipo && (
                    <span className="char-tag-you">VOCÊ</span>
                  )}
                  <img src={arq.imagem} alt={arq.nome} className="char-mini-avatar" />
                </div>
              ))}
            </div>
          )}

          {/* Tab Content - Detalhes */}
          {activeTab === 'detalhes' && (
            <div className="tab-content detalhes-content">
              <div className="detalhes-field">
                <label>Anotações</label>
                <textarea
                  value={character.anotacoes}
                  onChange={(e) => updateCharacter({ anotacoes: e.target.value })}
                  placeholder="Suas anotações sobre o personagem..."
                />
              </div>

              <div className="detalhes-field">
                <label>Aparência</label>
                <textarea
                  value={character.aparencia}
                  onChange={(e) => updateCharacter({ aparencia: e.target.value })}
                  placeholder="Descrição física do personagem..."
                />
              </div>

              <div className="detalhes-field">
                <label>Apegos</label>
                <textarea
                  value={character.apegos}
                  onChange={(e) => updateCharacter({ apegos: e.target.value })}
                  placeholder="O que é importante para sua personagem..."
                />
              </div>

              <div className="detalhes-field">
                <label>Item Icônico</label>
                <textarea
                  value={character.itemIconico}
                  onChange={(e) => updateCharacter({ itemIconico: e.target.value })}
                  placeholder="Um objeto significativo que carrega..."
                />
              </div>

              <div className="detalhes-field">
                <label>Relação Afetiva</label>
                <textarea
                  value={character.relacaoAfetiva}
                  onChange={(e) => updateCharacter({ relacaoAfetiva: e.target.value })}
                  placeholder="Pessoas importantes na vida da personagem..."
                />
              </div>

              <div className="detalhes-field">
                <label>Desejo Obscuro</label>
                <textarea
                  value={character.desejoObscuro}
                  onChange={(e) => updateCharacter({ desejoObscuro: e.target.value })}
                  placeholder="Um desejo secreto ou obscuro..."
                />
              </div>
            </div>
          )}

          
        </div>

        {/* Middle Column */}
        <div className="middle-column-new">
          {/* Recursos + Dificuldade lado a lado */}
          <div className="recursos-dificuldade-row">
            <div className="middle-recursos-section">
              <h3>RECURSOS</h3>
              <textarea
                value={character.recursos}
                onChange={(e) => updateCharacter({ recursos: e.target.value })}
                placeholder="Insira aqui um recurso e seu número de usos."
              />
            </div>

            <div className="middle-dificuldade-section">
              <label>DIFICULDADE</label>
              <div className="dificuldade-control">
                <span>Acima de</span>
                <input
                  type="number"
                  value={character.dificuldade}
                  onChange={(e) => updateCharacter({ dificuldade: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          {/* Rolagens + Pilhas + Botões */}
          <div className="rolagens-actions-container">
            <div className="middle-rolagens-section">
              <h3>ROLAGENS</h3>
              <div 
                className="rolagens-display"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'rolagem')}
              >
                <div className="rolagens-dice-area">
                  {dadosRolagem.map(dice => (
                    <div
                      key={dice.id}
                      className="dice-in-rolagem"
                      draggable
                      onDragStart={(e) => handleDragStart(e, dice, 'rolagem')}
                      onDragEnd={handleDragEnd}
                    >
                      <img src="/images/objects/brutal-dice.png" alt="Dado" />
                      <span className="dice-value">{dice.valor}</span>
                    </div>
                  ))}
                  {dadosRolagem.length === 0 && (
                    <div className="rolagens-empty-state">
                      Arraste dados aqui para rolar
                    </div>
                  )}
                </div>
              </div>
              
              {/* Dice Pools abaixo da área de rolagens */}
              <div className="dice-pools-below">
              <div 
                className="pool pilha-comum"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'comum')}
              >
                <h3>PILHA COMUM</h3>
                <div className="dice-grid">
                  {pilhaComum.map((dice) => (
                    <div 
                      key={dice.id} 
                      className="dice-box active"
                      draggable
                      onDragStart={(e) => handleDragStart(e, dice, 'comum')}
                      onDragEnd={handleDragEnd}
                    >
                      <img src="/images/objects/brutal-dice.png" alt="Dado" className="dice-image" />
                      <span className="dice-number">{dice.valor}</span>
                    </div>
                  ))}
                  {/* Botão de adicionar dado quando tiver menos de 6 */}
                  {pilhaComum.length < 6 && (
                    <div 
                      className="dice-box add-dice"
                      onClick={adicionarDado}
                    >
                      <img src="/images/objects/brutal-dice-alt.svg" alt="Add" className="dice-image" />
                      <img src="/images/objects/brutal-plus-icon.svg" alt="Plus" className="plus-icon" />
                    </div>
                  )}
                  {/* Preencher com boxes vazios para manter grid */}
                  {Array(Math.max(0, 5 - pilhaComum.length)).fill(0).map((_, i) => (
                    <div key={`empty-comum-${i}`} className="dice-box empty"></div>
                  ))}
                </div>
              </div>

              <div 
                className="pool pilha-fuga"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'fuga')}
              >
                <h3>PILHA DE FUGA</h3>
                <div className="dice-grid">
                  {pilhaFuga.map((dice) => (
                    <div 
                      key={dice.id} 
                      className="dice-box active"
                      draggable
                      onDragStart={(e) => handleDragStart(e, dice, 'fuga')}
                      onDragEnd={handleDragEnd}
                    >
                      <img src="/images/objects/brutal-dice.png" alt="Dado" className="dice-image" />
                      <span className="dice-number">{dice.valor}</span>
                    </div>
                  ))}
                  {/* Preencher com boxes vazios para manter grid 3x2 */}
                  {Array(6 - pilhaFuga.length).fill(0).map((_, i) => (
                    <div key={`empty-fuga-${i}`} className="dice-box empty"></div>
                  ))}
                </div>
              </div>
            </div>
            </div>
            
            {/* Action Buttons ao lado */}
            <div className="action-buttons-side">
              <button className="btn-descartar" onClick={descartarDados}>
                <img src="/images/objects/brutal-trash-icon.svg" alt="trash" />
                DESCARTAR
              </button>
              <button className="btn-sacrificar" onClick={sacrificarDados}>
                <img src="/images/objects/brutal-skull-icon.svg" alt="skull" />
                SACRIFICAR
              </button>
              <button className="btn-rolar" onClick={rolarDados}>
                <img src="/images/objects/brutal-dice-icon.svg" alt="dice" />
                ROLAR
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
      

      {/* Archetype Selector Modal */}
      {showArchetypeSelector && (
        <ArchetypeSelector onSelectArchetype={handleArchetypeChange} />
      )}

      {/* Habilidade Selector Modal */}
      {showHabilidadeSelector && (
        <div className="modal-overlay" onClick={() => setShowHabilidadeSelector(false)}>
          <div className="modal-content habilidade-selector" onClick={(e) => e.stopPropagation()}>
            <h2>Selecionar Habilidade</h2>
            <div className="habilidades-grid">
              {(() => {
                const habilidadesData = getHabilidadesData(character.arquetipo);
                return habilidadesData?.habilidades.map((habilidade, index) => {
                  const isSelected = (character.habilidadesSelecionadas || []).some(h => h && h.nome === habilidade.nome);
                  return (
                  <div 
                    key={index}
                    className={`habilidade-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleHabilidadeSelect(habilidade)}
                  >
                    <div className="vantagem-header">
                      <div className="vantagem-icon-container">
                        <img src="/images/objects/brutal-skull-icon.svg" alt="habilidade" />
                      </div>
                      <div className="vantagem-info">
                        <div className="vantagem-refresh">
                          <img src="/images/objects/brutal-recarga-icon.svg" alt="refresh" />
                          <span>{habilidade.restricao}</span>
                        </div>
                      </div>
                    </div>
                    <h4 className="vantagem-title">{habilidade.nome}</h4>
                    <p className="vantagem-description">{habilidade.descricao}</p>
                  </div>
                );
                });
              })()}
            </div>
            <button className="close-modal-btn" onClick={() => setShowHabilidadeSelector(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CharacterSheet;
