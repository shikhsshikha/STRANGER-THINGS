import { useContext, useState, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import { Link } from "react-router-dom";
import ChildCard from "../components/ChildCard";
import GameIntroModal from "../components/GameIntroModal";

const TOTAL_PAGES = 3;
const CHILDREN_PER_PAGE = 35; 

const ChildrenRoute = () => {
  const { allChildren } = useContext(GameContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [accepted, setAccepted] = useState(
    sessionStorage.getItem("gameAccepted") === "true"
  );


  const startIndex = (currentPage - 1) * CHILDREN_PER_PAGE;
  const currentChildren = allChildren?.slice(
    startIndex,
    startIndex + CHILDREN_PER_PAGE
  );

  

  return (
    
    <div className="relative min-h-screen text-neutral-200 flex flex-col items-center px-6">

      {!accepted && (
        <GameIntroModal
          onConfirm={() => {
            sessionStorage.setItem("gameAccepted", "true");
            setAccepted(true);
          }}
        />
      )}

      <div className="stranger-bg" />

      <div className="relative z-10 flex flex-col items-center w-full">

        <h1
          className="
            mt-10
            mb-10
            text-center
            text-6xl md:text-7xl
            tracking-[0.4em]
            rotate-180
            stranger-title
            select-none
            pointer-events-none
          "
        >
          STRANGER THINGS
        </h1>

        <div className="flex gap-28 mb-14">
  <Link
    to="/eleven"
    className="text-4xl font-bold md:text-5xl tracking-[0.45em] eleven-title"
  >
    ELEVEN
  </Link>



  <Link
    to="/vecna"
    className="text-4xl md:text-5xl font-bold tracking-[0.45em] vecna-title"
  >
    VECNA
  </Link>


</div>


  <div className="w-40 h-px bg-red-700 mb-8"></div>

        <div className="grid grid-cols-7 gap-6 max-w-7xl children-glass-grid">
          {currentChildren?.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              className="children-glass-card"
            />
          ))}
        </div>


        <div
          className="
            flex items-center gap-6 mt-12 mb-10
            px-8 py-4
            bg-black/85
            border border-red-900
            rounded-xl
            shadow-[0_0_30px_rgba(120,0,0,0.4)]
          "
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="text-neutral-300 disabled:opacity-40 hover:text-red-400 transition"
          >
            PREV
          </button>

          <span className="text-red-400 text-sm tracking-widest">
            {currentPage} / {TOTAL_PAGES}
          </span>

          <button
            disabled={currentPage === TOTAL_PAGES}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="text-neutral-300 disabled:opacity-40 hover:text-red-400 transition"
          >
            NEXT
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChildrenRoute;
