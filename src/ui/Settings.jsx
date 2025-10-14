import React, { useEffect, useState } from "react";
import MyNavbar from "../components/NavBar.jsx";

const STORAGE_KEY = "userProfile";

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    heightFeet: "",
    heightInches: "",
    weightLb: "",
    goal: "maintain"
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && typeof saved === "object") {
        let heightFeet = saved.heightFeet || "";
        let heightInches = saved.heightInches || "";
        if (!heightFeet && !heightInches && saved.heightIn) {
          const total = parseInt(saved.heightIn, 10);
          if (!isNaN(total)) {
            heightFeet = Math.floor(total / 12).toString();
            heightInches = (total % 12).toString();
          }
        }
        setProfile({
          name: saved.name || "",
          email: saved.email || "",
          heightFeet,
          heightInches,
          weightLb: saved.weightLb || "",
          goal: saved.goal || "maintain"
        });
      }
    } catch (_) {}
  }, []);

  function saveProfile(e) {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setMessage("Saved");
    setTimeout(() => setMessage(""), 1500);
  }

  return (
    <div className="app-container">
      <MyNavbar />
      <div className="container py-4">
        <h1 className="mb-4">Settings</h1>
        <div className="row">
          <div className="col-12 col-lg-8">
            <div className="card">
              <div className="card-body">
                <form onSubmit={saveProfile}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Height (ft)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={profile.heightFeet}
                          onChange={(e) => setProfile({ ...profile, heightFeet: e.target.value })}
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Height (in)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={profile.heightInches}
                          onChange={(e) => setProfile({ ...profile, heightInches: e.target.value })}
                          min="0"
                          max="11"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Weight (lb)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={profile.weightLb}
                          onChange={(e) => setProfile({ ...profile, weightLb: e.target.value })}
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Goal</label>
                        <select
                          className="form-select"
                          value={profile.goal}
                          onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                        >
                          <option value="lose">Lose</option>
                          <option value="maintain">Maintain</option>
                          <option value="gain">Gain</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">Save</button>
                    {message && <span className="text-success align-self-center">{message}</span>}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
