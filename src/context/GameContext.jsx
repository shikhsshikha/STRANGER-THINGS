import { createContext, useEffect, useReducer, useRef } from "react";
import { childrenData } from "../data/childrenData";

export const GameContext = createContext();

const CONNECTION_TIME = 7;
const TOTAL = 12;

const initialState = {
  allChildren: childrenData,
  vecnaCentury: 1,
  centuryStatus: "IDLE", 
  vecnaQueue: [],
  currentIndex: 0,
  elapsed: 0,
  cursedChildren: [],
  history: [],
};

const resetGame = () => {
  dispatch({ type: "RESET_GAME" });
};


function gameReducer(state, action) {
  switch (action.type) {
    case "START_CENTURY":
      return {
        ...state,
        vecnaQueue: action.payload,
        currentIndex: 0,
        elapsed: 0,
        cursedChildren: [],
        centuryStatus: "RUNNING",
      };

    case "TICK":
      return {
        ...state,
        elapsed: state.elapsed + 1,
      };

    case "CURSE_CHILD":
      return {
        ...state,
        cursedChildren: [...state.cursedChildren, state.vecnaQueue[state.currentIndex]],
        currentIndex: state.currentIndex + 1,
        elapsed: 0,
      };

      

    case "VECNA_WINS":
      return {
        ...state,
        centuryStatus: "DESTROYED",
        vecnaCentury: state.vecnaCentury + 1,
        history: [
          ...state.history,
          {
            century: state.vecnaCentury,
            status: "DESTROYED",
            dead: state.vecnaQueue,
          },
        ],
      };

    case "ELEVEN_WINS": {
  if (state.centuryStatus !== "RUNNING") {
    return state;
  }

  const next = state.vecnaCentury - 1;

  if (next <= 0) {
    return {
      ...state,
      vecnaCentury: 0,
      centuryStatus: "VECNA_DEFEATED",
      history: [
        ...state.history,
        {
          century: state.vecnaCentury,
          status: "SAVED",
          saved: state.cursedChildren,
        },
      ],
    };
  }

  return {
    ...state,
    vecnaCentury: next,          
    centuryStatus: "SAVED",      
    history: [
      ...state.history,
      {
        century: state.vecnaCentury,
        status: "SAVED",
        saved: state.cursedChildren,
      },
    ],
  };
}
case "RESET_GAME":
  return {
    ...initialState,
    allChildren: state.allChildren, 
  };
    default:
      return state;
  }
}

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerRef = useRef(null);

  const resetGame = () => {
  clearInterval(timerRef.current);
  dispatch({ type: "RESET_GAME" });
  };


  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (state.centuryStatus !== "RUNNING") return;

    timerRef.current = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [state.centuryStatus]);

  /* ---------------- CURSING LOOP ---------------- */
  useEffect(() => {
    if (state.centuryStatus !== "RUNNING") return;
    if (state.elapsed < CONNECTION_TIME) return;
    if (state.currentIndex >= TOTAL) return;

    dispatch({ type: "CURSE_CHILD" });
  }, [state.elapsed, state.centuryStatus, state.currentIndex]);

  /* ---------------- VECNA COMPLETES ---------------- */
  useEffect(() => {
    if (state.currentIndex !== TOTAL) return;
    if (state.centuryStatus !== "RUNNING") return;

    clearInterval(timerRef.current);
    dispatch({ type: "VECNA_WINS" });
  }, [state.currentIndex, state.centuryStatus]);

  /* ---------------- AUTO RESTART ---------------- */
  useEffect(() => {
    if (
      state.centuryStatus !== "SAVED" &&
      state.centuryStatus !== "DESTROYED"
    )
      return;

    if (state.centuryStatus === "VECNA_DEFEATED") return;

    const t = setTimeout(() => {
      const selected = [...childrenData]
        .sort(() => 0.5 - Math.random())
        .slice(0, TOTAL);

      dispatch({ type: "START_CENTURY", payload: selected });
    }, 3000);

    return () => clearTimeout(t);
  }, [state.centuryStatus]);

  /* ---------------- START GAME ---------------- */
  const startVecna = () => {
  if (state.centuryStatus !== "IDLE") return;

  const selected = [...childrenData]
    .sort(() => 0.5 - Math.random())
    .slice(0, TOTAL);

  dispatch({ type: "START_CENTURY", payload: selected });
};


  const saveCentury = () => {
    if (state.centuryStatus !== "RUNNING") return;
    clearInterval(timerRef.current);
    dispatch({ type: "ELEVEN_WINS" });
  };

  return (
    <GameContext.Provider
      value={{
        ...state,
        startVecna,
        saveCentury,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
