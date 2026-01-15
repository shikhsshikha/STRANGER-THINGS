import { useContext, useState, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import { Link } from "react-router-dom";
import ChildCard from "../components/ChildCard";

const TOTAL_PAGES = 3;
const CHILDREN_PER_PAGE = 35; 

const ChildrenRoute = () => {
  const { allChildren, startVecna } = useContext(GameContext);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * CHILDREN_PER_PAGE;
  const currentChildren = allChildren?.slice(
    startIndex,
    startIndex + CHILDREN_PER_PAGE
  );

  return (
    <div className="relative min-h-screen text-neutral-200 flex flex-col items-center px-6">

      <div className="stranger-bg" />

      <div className="relative z-10 flex flex-col items-center w-full">

        <h1
          style={{ fontFamily: "'Cinzel', serif" }}
          className="
            text-center
            text-5xl md:text-6xl
            tracking-[0.25em]
            text-red-600
            mt-10
            mb-8
            rotate-180
            opacity-90
            select-none
            pointer-events-none
          "
        >
          STRANGER THINGS
        </h1>

        <div className="flex gap-28 mb-14">
  <Link
    to="/eleven"
    className="
      text-4xl md:text-4xl
      tracking-[0.5em]
      text-blue-400
      hover:text-blue-300
      transition
      animate-pulse
      drop-shadow-[0_0_25px_rgba(0,120,255,0.6)]
    "
    style={{ fontFamily: "'Cinzel', serif" }}
  >
    ELEVEN
  </Link>

  <Link
    to="/vecna"
    className="
      text-4xl md:text-4xl
      tracking-[0.5em]
      text-red-600
      hover:text-red-500
      transition
      animate-[pulse_3s_ease-in-out_infinite]
      drop-shadow-[0_0_30px_rgba(150,0,0,0.8)]
    "
    style={{ fontFamily: "'Cinzel', serif" }}
  >
    VECNA
  </Link>
</div>


        <div className="w-24 h-px bg-red-700 mb-8"></div>

        <h2
  className="
    text-2xl md:text-3xl
    tracking-[0.6em]
    text-neutral-200
    mb-10
    animate-[fadeIn_2s_ease-out]
    drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]
  "
  style={{ fontFamily: "'Cinzel', serif" }}
>
  ALL CHILDREN
</h2>


        <div className="grid grid-cols-7 gap-4 max-w-7xl">
          {currentChildren?.map((child) => (
            <ChildCard key={child.id} child={child} glossy />
          ))}
        </div>

        <div
          className="
            flex items-center gap-6 mt-12 mb-10
            px-8 py-4
            bg-black/85
            border border-red-900
            rounded-xl
            backdrop-blur-md
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
