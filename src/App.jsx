import "./app.css";
import Home from "./pages/Home";
import DropBlockPage from "./pages/DropBlockPage";
import MineSweeperPage from "./pages/MineSweeperPage";
import BlockBreakerPage from "./pages/BlockBreakerPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/dropblock" element={<DropBlockPage />} />
        <Route path="/game/minesweeper" element={<MineSweeperPage />} />
        <Route path="/game/blockbreaker" element={<BlockBreakerPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
