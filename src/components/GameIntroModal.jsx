import { useState } from "react";
import "../styles/gameIntro.css";

const GameIntroModal = ({ onConfirm }) => {
  return (
    <div className="game-intro-overlay">
      <div className="game-intro-modal">

        <h1 className="game-title">STRANGER THINGS</h1>
        <p className="game-subtitle">GAME RULES</p>

        <div className="rules-block">
          <p className="rules-heading">OBJECTIVE</p>
          <p className="rules-text">
            Prevent Vecna from corrupting the timeline.
            Your actions determine the survival of each century.
          </p>
        </div>

        <div className="rules-block">
          <p className="rules-heading">ENGAGEMENT PROTOCOLS</p>

          <ul className="rules-list">
            <li>Vecna curses 12 children every century.</li>
            <li>Each curse takes time — react quickly.</li>
            <li>Click repeatedly to charge Eleven’s power.</li>
            <li>Stopping interaction causes power to drain.</li>
            <li>If Eleven finishes first, the century and children are saved.</li>
            <li>If Vecna finishes first, the century is destroyed forever.</li>
          </ul>
        </div>

        <div className="rules-block danger">
          <p className="rules-heading danger-text">OPERATOR WARNING</p>
          <p className="rules-text danger-text">
            This experience contains intense visuals,
            irreversible decisions, and psychological pressure.
          </p>
        </div>

        <div className="rules-footer">
          <button className="confirm-btn" onClick={onConfirm}>
            CONFIRM AND START 
          </button>
        </div>


      </div>
    </div>
  );
};

export default GameIntroModal;
