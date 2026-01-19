import { useContext, useEffect, useState } from "react";
import { GameContext } from "../context/GameContext";
import ChildCard from "../components/ChildCard";
import Pagination from "../components/Pagination";

const CONNECTION_TIME = 4;

const VecnaRoute = () => {
  const {
    startVecna,
    vecnaQueue,
    currentIndex,
    elapsed,
    cursedChildren,
    vecnaCentury,
    history,
    centuryStatus,
  } = useContext(GameContext);

  const [showDestroyed, setShowDestroyed] = useState(false);
  const ITEMS_PER_PAGE = 12;
  const [deadPage, setDeadPage] = useState(1);

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


useEffect(() => {
  startVecna();
}, []);


  if (centuryStatus === "VECNA_DEFEATED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-red-700 text-6xl tracking-[0.5em] animate-pulse">
          VECNA DEFEATED
        </p>
      </div>
    );
  }

  useEffect(() => {
  if (centuryStatus === "DESTROYED") {
    setShowDestroyed(true);
    const t = setTimeout(() => setShowDestroyed(false), 2500);
    return () => clearTimeout(t);
  }
}, [centuryStatus]);


  const activeChild =
    currentIndex < vecnaQueue.length
      ? vecnaQueue[currentIndex]
      : null;

  const progress = Math.min(
    100,
    (elapsed / CONNECTION_TIME) * 100
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
    <div className="relative min-h-screen px-10 py-16 text-neutral-200 ">
      <div className="vecna-bg" />
      
      {showDestroyed && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-pulse pointer-events-auto">
          <p className="text-red-700 text-5xl tracking-[0.4em]">
            CENTURY DESTROYED
          </p>
        </div>
      )}


      {!showDestroyed && (
        <>
          <h1 className="vecna-title-glow">
            VECNA
          </h1>

          <p className="vecna-century-glow">
            {formatOrdinalCentury(vecnaCentury)}
          </p>

          {activeChild && (
            <div className="max-w-3xl mx-auto mb-24 p-10 rounded-3xl bg-black/85 border border-red-900 text-center">
              <p className="text-sm tracking-[0.5em] text-red-600 mb-6">
                MENTAL CONNECTION
              </p>

              <ChildCard
                child={activeChild}
                status="cursed"
                showImage={false}
                className="vecna-card vecna-cursed"
              />

              <div className="relative mt-8 flex justify-center items-center">
                <svg width="160" height="160" className="-rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="rgba(120,0,0,0.25)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#b91c1c"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 70}
                    strokeDashoffset={
                      (1 - progress / 100) * 2 * Math.PI * 70
                    }
                  />
                </svg>

                <div className="absolute text-4xl font-bold text-red-500">
                  {CONNECTION_TIME - elapsed}
                </div>
              </div>
            </div>
          )}

          <section className="mb-32">
            <h2 className="text-xl tracking-[0.5em] text-red-600 mb-10">
              CURSED CHILDREN
            </h2>

            <div className="grid grid-cols-4 gap-4">
              {cursedChildren.map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  status="cursed"
                  showImage={false}
                  className="vecna-card vecna-cursed"
                />
              ))}
            </div>
          </section>

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
                    className="vecna-card"
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
        </>
      )}
    </div>
  );
};

export default VecnaRoute;
