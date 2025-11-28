import React, { useState, useRef, useEffect } from 'react';
import './game2.css';

// Dimensiones usadas para cálculo de colisiones
const ROBOT_W = 70;
const ROBOT_H = 70;
const STEP_NORMAL = 50;
const STEP_TURBO = 90;
const STEP_VERTICAL = 30;

function Game2() {
  const [turno, setTurno] = useState(1); // 1 o 2
  const [seq, setSeq] = useState([]); // comandos acumulados
  const [isRunning, setIsRunning] = useState(false);
  const [pos, setPos] = useState({
    r1: { x: 16, y: 50 }, // coordenadas relativas al lane
    r2: { x: 16, y: 50 }
  });
  const [score, setScore] = useState({ r1: 0, r2: 0 });
  const [coins, setCoins] = useState({
    lane1: [
      { id: 'c1', x: 430, y: 70, used: false }
    ],
    lane2: [
      { id: 'c2', x: 480, y: 70, used: false }
    ]
  });
  const [obstacles] = useState({
    // Los obstáculos actúan como meta y se alinearán al eje X de la meta.
    lane1: [ { id: 'o1', x: 0, y: 50, w: 10, h: 130 } ],
    lane2: [ { id: 'o2', x: 0, y: 50, w: 10, h: 130 } ]
  });

  const lane1Ref = useRef(null);
  const lane2Ref = useRef(null);

  // Añadir comando
  function add(cmd) {
    if (isRunning) return;
    setSeq(s => [...s, cmd]);
  }

  function clearSeq() {
    if (isRunning) return;
    setSeq([]);
  }

  async function run() {
    if (isRunning || seq.length === 0) return;
    setIsRunning(true);
    const id = turno === 1 ? 'r1' : 'r2';
    const laneRef = turno === 1 ? lane1Ref : lane2Ref;
    const laneWidth = laneRef.current ? laneRef.current.clientWidth : 900; // fallback
    const laneHeight = laneRef.current ? laneRef.current.clientHeight : 170;

    let newPos = { ...pos[id] };

    for (const cmd of seq) {
      await sleep(300);
      if (cmd === 'right') newPos.x += STEP_NORMAL;
      if (cmd === 'left') newPos.x -= STEP_NORMAL;
      if (cmd === 'turbo') newPos.x += STEP_TURBO;
      if (cmd === 'up') newPos.y -= STEP_VERTICAL;
      if (cmd === 'down') newPos.y += STEP_VERTICAL;
      // clamp
      newPos.x = clamp(newPos.x, 0, laneWidth - ROBOT_W - 10);
      newPos.y = clamp(newPos.y, 10, laneHeight - ROBOT_H - 10);

      // aplicar posición parcial para colisiones
      setPos(p => ({ ...p, [id]: { ...newPos } }));
      detectarColisiones(id, newPos, turno === 1 ? 'lane1' : 'lane2');

      // victoria
      if (newPos.x > laneWidth - 100) {
        alert(`GANA JUGADOR ${turno}`);
        resetJuego();
        return;
      }
    }

    // Final turno
    setSeq([]);
    setTurno(t => t === 1 ? 2 : 1);
    setIsRunning(false);
  }

  function resetJuego() {
    setSeq([]);
    setTurno(1);
    setPos({ r1: { x: 16, y: 50 }, r2: { x: 16, y: 50 } });
    setScore({ r1: 0, r2: 0 });
    setCoins({
      lane1: [ { id: 'c1', x: 430, y: 70, used: false } ],
      lane2: [ { id: 'c2', x: 480, y: 70, used: false } ]
    });
    setIsRunning(false);
  }

  function getMetaX(laneRef) {
    const laneWidth = laneRef.current ? laneRef.current.clientWidth : 900;
    // La meta en CSS está a right:18px con width:10px → borde izquierdo ≈ laneWidth - 28
    return laneWidth - 28;
  }

  function detectarColisiones(id, rPos, laneKey) {
    // Robot rect
    const robotRect = { x: rPos.x, y: rPos.y, w: ROBOT_W, h: ROBOT_H };

    // Monedas
    setCoins(prev => {
      const nuevo = { ...prev };
      nuevo[laneKey] = nuevo[laneKey].map(c => {
        if (!c.used && rectOverlap(robotRect, { x: c.x, y: c.y, w: 26, h: 26 })) {
          c.used = true;
          setScore(s => ({ ...s, [id]: s[id] + 10 }));
        }
        return c;
      });
      return nuevo;
    });

    // Obstáculos como META: al tocar, victoria inmediata
    const metaX = laneKey === 'lane1' ? getMetaX(lane1Ref) : getMetaX(lane2Ref);
    obstacles[laneKey].forEach(o => {
      const metaRect = { x: metaX, y: o.y, w: o.w, h: o.h };
      if (rectOverlap(robotRect, metaRect)) {
        alert(`GANA JUGADOR ${id === 'r1' ? 1 : 2}`);
        resetJuego();
      }
    });
  }

  return (
    <div className="carrera-root">
      <div className="juego-wrapper">
        <div className="pista">
          <div className="meta" />
          {/* Lane 1 */}
          <div className="lane" ref={lane1Ref}>
            <Robot id="r1" pos={pos.r1} turnoActual={turno} jugador={1} />
            {coins.lane1.map(c => (
              <div key={c.id} className="moneda" style={{ left: c.x, top: c.y, display: c.used ? 'none' : 'block' }} />
            ))}
            {obstacles.lane1.map(o => (
              <div
                key={o.id}
                className="obs"
                style={{ left: getMetaX(lane1Ref), top: o.y, width: o.w, height: o.h }}
              />
            ))}
          </div>
          {/* Lane 2 */}
          <div className="lane" ref={lane2Ref}>
            <Robot id="r2" pos={pos.r2} turnoActual={turno} jugador={2} />
            {coins.lane2.map(c => (
              <div key={c.id} className="moneda" style={{ left: c.x, top: c.y, display: c.used ? 'none' : 'block' }} />
            ))}
            {obstacles.lane2.map(o => (
              <div
                key={o.id}
                className="obs"
                style={{ left: getMetaX(lane2Ref), top: o.y, width: o.w, height: o.h }}
              />
            ))}
          </div>
        </div>
        <div className="panel-control">
          <h2>Carrera Robots</h2>
            <div className="turno">Turno: Jugador {turno}</div>
            <div className="btn-group">
              <button className="avanzar" onClick={() => add('right')} disabled={isRunning}>➡ DERECHA</button>
              <button className="retro" onClick={() => add('left')} disabled={isRunning}>⬅ IZQUIERDA</button>
              <button className="turbo" onClick={() => add('turbo')} disabled={isRunning}>⚡ TURBO</button>
              <button className="arriba" onClick={() => add('up')} disabled={isRunning}>⬆ ARRIBA</button>
              <button className="abajo" onClick={() => add('down')} disabled={isRunning}>⬇ ABAJO</button>
              <button className="esperar" onClick={() => add('wait')} disabled={isRunning}>⌛ ESPERAR</button>
            </div>
            <div id="secuencia" className="secuencia-box">{seq.join(' , ')}</div>
            <div className="acciones">
              <button onClick={run} disabled={isRunning || seq.length===0}>▶ EJECUTAR</button>
              <button onClick={clearSeq} disabled={isRunning}>🗑 BORRAR</button>
              <button onClick={resetJuego} disabled={isRunning}>🔄 REINICIAR</button>
            </div>
            <div className="puntos">
              <div>J1: <span>{score.r1}</span></div>
              <div>J2: <span>{score.r2}</span></div>
            </div>
            <div className="ayuda">
              <p>Programa movimientos para tu robot y ejecuta. Monedas valen 10 puntos. Chocar con un obstáculo te hace retroceder.</p>
            </div>
        </div>
      </div>
    </div>
  );
}

function Robot({ id, pos, turnoActual, jugador }) {
  return (
    <div
      id={id}
      className={"robot " + (id === 'r2' ? 'robot2' : '') + (turnoActual === jugador ? ' activo' : '')}
      style={{ left: pos.x, top: pos.y }}
    >
      🤖
    </div>
  );
}

// Utilidades
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function rectOverlap(a, b) {
  return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export default Game2;
