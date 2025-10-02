import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import MacroMenu from "./MacroMenu.jsx";
import WeightMenu from "./WeightMenu.jsx";
import ExerciseMenu from "./ExerciseMenu.jsx";


function Login({ onLogin }) {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim();
    const password = form.password.value;
    const validEmail = "demo@example.com";
    const validPassword = "password123";
    if (email === validEmail && password === validPassword) {
      onLogin();
      navigate("/dashboard", { replace: true });
    } else {
      setMessage("Invalid email or password.");
    }
  }

  return (
    <div className="app-container" style={{ minHeight: "100vh" }}>
      <div className="container-fluid min-vh-100">
        <div className="row min-vh-100">
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(53, 53, 53) 100%)", color: "#fff" }}>
            <div className="px-5" style={{ maxWidth: 560 }}>
              <div className="mb-4" style={{ fontSize: 48, lineHeight: 1 }}></div>
              <h1 className="display-5 fw-bold mb-3">Welcome to BodyIQ!</h1>
              <p className="fs-5 mb-0" style={{ opacity: 0.95 }}>
                Track macros, log weight, and track your exercise history all in one place.
              </p>
            </div>
          </div>
          <div className="col-lg-6 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#f8f9fa" }}>
            <div className="w-100" style={{ maxWidth: 460 }}>
              <div className="card shadow-sm border-0">
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="email">Email</label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text">@</span>
                        <input className="form-control" id="email" name="email" type="email" required />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="password">Password</label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text">🔒</span>
                        <input className="form-control" id="password" name="password" type={showPassword ? "text" : "password"} required />
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    <button className="btn btn-dark w-100 btn-lg mb-2" type="submit">Login Now</button>
                  </form>
                  <p className="text-center text-muted mt-3 mb-0">Use Email: demo@example.com, Password: password123</p>
                  {message && <p className="text-center text-danger mt-2 mb-0">{message}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const persisted = localStorage.getItem("isLoggedIn") === "true";
    if (persisted) setIsLoggedIn(true);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => { setIsLoggedIn(true); localStorage.setItem("isLoggedIn", "true"); }} />} />
        <Route path="/dashboard" element={(isLoggedIn || localStorage.getItem("isLoggedIn") === "true") ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/macro-menu" element={(isLoggedIn || localStorage.getItem("isLoggedIn") === "true") ? <MacroMenu /> : <Navigate to="/login" replace />} />
        <Route path="/weight" element={(isLoggedIn || localStorage.getItem("isLoggedIn") === "true") ? <WeightMenu /> : <Navigate to="/login" replace />} />
        <Route path="/exercise" element={(isLoggedIn || localStorage.getItem("isLoggedIn") === "true") ? <ExerciseMenu /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={(isLoggedIn || localStorage.getItem("isLoggedIn") === "true") ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}