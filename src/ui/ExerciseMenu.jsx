import React, { useState } from "react";
import MyNavbar from "../components/NavBar.jsx";
import ExercisePicker from "../components/ExercisePicker.jsx";
import MyCalendar from "../components/Calender.jsx";
import ExerciseOverview from "../components/ExerciseOverview.jsx";

export default function ExerciseMenu() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [range, setRange] = useState("day");
  return (
    <div className="app-container">
        <MyNavbar />

        <div className="container">
          <MyCalendar value={selectedDate} onChange={setSelectedDate} />
        </div>
      <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="mb-0">Exercise History</h1>
            <div className="btn-group" role="group" aria-label="Range">
              <button
                type="button"
                className={`btn btn-sm ${range === "day" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setRange("day")}
              >
                Today
              </button>
              <button
                type="button"
                className={`btn btn-sm ${range === "7" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setRange("7")}
              >
                7 Days
              </button>
              <button
                type="button"
                className={`btn btn-sm ${range === "30" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setRange("30")}
              >
                30 Days
              </button>
              <button
                type="button"
                className={`btn btn-sm ${range === "all" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setRange("all")}
              >
                All
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <ExerciseOverview selectedDate={selectedDate} range={range} />
      </div>
    </div>
  );
}