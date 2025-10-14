import React from "react";
import MyNavbar from "./NavBar.jsx";
import ExerciseSection from "./ExerciseSection.jsx";

export default function Workout() {
  return (
    <div className="app-container">
        <MyNavbar />

    <div className="container">
      <h1>Workout</h1>
      <ExerciseSection />
    </div>
    </div>
  );
}
