import DropBlockPage from "./pages/DropBlockPage";
import "./app.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MineSweeper from "./components/MineSweeper/MineSweeper";
import BlockBreaker from "./components/BlockBreaker/BlockBreaker";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/dropblock" element={<DropBlockPage />} />
        <Route path="/game/minesweeper" element={<MineSweeper />} />
        <Route path="/game/blockbreaker" element={<BlockBreaker />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
