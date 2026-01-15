import { useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import ChildCard from "../components/ChildCard";

const LEVELS = ["—", "BAD", "GOOD", "GREAT", "EXCELLENT"];
const CLICKS_PER_LEVEL = 30;
const MAX_CLICKS = 120;

const ElevenRoute = () => {
  const { history, centuryStatus, saveCentury } = useContext(GameContext);

  const [totalClicks, setTotalClicks] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const decayRef = useRef(null);
  const navigate = useNavigate();

  const handleInteract = () => {
    if (centuryStatus !== "RUNNING" || showOverlay) return;

    setTotalClicks((prev) => {
      const next = prev + 1;
      if (next >= MAX_CLICKS) {
        setShowOverlay(true);
        saveCentury();
        setTimeout(() => setShowOverlay(false), 3000);
        return prev;
      }
      return next;
    });
  };

  useEffect(() => {
    decayRef.current = setInterval(() => {
      setTotalClicks((c) => (c > 0 ? c - 1 : 0));
    }, 1200);

    return () => clearInterval(decayRef.current);
  }, []);

  useEffect(() => {
    if (centuryStatus !== "RUNNING") setTotalClicks(0);
  }, [centuryStatus]);

  useEffect(() => {
  if (centuryStatus === "VECNA_DEFEATED") {
    navigate("/vecna-defeated");
  }
}, [centuryStatus, navigate]);


  const levelIndex = Math.min(
    Math.floor(totalClicks / CLICKS_PER_LEVEL),
    LEVELS.length - 1
  );

  const progress =
    ((totalClicks % CLICKS_PER_LEVEL) / CLICKS_PER_LEVEL) * 100;

  const savedMap = new Map();
  history
    .filter(h => h.status === "SAVED")
    .forEach(h => {
      h.saved.forEach(child => {
        savedMap.set(child.id, child);
      });
    });
  const savedChildren = Array.from(savedMap.values());

  return (
    <div className="min-h-screen px-10 py-16 text-blue-200 relative">

      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.1)),
            url("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeW1jMjY5c2p6NWkyN2J2OXNlbHh6a2JhbXV1dG85eXYyMm94YXdwMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT9Igmu79BG4QESMwM/giphy.gif")
          `,
        }}
      />

      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-pulse">
          <p className="text-blue-400 text-5xl tracking-[0.4em]">
            CENTURY SAVED
          </p>
        </div>
      )}

      <h1 className="text-center text-6xl tracking-[0.6em] text-blue-400 mb-16">
        ELEVEN
      </h1>

      <div className="max-w-3xl mx-auto p-10 rounded-3xl border border-blue-500/40 bg-black/80 text-center">
        <p className="text-sm tracking-[0.4em] mb-4">POWER LEVEL</p>

        <h2 className="text-5xl mb-6">{LEVELS[levelIndex]}</h2>

        <div className="w-full h-3 bg-blue-900/40 rounded mb-6">
          <div
            className="h-3 bg-blue-400"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={handleInteract}
          disabled={centuryStatus !== "RUNNING"}
          className="px-10 py-3 rounded-full bg-blue-400 text-black font-semibold tracking-widest"
        >
          USE ELEVEN’S POWER
        </button>
      </div>

      {savedChildren.length > 0 && (
        <section className="mt-24">
          <h2 className="text-xl tracking-[0.4em] text-blue-300 mb-10">
            SAVED CHILDREN
          </h2>

          <div className="grid grid-cols-4 gap-4">
            {savedChildren.map(child => (
              <ChildCard
                key={child.id}
                child={child}
                status="saved"
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-32 opacity-70">
        <h2 className="tracking-[0.4em] mb-10">DEAD RECORDS</h2>

        {history
          .filter(h => h.status === "DESTROYED")
          .map(h => (
            <div key={h.century} className="mb-16">
              {/* <p className="mb-6">CENTURY {h.century}</p> */}

              <div className="grid grid-cols-5 gap-4">
                {h.dead.map(c => (
                  <ChildCard key={c.id} child={c} status="dead" />
                ))}
              </div>
            </div>
          ))}
      </section>
    </div>
  );
};

export default ElevenRoute;
