import DropBrock from "./components/DropBlock";
import DropBrockPage from "./pages/DropBrockPage";
import "./app.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/dropbrock" element={<DropBrockPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
