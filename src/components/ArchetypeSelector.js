import React, { useState } from 'react';
import './ArchetypeSelector.css';

const ARQUETIPOS = [
  { nome: 'Atleta', imagem: '/images/characters/atleta-profile.png' },
  { nome: 'Cética', imagem: '/images/characters/cetica-profile.png' },
  { nome: 'Esbelta', imagem: '/images/characters/esbelta-profile.png' },
  { nome: 'Heroína', imagem: '/images/characters/heroina-profile.png' },
  { nome: 'Inocente', imagem: '/images/characters/inocente-profile.png' },
  { nome: 'Nerd', imagem: '/images/characters/nerd-profile.png' },
  { nome: 'Relaxada', imagem: '/images/characters/relaxada-profile.png' },
  { nome: 'Valentona', imagem: '/images/characters/valentona-profile.png' }
];

const ArchetypeSelector = ({ onSelectArchetype }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleSelect = (arquetipo) => {
    onSelectArchetype(arquetipo.nome);
  };

  return (
    <div className="archetype-selector-overlay">
      <div className="archetype-selector-container">
        <div className="archetype-header">
          <p className="archetype-subtitle">
            A diretora arranca o roteiro de suas mãos enquanto as câmeras lhe encontram. Você decidirá o caminho, mas o destino será brutal.
          </p>
          <div className="archetype-title-box">
            <h1 className="archetype-title">QUEM É VOCÊ?</h1>
          </div>
        </div>

        <div className="archetype-grid">
          {ARQUETIPOS.map((arquetipo, index) => (
            <div
              key={arquetipo.nome}
              className={`archetype-card ${hoveredIndex === index ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleSelect(arquetipo)}
            >
              <div className="archetype-image-wrapper">
                <img
                  src={arquetipo.imagem}
                  alt={arquetipo.nome}
                  className="archetype-image"
                />
                <div className="archetype-glow"></div>
              </div>
              <h3 className="archetype-name">{arquetipo.nome.toUpperCase()}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchetypeSelector;
