import { useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import ChildCard from "../components/ChildCard";
import Pagination from "../components/Pagination";

const LEVELS = ["BAD", "GOOD", "GREAT", "EXCELLENT"];
const CLICKS_PER_LEVEL = 20;
const MAX_CLICKS = 80;

const LEVEL_COLORS = {
BAD: "bg-blue-500",
GOOD: "bg-green-500",
GREAT: "bg-purple-500",
EXCELLENT: "bg-yellow-400",
};

const ElevenRoute = () => {
  const { 
    history, 
    centuryStatus, 
    saveCentury,
    elevenCentury,
    vecnaCentury
  } = useContext(GameContext);

  const [totalClicks, setTotalClicks] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const decayRef = useRef(null);
  const navigate = useNavigate();
  const [glow, setGlow] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [timeScale, setTimeScale] = useState(1);


  const ITEMS_PER_PAGE = 12;
  const [savedPage, setSavedPage] = useState(1);
  const [deadPage, setDeadPage] = useState(1);

  const prevCenturyRef = useRef(null);
  const [showEraShift, setShowEraShift] = useState(false);


  const levelIndex = Math.min(
  Math.floor(totalClicks / CLICKS_PER_LEVEL),
  LEVELS.length - 1
  );

  const currentLevel = LEVELS[levelIndex];
  const progressColor = LEVEL_COLORS[currentLevel];

  const isGood = currentLevel === "GOOD";
  const isGreat = currentLevel === "GREAT";
  const isExcellent = currentLevel === "EXCELLENT";

 
  const progressPercent = Math.min(
    (totalClicks / MAX_CLICKS) * 100,
    100
    );

  const getOrdinal = (n) => {
    if (n % 10 === 1 && n % 100 !== 11) return "st";
    if (n % 10 === 2 && n % 100 !== 12) return "nd";
    if (n % 10 === 3 && n % 100 !== 13) return "rd";
    return "th";
  };

  const formatOrdinalCentury = (c) => {
    if (c > 0) {
      return `${c}${getOrdinal(c)} Century`;
    }

    if (c === 0) {
      return `1st Century BC`;
    }

    const abs = Math.abs(c) + 1;
    return `${abs}${getOrdinal(abs)} Century BC`;
  };

  const formatCenturyLabel = (c) => {
    if (c > 0) return `Century ${c}`;
    if (c === 0) return `Century 0`;
    const abs = Math.abs(c);
    return `${abs}${getOrdinal(abs)} Century BC`;
  };

  const formatElevenCentury = (c) => {
    if (c > 0) {
      return `${c}${getOrdinal(c)} Century`;
    }

    if (c === 0) {
      return `1st Century BC`;
    }

    const bcNumber = Math.abs(c) + 1;
    return `${bcNumber}${getOrdinal(bcNumber)} Century BC`;
  };

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
  setGlow(true);
  const t = setTimeout(() => setGlow(false), 300);
  return () => clearTimeout(t);
  }, [levelIndex]);


  useEffect(() => {
    clearInterval(decayRef.current);

    decayRef.current = setInterval(() => {
      setTotalClicks((c) => (c > 0 ? c - 1 : 0));
    }, 1200 / timeScale);

    return () => clearInterval(decayRef.current);
  }, [timeScale]);


  useEffect(() => {
    const prev = prevCenturyRef.current;
    const curr = elevenCentury;

    if (prev === 0 && curr === 1) {
      setShowEraShift("BC_TO_AD");
      setTimeout(() => setShowEraShift(false), 3000);
    }

    if (prev === 1 && curr === 0) {
      setShowEraShift("AD_TO_BC");
      setTimeout(() => setShowEraShift(false), 3000);
    }

    prevCenturyRef.current = curr;
  }, [elevenCentury]);


  useEffect(() => {
    if (isExcellent) setTimeScale(0.35);
    else if (isGreat) setTimeScale(0.6);
    else setTimeScale(1);
  }, [currentLevel]);

  useEffect(() => {
    if (centuryStatus !== "RUNNING") setTotalClicks(0);
  }, [centuryStatus]);

  useEffect(() => {
  if (centuryStatus === "VECNA_DEFEATED") {
    navigate("/vecna-defeated");
  }
}, [centuryStatus, navigate]);

  useEffect(() => {
    if (centuryStatus === "DESTROYED") {
      setShowDefeat(true);
    } else {
      setShowDefeat(false);
    }
  }, [centuryStatus]);


  const savedMap = new Map();
  [...history]
    .filter(h => h.status === "SAVED")
    .reverse()                 
    .forEach(h => {
      h.saved.forEach(child => {
        savedMap.set(child.id, child);
      });
    });
  const savedChildren = Array.from(savedMap.values());


  const totalSavedPages = Math.ceil(savedChildren.length / ITEMS_PER_PAGE);

  const paginatedSaved = savedChildren.slice(
    (savedPage - 1) * ITEMS_PER_PAGE,
    savedPage * ITEMS_PER_PAGE
  );

  const deadChildren = [...history]
  .filter(h => h.status === "DESTROYED")
  .reverse()
  .flatMap(h =>
    h.dead.map(child => ({
      ...child,
      timestamp: h.timestamp
    }))
  );

  const totalDeadPages = Math.ceil(deadChildren.length / ITEMS_PER_PAGE);

  const paginatedDead = deadChildren.slice(
    (deadPage - 1) * ITEMS_PER_PAGE,
    deadPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen px-10 py-16 text-blue-200 relative">

      <div
        className="fixed inset-0 -z-10 bg-contain bg-center"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.1)),
            url("https://wallpaperaccess.com/full/1504206.jpg")
          `,
        }}
      />
      {isGood && (
        <div className="fixed inset-0 z-30 pointer-events-none eleven-good" />
      )}

      {isGreat && (
        <div className="fixed inset-0 z-40 pointer-events-none eleven-great" />
      )}

      {isExcellent && (
        <div className="fixed inset-0 z-50 pointer-events-none eleven-excellent" />
      )}



      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-pulse">
          <p className="text-blue-400 text-5xl tracking-[0.4em]">
            CENTURY SAVED
          </p>
        </div>
      )}

      {showDefeat && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
          <div className="text-center animate-defeatFade">
            <p className="text-red-700 text-6xl tracking-[0.6em] mb-6">
              CENTURY DESTROYED
            </p>
            <p className="text-red-500 text-3xl tracking-[0.4em] mb-4">
              ELEVEN LOST
            </p>
            <p className="text-red-400 tracking-widest opacity-70">
              VECNA PREVAILS
            </p>
          </div>
        </div>
      )}

      {showEraShift && (
        <div className="fixed inset-0 z-100 bg-black flex items-center justify-center">
          <div className="text-center animate-eraShift">
            <p className="text-blue-400 text-6xl tracking-[0.6em] mb-6">
              ERA SHIFT
            </p>

            {showEraShift === "BC_TO_AD" && (
              <p className="text-blue-300 tracking-widest">
                ELEVEN ENTERS THE MODERN ERA
              </p>
            )}

            {showEraShift === "AD_TO_BC" && (
              <p className="text-blue-300 tracking-widest">
                ELEVEN FALLS INTO THE ANCIENT PAST
              </p>
            )}
          </div>
        </div>
      )}


      <h1 className="eleven-title-glow">
        ELEVEN
      </h1>

      <p className="eleven-century-glow">
        {formatOrdinalCentury(elevenCentury)}
      </p>


      <div className="max-w-3xl mx-auto p-10 mb-15 rounded-3xl border border-blue-500/40 bg-black/80 text-center">
        <p className="text-xl tracking-[0.4em] mb-8">POWER LEVEL</p>

        <h2 className="text-5xl mb-8">{LEVELS[levelIndex]}</h2>

        <div className="relative w-full h-4 rounded-full overflow-hidden mb-3 bg-blue-900/40">

          <div
            className={`absolute left-0 top-0 h-full transition-all duration-200 ${progressColor}`}
            style={{ width: `${progressPercent}%` }}
          />

          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute left-1/4 top-0 h-full w-0.5 bg-black/50" />
            <span className="absolute left-1/2 top-0 h-full w-0.5 bg-black/50" />
            <span className="absolute left-3/4 top-0 h-full w-0.5 bg-black/50" />
          </div>

          <div
            className="absolute -top-3 transition-all duration-200"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
          >
            <div className="w-0.5 h-10 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-white mx-auto" />
          </div>
        </div>


        <div className="relative mb-15 mt-3 text-sm tracking-widest text-blue-300">
          <span className="absolute left-[12.5%] -translate-x-1/2">BAD</span>
          <span className="absolute left-[37.5%] -translate-x-1/2">GOOD</span>
          <span className="absolute left-[62.5%] -translate-x-1/2">GREAT</span>
          <span className="absolute left-[87.5%] -translate-x-1/2">EXCELLENT</span>
        </div>


        <button
          onClick={handleInteract}
          disabled={centuryStatus !== "RUNNING"}
          className="px-10 py-3 rounded-full bg-blue-400 text-black font-semibold tracking-widest cursor-pointer hover:scale-105 transition"
        >
          USE ELEVEN’S POWER
        </button>

        </div>
        <div className="status-century-bar">
          <div className="status-eleven">
            ELEVEN&nbsp;|&nbsp;
            <span>{formatElevenCentury(elevenCentury)}</span>
          </div>

          <div className="status-vecna">
            VECNA&nbsp;|&nbsp;
            <span>{formatOrdinalCentury(vecnaCentury)}</span>
          </div>
        </div>
        

      {savedChildren.length > 0 && (
        <section className="mt-24">
          <h2 className="text-xl tracking-[0.4em] text-blue-300 mb-10">
            SAVED CHILDREN
          </h2>

          <div className="grid grid-cols-4 gap-4">
            {paginatedSaved.map(child => (
              <ChildCard
                key={child.id}
                child={child}
                status="saved"
                showImage={false}
              />
            ))}
          </div>

          {totalSavedPages > 1 && (
            <Pagination
              currentPage={savedPage}
              totalPages={totalSavedPages}
              onPageChange={setSavedPage}
            />
          )}
        </section>
      )}


{deadChildren.length > 0 && (
  <section className="mt-32 opacity-100">
    <div className="flex items-center gap-3 mb-10">
      <h2 className="tracking-[0.4em]">DEAD RECORDS</h2>

    </div>


    <div className="grid grid-cols-4 gap-4">
      {paginatedDead.map(child => {
        const isNew =
          Date.now() - (child.timestamp ?? 0) < 24 * 60 * 60 * 1000;

        return (
          <ChildCard
            key={child.id}
            child={child}
            status="dead"
            showImage={false}
            isNew={isNew}          
          />
        );
      })}

    </div>

    {totalDeadPages > 1 && (
      <Pagination
        currentPage={deadPage}
        totalPages={totalDeadPages}
        onPageChange={setDeadPage}
      />
    )}
  </section>
)}


    </div>
  );
};

export default ElevenRoute;
