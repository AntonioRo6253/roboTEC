import React, { useState } from 'react';
import { icons } from './assets/icons.js';
import './game.css';

// Figura que puede contener hasta 4 bloques y permite quitar bloques internos y la figura misma
function FiguraContenedora({ onRemove, id, onAddInternal, contents = [], onRemoveInternal }) {
  // Esta figura delega el estado de contenidos al padre mediante props

  // Permitir arrastrar bloques dentro de la figura
  const onDrop = (e) => {
    e.preventDefault();
    if (contents.length >= 4) return;
    const direction = e.dataTransfer.getData('direction');
    if (!direction) return;
    // Notificar al padre para agregar a contenidos y NO al programa principal
    if (onAddInternal) onAddInternal(direction);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  // Quitar bloque interno
  const removeInternal = (idx) => {
    if (onRemoveInternal) onRemoveInternal(idx);
  };

  return (
    <div className="figura-contenedora" onDrop={onDrop} onDragOver={onDragOver}>
      <div className="figura-header">
        <span>{icons.repeat} Repetir 4 veces (4 max)</span>
        <span className="remove-btn" onClick={() => onRemove(id)}>×</span>
      </div>
      <div className="figura-interna">
        {contents.map((dir, idx) => (
          <div key={idx} className={`program-block ${dir}-block`}>
            {icons[dir]}
            <div className="remove-btn" onClick={() => removeInternal(idx)}>×</div>
          </div>
        ))}
        {contents.length < 4 && <div className="figura-placeholder">Arrastra aquí</div>}
      </div>
    </div>
  );
}

export default FiguraContenedora;
