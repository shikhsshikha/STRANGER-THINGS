import { useParams } from "react-router-dom";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";

const ChildDetail = () => {
  const { id } = useParams();
  const {
  allChildren,
  cursedChildren,
  history,
} = useContext(GameContext);


  const child = allChildren.find((c) => c.id === Number(id));

  if (!child) {
    return (
      <div className="min-h-screen bg-black text-neutral-300 flex items-center justify-center">
        Child not found
      </div>
    );
  }

  const isSaved = history.some(
  (h) =>
    h.status === "SAVED" &&
    h.saved?.some((c) => c.id === child.id)
);

const isDead = history.some(
  (h) =>
    h.status === "DESTROYED" &&
    h.dead?.some((c) => c.id === child.id)
);

const isCursed = cursedChildren.some(
  (c) => c.id === child.id
);

const status = isSaved
  ? "Saved"
  : isDead
  ? "Dead"
  : isCursed
  ? "Cursed"
  : "Normal";


  const statusColor =
    status === "Saved"
      ? "text-blue-400"
      : status === "Dead"
      ? "text-red-600"
      : status === "Cursed"
      ? "text-red-400 animate-pulse"
      : "text-neutral-300";

  return (
    <div className="relative isolate min-h-screen flex items-center justify-center px-6 text-neutral-200">
      {/* Background */}
      <div className="child-detail-bg" />

      {/* Card */}
      <div
        className={`
          relative z-10
          max-w-xl w-full
          bg-linear-to-b from-black/95 to-black/70
          border border-red-900/40
          rounded-2xl
          px-10 py-12
          backdrop-blur-md
          shadow-[0_0_60px_rgba(120,0,0,0.55)]
          text-center
          film-grain
          ${isCursed ? "heartbeat" : ""}
        `}
      >
        {isCursed && <div className="cursed-veins rounded-2xl" />}

        <p
          className="text-[11px] tracking-[0.4em] text-red-500 mb-6 uppercase"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Hawkins National Laboratory
        </p>

        <div className="flex justify-center mb-8 relative z-10">
          <img
            src={child.image}
            alt={child.fullName}
            className="w-40 h-40 rounded-xl bg-white shadow-lg"
          />
        </div>

        <h1
          className="text-4xl font-bold tracking-widest mb-4"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {child.fullName}
        </h1>

        <p className={`text-lg tracking-wider mb-8 ${statusColor}`}>
          STATUS: {status.toUpperCase()}
        </p>

        <div className="space-y-3 text-lg relative z-10">
          <p>Age: {child.age}</p>
          <p>Height: {child.height} cm</p>
          <p>City: {child.city}</p>
        </div>

        <div className="w-24 h-px bg-red-700/60 mx-auto my-8" />

        <p className="italic typewriter relative z-10">
          “{child.bioData}”
        </p>
      </div>
    </div>
  );
};

export default ChildDetail;
