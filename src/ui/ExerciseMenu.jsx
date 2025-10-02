import React from "react";
import MyNavbar from "../components/NavBar.jsx";
import ExerciseTracker from "../components/ExerciseTracker.jsx";
import MyCalendar from "../components/Calender.jsx";

export default function ExerciseMenu() {
  return (
    <div className="app-container">
        <MyNavbar />

        <div className="container">
          <MyCalendar />
        </div>
      <div className="container">
        <div className="row">
          <h1>Exercise Menu</h1>
        </div>
      </div>
      <div className="container">
        <ExerciseTracker />
      </div>
    </div>
  );
}