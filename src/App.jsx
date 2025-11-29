
import { useState } from 'react';
import Game from './Game.jsx';
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
      {/* Logo centrado con enlace a GitHub */}
      <a
        href="https://github.com/AntonioRo6253/roboTEC"
        target="_blank"
        rel="noopener noreferrer"
        className="center-logo-link"
        aria-label="Ir al repositorio en GitHub"
      >
        <img src="/github.svg" alt="Logo" className="center-logo" />
        <span
          className="center-logo-hint"
          data-default="Explorar Repositorio"
          data-hover="Explorar Repositorio"
        />
      </a>
      <div className="menu-grid">
        <GamePanel
          title="Normal"
          videoSrc="/video/game1.mp4"
          onClick={() => setSelectedGame('game1')}
        />
        <GamePanel
          title={<>Dos<br/>Jugadores</>}
          videoSrc="/video/game2.mp4"
          onClick={() => {
            // Redirige al archivo estático movido a public
            window.location.href = '/Game2.html';
          }}
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
