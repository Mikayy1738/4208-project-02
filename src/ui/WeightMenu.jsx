import React from "react";
import MyNavbar from "../components/NavBar";
import CsvImport from "../components/DataImport";
import WeightTracker from "../components/WeightTracker";
import WeightChart from "../components/WeightChart";
import CurrentWeight from "../components/CurrentWeight";

export default function WeightMenu() {

  return (
    <div className="app-container">
        <MyNavbar />
      <div className={`main-content`}>
        <div className="d-flex align-items-center mb-2 px-3 pt-3">
          <h1 className="mb-0">Weight Tracker</h1>
        </div>
        <div className="container">
          <p className="text-muted mb-4 fs-5">Track your weight and achieve your fitness goals</p>
        </div>
        
        <div className="container">
          <main>
            <WeightChart title="Weight" limit={30} height={110} />
            <CurrentWeight />
            <WeightTracker />
            <CsvImport mode="weight" />
          </main>
        </div>
      </div>
    </div>
  );
}
