import React from "react";
import MyNavbar from "../components/NavBar";
import ExerciseTracker from "../components/ExerciseTracker";
import MyCalendar from "../components/Calender";

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
        <h2></h2>
      </div>
    </div>
  );
}