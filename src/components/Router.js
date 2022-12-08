import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

const Router = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login />}
        />
      </Routes>
    </Router>
  );
};
