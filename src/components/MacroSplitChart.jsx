import React, { useEffect, useRef } from "react";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
);

function getMacroEntries() {
  const raw = localStorage.getItem("macroEntries");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function MacroSplitChart({ title = "Macro split", height = 140, noCard = false }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const build = () => {
      const ctx = canvasRef.current.getContext("2d");
      const entries = getMacroEntries();
      
      let macroData = { protein: 0, carbs: 0, fat: 0 };
      if (entries.length > 0) {
        const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
        const latestEntry = sortedEntries[sortedEntries.length - 1];
        macroData = {
          protein: latestEntry.protein || 0,
          carbs: latestEntry.carbs || 0,
          fat: latestEntry.fat || 0
        };
      }

      const labels = ["Protein", "Carbs", "Fat"];
      const data = [macroData.protein, macroData.carbs, macroData.fat];

      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: ["#111827", "#6b7280", "#9ca3af"],
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "bottom" } }
        }
      });
    };

    build();

    const onChange = () => build();
    window.addEventListener('macroEntriesChanged', onChange);
    return () => {
      window.removeEventListener('macroEntriesChanged', onChange);
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  if (noCard) {
    return (
      <div>
        <h5 className="mb-3">{title}</h5>
        <canvas ref={canvasRef} height={String(height)} style={{ maxHeight: `${height}px` }} />
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h5 className="card-title mb-3">{title}</h5>
        <canvas ref={canvasRef} height={String(height)} />
      </div>
    </div>
  );
}


