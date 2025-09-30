import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { getEntries } from "../services/weightService";

Chart.register(
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function WeightChart({ title = "Weight", limit = 30, height = 110, enableRange = true }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [range, setRange] = useState(limit);

  useEffect(() => {
    const build = () => {
      const ctx = canvasRef.current.getContext("2d");
      const entries = getEntries();
      const activeLimit = typeof range === "number" ? range : limit;
      
      let dataSource = entries;
      let labels = [];
      let data = [];
      
      if (typeof activeLimit === "number" && activeLimit > 0) {
        const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
        const lastDate = new Date(sortedEntries[sortedEntries.length - 1]?.date);
        if (!isNaN(lastDate.getTime())) {
          const cutoffDate = new Date(lastDate);
          cutoffDate.setDate(cutoffDate.getDate() - activeLimit + 1);
          dataSource = sortedEntries.filter(entry => new Date(entry.date) >= cutoffDate);
          
          const dataMap = new Map(dataSource.map(entry => [entry.date, entry.weight]));
          
          for (let i = 0; i < activeLimit; i++) {
            const currentDate = new Date(cutoffDate);
            currentDate.setDate(cutoffDate.getDate() + i);
            const dateStr = currentDate.toISOString().slice(0, 10);
            labels.push(dateStr);
            data.push(dataMap.get(dateStr) || null);
          }
        } else {
          labels = dataSource.map(e => e.date);
          data = dataSource.map(e => e.weight);
        }
      } else {
        labels = dataSource.map(e => e.date);
        data = dataSource.map(e => e.weight);
      }

      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Weight (lb)",
              data,
              borderColor: "#111827",
              backgroundColor: "rgba(17,24,39,0.1)",
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: false,
              tension: 0.35,
              spanGaps: true
            }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "#e5e7eb" } }
          }
        }
      });
    };

    build();

    const onChange = () => build();
    window.addEventListener('weightEntriesChanged', onChange);
    return () => {
      window.removeEventListener('weightEntriesChanged', onChange);
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [range, limit]);

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">{title}</h5>
          {enableRange && (
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={String(range)}
              onChange={(e) => {
                const newRange = parseInt(e.target.value, 10);
                setRange(newRange);
                // Emit range change event for other components
                try {
                  const event = new CustomEvent('weightChartRangeChanged', { 
                    detail: { range: newRange } 
                  });
                  window.dispatchEvent(event);
                } catch {}
              }}
            >
              <option value={7}>Last 7</option>
              <option value={14}>Last 14</option>
              <option value={30}>Last 30</option>
              <option value={90}>Last 90</option>
              <option value={180}>Last 180</option>
              <option value={365}>Last 365</option>
              <option value={0}>All</option>
            </select>
          )}
        </div>
        <canvas ref={canvasRef} height={String(height)} />
      </div>
    </div>
  );
}


