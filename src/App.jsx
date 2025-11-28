
import { useState } from 'react';
import Game from './Game.jsx';
import Game2 from './Game2.jsx';
import './menu.css';

function App() {
  const [selectedGame, setSelectedGame] = useState(null);

  if (selectedGame === 'game1') {
    return (
      <>
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
          <button className="back-btn" onClick={() => setSelectedGame(null)}>Volver al Menú</button>
        </div>
        <Game />
      </>
    );
  }
  if (selectedGame === 'game2') {
    return (
      <>
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
          <button className="back-btn" onClick={() => setSelectedGame(null)}>Volver al Menú</button>
        </div>
        <Game2 />
      </>
    );
  }

  return (
    <div className="menu-container">
      <div className="menu-grid">
        <GamePanel
          title="Normal"
          videoSrc="/game1.mp4"
          onClick={() => setSelectedGame('game1')}
        />
        <GamePanel
          title="Dos Personajes"
          videoSrc="/game2.mp4"
          onClick={() => setSelectedGame('game2')}
        />
      </div>
    </div>
  );
}

function GamePanel({ title, videoSrc, onClick }) {
  const handleMouseEnter = (e) => {
    const video = e.currentTarget.querySelector('video');
    if (video) {
      video.play().catch(() => {});
    }
  };
  const handleMouseLeave = (e) => {
    const video = e.currentTarget.querySelector('video');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };
  return (
    <div
      className="game-panel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <video className="panel-video" src={videoSrc} muted loop playsInline preload="metadata" />
      <div className="panel-overlay">
        <h2 className={title === 'Dos Personajes' ? 'white-title' : ''}>{title}</h2>
        <p className="panel-hint">Hover para previsualizar · Click para entrar</p>
      </div>
    </div>
  );
}

export default App;
