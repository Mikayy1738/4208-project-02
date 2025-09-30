import React, { useState } from "react";
import WeightChart from "../components/WeightChart";
import CaloriesChart from "../components/CaloriesChart";
import MacroSplitChart from "../components/MacroSplitChart";
import MyNavbar from "../components/NavBar";
import CurrentWeight from "../components/CurrentWeight";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("weight");

  const tabs = [
    { id: "weight", label: "Weight Progress", icon: "fas fa-weight" },
    { id: "calories", label: "Daily Calories", icon: "fas fa-fire" },
  ];

  const renderChart = () => {
    switch (activeTab) {
      case "weight":
        return <WeightChart title="Weight Progress" limit={30} height={200} />;
      case "calories":
        return <CaloriesChart title="Daily Calories" height={200} refreshEvent={'macroEntriesChanged'} />;
      default:
        return <WeightChart title="Weight Progress" limit={30} height={200} />;
    }
  };

  return (
    <div className="app-container">
      <MyNavbar />
      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-6 fw-bold text-dark mb-0">Dashboard</h1>
            <p className="text-muted">Track your fitness journey</p>
          </div>
        </div>

        <div className="row g-4 w-75">
          <div className="col-12 col-xl-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <ul className="nav nav-tabs card-header-tabs" role="tablist">
                  {tabs.map((tab) => (
                    <li className="nav-item" key={tab.id}>
                      <button
                        className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        type="button"
                      >
                        <i className={`${tab.icon} me-2`}></i>
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-body">
                {renderChart()}
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <CurrentWeight />
          </div>
        </div>
      </div>
    </div>
  );
}


