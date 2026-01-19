import { Link } from "react-router-dom";

const statusStyles = {
  normal: "border-white/10",
  cursed: "border-red-700/40 shadow-[0_0_25px_rgba(180,0,0,0.45)]",
  saved:  "border-blue-600/40 shadow-[0_0_25px_rgba(0,120,255,0.45)]",
  dead:   "border-neutral-600/30",
};

const ChildCard = ({
  child,
  status = "normal",
  showImage = true,  
  className = "",
}) => {
  return (
    <Link to={`/child/${child.id}`} className="block">
    <div
      className={`
        rounded-2xl
        bg-black/35
        backdrop-blur-xl
        border border-white/10
        shadow-[0_15px_45px_rgba(0,0,0,0.85)]
        transition-all duration-300
        hover:scale-[1.05]
        hover:shadow-[0_25px_70px_rgba(0,0,0,0.95)]
        flex flex-col items-center
        ${showImage ? "h-45" : "py-6"}
        ${statusStyles[status]}
        ${className}
      `}
    >

        {showImage && (
          <div className="mt-4 mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-white/30">
              <img
                src={child.image}
                alt={child.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}


        <div className="px-4 text-center flex flex-col items-center">
        <h3
          className="
            text-sm
            font-semibold
            tracking-[0.18em]
            uppercase
            drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]
            text-neutral-100
            leading-snug
            line-clamp-2        
            min-h-9        
          "
        >
          {child.fullName}
        </h3>

        <p
          className="
            mt-1
            text-xs
            tracking-wider
            text-neutral-400
            truncate            
          "
        >
          {child.city}
        </p>
      </div>


        {status !== "normal" && (
          <p
            className={`
              mt-2 text-[10px] uppercase tracking-[0.35em]
              ${
                status === "cursed"
                  ? "text-red-400"
                  : status === "saved"
                  ? "text-blue-400"
                  : "text-neutral-400"
              }
            `}
          >
            {status === "cursed" && "CURSED"}
            {status === "saved" && "SAVED"}
            {status === "dead" && "DEAD"}
          </p>
        )}

      </div>
    </Link>
  );
};

export default ChildCard;
