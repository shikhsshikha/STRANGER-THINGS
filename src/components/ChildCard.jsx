import { Link } from "react-router-dom";

const statusStyles = {
  normal: "border-neutral-800",
  cursed:
    "border-red-900 bg-red-950/30 shadow-[0_0_20px_rgba(120,0,0,0.35)]",
  saved:
    "border-blue-900 bg-blue-950/30 shadow-[0_0_20px_rgba(0,80,160,0.3)]",
  dead:
    "border-neutral-700 bg-neutral-900/70 opacity-60",
};

const ChildCard = ({ child, status = "normal" }) => {
  const isCursed = status === "cursed";

  return (
    <Link
      to={`/child/${child.id}`}
      className="block relative z-20"
      onClick={(e) => e.stopPropagation()}   
    >
      <div
        className={`
          group relative
          rounded-md border
          px-3 py-2
          bg-black/80
          transition-all duration-300
          ${statusStyles[status]}
          h-21
          flex flex-col justify-center
          overflow-hidden
          cursor-pointer
        `}
      >
        {isCursed && (
          <div className="absolute inset-0 cursed-veins rounded-md pointer-events-none" />
        )}

        <div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <h3 className="text-[13px] font-semibold tracking-[0.16em] uppercase text-neutral-100 leading-tight">
            {child.fullName}
          </h3>

          <p className="mt-0.5 text-[10px] tracking-wider text-neutral-400">
            {child.city}
          </p>

          {status !== "normal" && (
            <p
              className={`mt-1 text-[9px] uppercase tracking-[0.3em]
                ${
                  status === "cursed"
                    ? "text-red-400"
                    : status === "saved"
                    ? "text-blue-400"
                    : "text-neutral-400"
                }
              `}
            >
              {status === "cursed" && "UNDER INFLUENCE"}
              {status === "saved" && "RECOVERED"}
              {status === "dead" && "LOST"}
            </p>
          )}
        </div>
      </div>

      {isCursed && (
        <div className="mt-1 h-0.75 w-full rounded-full bg-linear-to-r from-red-900 via-red-600 to-red-900 pointer-events-none" />
      )}
    </Link>
  );
};

export default ChildCard;
