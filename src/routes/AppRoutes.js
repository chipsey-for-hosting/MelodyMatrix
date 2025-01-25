import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../models/HomePage/HomePage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
