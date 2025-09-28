import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Home";
import MemoryGame from "./components/GameBoard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="game" element={<MemoryGame />} />
      </Routes>
    </Router>
  );
}
