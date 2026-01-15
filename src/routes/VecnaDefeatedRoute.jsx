import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

const VecnaDefeatedRoute = () => {
  const { resetGame } = useContext(GameContext);
  const navigate = useNavigate();

  const handleRestart = () => {
    resetGame();
    navigate("/");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-red-600 overflow-hidden">

      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.9)),
            url("https://media.giphy.com/media/xT9Igmu79BG4QESMwM/giphy.gif")
          `,
        }}
      />

      <div className="text-center animate-fadeIn">
        <h1 className="text-6xl tracking-[0.6em] mb-12 animate-pulse">
          VECNA DEFEATED
        </h1>

        <button
          onClick={handleRestart}
          className="
            px-14 py-4
            rounded-full
            border border-red-600
          text-red-500
            tracking-[0.4em]
          hover:bg-red-600 hover:text-black
            transition-all duration-500
            shadow-[0_0_30px_rgba(150,0,0,0.6)]
            hover:scale-105
           "
        >
          RESTART GAME
        </button>
      </div>
    </div>
  );
};

export default VecnaDefeatedRoute;
