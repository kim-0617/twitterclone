import React, { useContext } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "../routes/Home";
import Auth from "../routes/Auth";
import Navigation from "./Navigation";
import Profile from "../routes/Profile";
import { UserContext } from "../context/UserContext";

export default function AppRouter() {
  const { isLoggedIn }: any = useContext(UserContext);

  return (
    <Router>
      {isLoggedIn && <Navigation />}
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Auth />}
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
