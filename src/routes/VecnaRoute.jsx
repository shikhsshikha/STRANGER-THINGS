import { useContext, useEffect, useState } from "react";
import { GameContext } from "../context/GameContext";
import ChildCard from "../components/ChildCard";

const CONNECTION_TIME = 7;

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

  return (
    <div className="relative min-h-screen px-10 py-16 text-neutral-200">

      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.1)),
            url("https://media.giphy.com/media/axdUGyhEPyZ2hwMtaa/giphy.gif")
          `,
        }}
      />

      {showDestroyed && (
  <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-pulse pointer-events-auto">
    <p className="text-red-700 text-5xl tracking-[0.4em]">
      CENTURY DESTROYED
    </p>
  </div>
)}


      {!showDestroyed && (
        <>
          <h1 className="text-center text-6xl tracking-[0.6em] text-red-700 mb-4">
            VECNA
          </h1>

          <p className="text-center text-2xl tracking-widest text-red-500 mb-16">
  CENTURY {Math.max(vecnaCentury, 1)}
</p>


          {activeChild && (
            <div className="max-w-3xl mx-auto mb-24 p-10 rounded-3xl bg-black/85 border border-red-900 text-center">
              <p className="text-sm tracking-[0.5em] text-red-600 mb-6">
                MENTAL CONNECTION
              </p>

              <ChildCard child={activeChild} status="cursed" />

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
                />
              ))}
            </div>
          </section>

          <section className="mt-32 opacity-70">
  <h2 className="text-xl tracking-[0.4em] text-neutral-400 mb-10">
    MEMORIAL OF LOST CHILDREN
  </h2>

  {history
    .filter(h => h.status === "DESTROYED")
    .map(h => (
      <div key={h.century} className="mb-16">

        <div className="grid grid-cols-5 gap-4">
          {h.dead.map(child => (
            <ChildCard
              key={child.id}
              child={child}
              status="dead"
            />
          ))}
        </div>
      </div>
    ))}
</section>

        </>
      )}
    </div>
  );
};

export default VecnaRoute;
