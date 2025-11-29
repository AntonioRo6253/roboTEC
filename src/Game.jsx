import React, { useState, useRef } from 'react';
import FiguraContenedora from './components/FiguraContenedora.jsx';
import { icons } from './assets/icons.js';
import './game.css';

// si agregas un mapa añade el numero en linea 330
const maps = [
  [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 2],
  ],
  [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [0, 0, 0, 0, 2],
  ],
  [
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 0, 0, 0, 2],
  ],
  // Mapa 4 (difícil): requiere zigzag y evitar corredores estrechos
  [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 0, 2],
  ],
  // Mapa 5 (difícil): caminos con cul-de-sacs y desvíos
  [
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [0, 0, 0, 0, 2],
  ],
];

const initialPlayer = { x: 0, y: 0 };

function Game() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [player, setPlayer] = useState({ ...initialPlayer });
  const [program, setProgram] = useState([]); // Puede contener strings (bloques) o {type: 'figura', id}
  const [figuras, setFiguras] = useState([]); // [{id, contents: []}]
  const [feedback, setFeedback] = useState({ type: 'info', msg: 'Arrastra los bloques al área de programación y presiona "Ejecutar Programa"' });
  const [gameWon, setGameWon] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [insufficientSteps, setInsufficientSteps] = useState(false);
  const programAreaRef = useRef(null);
  const figuraIdRef = useRef(1);

  // Drag and drop
  const onDragStart = (e, direction) => {
    e.dataTransfer.setData('direction', direction);
  };
  const onDragStartFigura = (e) => {
    e.dataTransfer.setData('figura', 'figura');
  };
  // Flag para evitar doble inserción
  const skipNextDropRef = useRef(false);
  const onDrop = (e) => {
    e.preventDefault();
    if (isMoving) return;
    if (skipNextDropRef.current) {
      skipNextDropRef.current = false;
      return;
    }
    if (e.dataTransfer.getData('figura')) {
      // Añadir figura
      const id = figuraIdRef.current++;
      setFiguras((prev) => [...prev, { id, contents: [] }]);
      setProgram((prev) => {
        const newProgram = [...prev, { type: 'figura', id }];
        setFeedback({ type: 'info', msg: `Programa listo con ${newProgram.length} elemento(s)` });
        return newProgram;
      });
      return;
    }
    const direction = e.dataTransfer.getData('direction');
    if (direction) {
      setProgram((prev) => {
        const newProgram = [...prev, direction];
        setFeedback({ type: 'info', msg: `Programa listo con ${newProgram.length} elemento(s)` });
        return newProgram;
      });
    }
  };
  const onDragOver = (e) => {
    e.preventDefault();
  };

  // Remove block o figura
  const removeBlock = (idx) => {
    const item = program[idx];
    let newFiguras = figuras;
    if (typeof item === 'object' && item.type === 'figura') {
      newFiguras = figuras.filter(f => f.id !== item.id);
      setFiguras(newFiguras);
    }
    const newProgram = program.filter((_, i) => i !== idx);
    setProgram(newProgram);
    setFeedback({ type: 'info', msg: newProgram.length ? `Programa listo con ${newProgram.length} elemento(s)` : 'Arrastra los bloques al área de programación' });
  };

  // Reset level
  const resetLevel = () => {
    if (isMoving) return;
    setPlayer({ ...initialPlayer });
    setProgram([]);
    setFiguras([]);
    setGameWon(false);
    setInsufficientSteps(false);
    setFeedback({ type: 'info', msg: 'Nivel reiniciado. ¡Programa un nuevo camino!' });
  };

  // Change level
  const changeLevel = (level) => {
    if (isMoving) return;
    setCurrentLevel(level);
    setPlayer({ ...initialPlayer });
    setProgram([]);
    setFiguras([]);
    setGameWon(false);
    setInsufficientSteps(false);
    setFeedback({ type: 'info', msg: 'Arrastra los bloques al área de programación y presiona "Ejecutar Programa"' });
  };

  // Execute program
  const executeProgram = async () => {
    if (gameWon) {
      setFeedback({ type: 'info', msg: '¡Ya completaste este nivel! Cambia de nivel o reinicia para jugar de nuevo.' });
      return;
    }
    if (isMoving) {
      setFeedback({ type: 'error', msg: 'El personaje ya se está moviendo. Espera a que termine.' });
      return;
    }
    if (program.length === 0) {
      setFeedback({ type: 'error', msg: 'No hay movimientos programados. Arrastra bloques al área de programación.' });
      return;
    }
    setIsMoving(true);
    // Expandir programa para incluir contenidos de figuras repitiéndolos 4 veces
    const flatProgram = [];
    for (const step of program) {
      if (typeof step === 'string') {
        flatProgram.push(step);
      } else if (step.type === 'figura') {
        const fig = figuras.find(f => f.id === step.id);
        if (fig && fig.contents && fig.contents.length) {
          for (let r = 0; r < 4; r++) {
            flatProgram.push(...fig.contents);
          }
        }
      }
    }
    let { x, y } = player;
    const map = maps[currentLevel];
    let llegoMeta = false;
    for (let i = 0; i < flatProgram.length; i++) {
      let nx = x, ny = y;
      switch (flatProgram[i]) {
        case 'forward': ny = y - 1; break;
        case 'right': nx = x + 1; break;
        case 'left': nx = x - 1; break;
        case 'backward': ny = y + 1; break;
        default: break;
      }
      if (nx < 0 || nx >= map[0].length || ny < 0 || ny >= map.length || map[ny][nx] === 1) {
        await showCollision();
        setFeedback({ type: 'error', msg: `¡Movimiento inválido en el paso ${i + 1}! Te has chocado con un obstáculo o salido del mapa.` });
        setIsMoving(false);
        return;
      }
      x = nx; y = ny;
      await animateMove(x, y);
      if (map[y][x] === 2) {
        llegoMeta = true;
        break;
      }
    }
    setPlayer({ x, y });
    if (llegoMeta) {
      setGameWon(true);
      setFeedback({ type: 'success', msg: '¡Felicidades! Has llegado a la meta. ¡Nivel completado!' });
      setIsMoving(false);
      return;
    }
    // Si no llegó a la meta y terminó el programa
    setFeedback({ type: 'error', msg: '¡Pasos insuficientes! El personaje no llegó a la meta.' });
    setInsufficientSteps(true);
    setIsMoving(false);
  };

  // Animación de movimiento
  const animateMove = (x, y) => {
    return new Promise((resolve) => {
      setPlayer({ x, y });
      setTimeout(resolve, 500);
    });
  };

  // Mostrar colisión
  const showCollision = () => {
    return new Promise((resolve) => {
      // Aquí podrías agregar una animación visual
      setTimeout(resolve, 500);
    });
  };

  // Renderizar el mapa
  const renderMap = () => {
    const map = maps[currentLevel];
    return (
      <div className="map-grid" style={{ gridTemplateColumns: `repeat(${map[0].length}, 1fr)` }}>
        {map.map((row, y) =>
          row.map((cell, x) => {
            let cellClass = 'cell';
            if (cell === 0) cellClass += ' empty';
            if (cell === 1) cellClass += ' obstacle';
            if (cell === 2) cellClass += ' goal';
            if (x === 0 && y === 0) cellClass += ' start';
            if (player.x === x && player.y === y) cellClass += ' player';
            return (
              <div key={`${x},${y}`} className={cellClass}>
                {cell === 2 ? (
                  <span style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>{icons.goal}</span>
                ) : ''}
                {player.x === x && player.y === y ? (
                  <span style={{ fontSize: '2.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#4a4a4a' }}>{icons.robot}</span>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    );
  };

  // Renderizar bloques de movimiento y figura
  const renderBlocks = () => (
    <div className="blocks-container">
      {['forward', 'right', 'left', 'backward'].map((dir) => (
        <div
          key={dir}
          className={`movement-block ${dir}-block`}
          draggable
          onDragStart={(e) => onDragStart(e, dir)}
        >
          {icons[dir]}
        </div>
      ))}
      <div
        className="movement-block repeat-block"
        draggable
        onDragStart={onDragStartFigura}
        title="Arrastra para crear una figura contenedora"
      >
        {icons.repeat}
      </div>
    </div>
  );

  // Renderizar área de programación
  const addInternalToFigura = (id, direction) => {
    setFiguras(prev => prev.map(f => {
      if (f.id === id) {
        const contents = f.contents || [];
        if (contents.length >= 4) return f;
        return { ...f, contents: [...contents, direction] };
      }
      return f;
    }));
  };

  const removeInternalFromFigura = (id, idx) => {
    setFiguras(prev => prev.map(f => {
      if (f.id === id) {
        const contents = (f.contents || []).filter((_, i) => i !== idx);
        return { ...f, contents };
      }
      return f;
    }));
  };

  const renderProgramArea = () => (
    <div
      className="program-area"
      ref={programAreaRef}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {program.map((item, idx) => {
        if (typeof item === 'string') {
          return (
            <div key={idx} className={`program-block ${item}-block`}>
              {icons[item]}
              <div className="remove-btn" onClick={() => removeBlock(idx)}>×</div>
            </div>
          );
        } else if (item.type === 'figura') {
          const fig = figuras.find(f => f.id === item.id);
          return (
            <FiguraContenedora
              key={item.id}
              id={item.id}
              contents={fig ? fig.contents || [] : []}
              onRemove={() => removeBlock(idx)}
              onAddInternal={(dir) => { addInternalToFigura(item.id, dir); skipNextDropRef.current = true; }}
              onRemoveInternal={(internalIdx) => removeInternalFromFigura(item.id, internalIdx)}
            />
          );
        }
        return null;
      })}
    </div>
  );

  // Renderizar selector de nivel
  const renderLevelSelector = () => (
    <div className="level-selector">
      {[0, 1, 2, 3, 4].map((lvl) => (
        <button
          key={lvl}
          className={`level-btn${currentLevel === lvl ? ' active' : ''}`}
          onClick={() => changeLevel(lvl)}
        >
          {lvl + 1}
        </button>
      ))}
    </div>
  );

  return (
    <div className="game-container">
      <h1>Programa tu Camino</h1>
      <p className="game-description">Arrastra los bloques de movimiento para programar el camino del personaje hacia la meta.</p>
      <div className="level-info">
        <h2>Nivel <span id="currentLevel">{currentLevel + 1}</span></h2>
        {renderLevelSelector()}
      </div>
      <div className="game-content">
        <div className="map-container">
          <h2>Mapa</h2>
          {renderMap()}
        </div>
        <div className="programming-container">
          <h2>Programación</h2>
          {renderBlocks()}
          <h3>Secuencia de Movimientos</h3>
          {renderProgramArea()}
          <div className="buttons">
            <button id="executeBtn" onClick={executeProgram} disabled={isMoving || insufficientSteps}>Ejecutar Programa</button>
            <button id="resetBtn" onClick={resetLevel} disabled={isMoving}>Reiniciar Nivel</button>
          </div>
          <div className={`feedback ${feedback.type}`} id="feedback">
            {feedback.msg}
          </div>
          <div className="instructions">
            <h3>Instrucciones:</h3>
            <ul>
              <li>Arrastra los bloques de colores al área de programación</li>
              <li>Los movimientos se ejecutarán en el orden que los coloques</li>
              <li>Evita los obstáculos (casillas rojas)</li>
              <li>Llega a la meta (casilla azul) para completar el nivel</li>
              <li>Puedes eliminar bloques haciendo clic en la X</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
