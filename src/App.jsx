import { Routes, Route } from "react-router-dom";
import VecnaRoute from "./routes/VecnaRoute";
import ElevenRoute from "./routes/ElevenRoute";
import ChildDetail from "./routes/ChildDetail";
import ChildrenRoute from "./routes/ChildrenRoute";
import VecnaDefeatedRoute from "./routes/VecnaDefeatedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChildrenRoute />} />
      <Route path="/vecna" element={<VecnaRoute />} />
      <Route path="/eleven" element={<ElevenRoute />} />
      <Route path="/child/:id" element={<ChildDetail />} />
      <Route path="/vecna-defeated" element={<VecnaDefeatedRoute />} />
    </Routes>
  );
}

export default App;
