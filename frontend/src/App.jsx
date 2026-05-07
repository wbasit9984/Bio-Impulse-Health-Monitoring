import { useState } from "react";
import { useSelector } from 'react-redux'
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Login from "../scenes/Login";
import Dashboard from "../scenes/Dashboard";

function App() {
  const isAuth = Boolean(useSelector(state => state.user))
  console.log("User is authenticated: ", useSelector(state => state.user));

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuth === true ? <Dashboard /> : <Navigate to={"/login"} />
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
