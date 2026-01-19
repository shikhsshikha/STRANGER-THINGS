import { createContext, useEffect, useReducer, useRef } from "react";
import { childrenData } from "../data/childrenData";

export const GameContext = createContext();

const CONNECTION_TIME = 4;
const TOTAL = 12;

const initialState = {
  allChildren: childrenData,
  vecnaCentury: 1,      
  elevenCentury: 1,     
  centuryStatus: "IDLE",
  vecnaQueue: [],
  currentIndex: 0,
  elapsed: 0,
  cursedChildren: [],
  history: [],
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
        elevenCentury: state.elevenCentury - 1, 
        history: [
          ...state.history,
          {
            century: state.vecnaCentury,
            status: "DESTROYED",
            dead: state.vecnaQueue,
            timestamp: Date.now(),   
          },
        ],

      };

    case "ELEVEN_WINS": {
      if (state.centuryStatus !== "RUNNING") return state;

      const nextVecna = state.vecnaCentury - 1;
      const nextEleven = state.elevenCentury + 1;

      if (nextVecna <= 0) {
        return {
          ...state,
          vecnaCentury: 0,
          elevenCentury: nextEleven,
          centuryStatus: "VECNA_DEFEATED",
          history: [
            ...state.history,
            {
              century: state.vecnaCentury,
              status: "SAVED",
              saved: state.cursedChildren,
              timestamp: Date.now(),   
            }
          ],
        };
      }

      return {
        ...state,
        vecnaCentury: nextVecna,
        elevenCentury: nextEleven,
        centuryStatus: "SAVED",
        history: [
          ...state.history,
          {
            century: state.vecnaCentury,
            status: "SAVED",
            saved: state.cursedChildren,
            timestamp: Date.now(),   
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


  useEffect(() => {
    if (state.centuryStatus !== "RUNNING") return;

    timerRef.current = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [state.centuryStatus]);


  useEffect(() => {
    if (state.centuryStatus !== "RUNNING") return;
    if (state.elapsed < CONNECTION_TIME) return;
    if (state.currentIndex >= TOTAL) return;

    dispatch({ type: "CURSE_CHILD" });
  }, [state.elapsed, state.centuryStatus, state.currentIndex]);


  useEffect(() => {
    if (state.currentIndex !== TOTAL) return;
    if (state.centuryStatus !== "RUNNING") return;

    clearInterval(timerRef.current);
    dispatch({ type: "VECNA_WINS" });
  }, [state.currentIndex, state.centuryStatus]);


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
