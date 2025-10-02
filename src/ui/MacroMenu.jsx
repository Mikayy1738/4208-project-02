import React from "react";
import MacroTracker from "../components/MacroTracker.jsx";
import MyNavbar from "../components/NavBar.jsx";
import CsvImport from "../components/DataImport.jsx";
import CaloriesChart from "../components/CaloriesChart.jsx";

export default function MacroMenu() {

  return (
    <div className="app-container">
        <MyNavbar />
      
      <div className={`main-content`}>
        <div className="d-flex align-items-center mb-2 px-3 pt-3">
          <h1 className="mb-0">Macro Tracker</h1>
        </div>
        <div className="container">
          <p className="text-muted mb-4 fs-5">Track your daily macronutrients and achieve your fitness goals</p>
        </div>
        <div className="container w-50">
            <CaloriesChart title="Calories" height={140} refreshEvent={'weightEntriesChanged'} />
        </div>
        <div className="container w-75">
          <main>
            <MacroTracker />
            <CsvImport mode="macro" />
          </main>
        </div>
      </div>
    </div>
  );
}
