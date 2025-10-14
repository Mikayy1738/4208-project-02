import React, { useEffect, useState } from "react";
import MyNavbar from "../components/NavBar.jsx";

const STORAGE_KEY = "userProfile";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    heightFeet: "",
    heightInches: "",
    weightLb: "",
    goal: "maintain"
  });

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

  return (
    <div className="app-container">
      <MyNavbar />
      <div className="container py-4">
        <h1 className="mb-4">Profile</h1>
        <div className="row">
          <div className="col-12 col-lg-8">
            <div className="card">
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-sm-3">
                    <strong>Name:</strong>
                  </div>
                  <div className="col-sm-9">
                    {profile.name || "Not set"}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-3">
                    <strong>Height:</strong>
                  </div>
                  <div className="col-sm-9">
                    {profile.heightFeet && profile.heightInches 
                      ? `${profile.heightFeet}'${profile.heightInches}"`
                      : "Not set"
                    }
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-3">
                    <strong>Weight:</strong>
                  </div>
                  <div className="col-sm-9">
                    {profile.weightLb ? `${profile.weightLb} lbs` : "Not set"}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-3">
                    <strong>Goal:</strong>
                  </div>
                  <div className="col-sm-9">
                    {profile.goal === "lose" ? "Lose Weight" : 
                     profile.goal === "maintain" ? "Maintain Weight" : 
                     profile.goal === "gain" ? "Gain Weight" : "Not set"}
                  </div>
                </div>
                <div className="mt-4">
                  <a href="/settings" className="btn btn-primary">Edit Profile</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}