import React, { useState } from "react";
import { addEntry, clearEntries } from "../services/weightService";

export default function CsvImport({ mode = "both" }) {
  const [csvData, setCsvData] = useState([]);
  const showWeight = mode === "both" || mode === "weight";
  const showMacro = mode === "both" || mode === "macro";

  const handleWeightUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      parseWeightCsv(text);
    };
    reader.readAsText(file);
  };

  const handleMacroUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      parseMacroCsv(text);
    };
    reader.readAsText(file);
  };

  const parseWeightCsv = (text) => {
    const rows = text
      .split(/\r?\n/)
      .map((row) => row.split(",").map(cell => cell.trim()))
      .filter(r => r.length && r.some(c => c));

    setCsvData(rows);

    const [maybeHeader, ...dataRows] = rows;
    const headerLooksValid = maybeHeader && maybeHeader.length >= 2 && /date/i.test(maybeHeader[0]) && /(weight|lbs?)/i.test(maybeHeader[1]);
    const body = headerLooksValid ? dataRows : rows;
    clearEntries();
    body.forEach((cols) => {
      const [d, w] = cols;
      if (!d || !w) return;
      const parsedWeight = parseFloat(String(w).replace(/[^0-9.\-]/g, ""));
      if (Number.isNaN(parsedWeight)) return;
      const isoDate = new Date(d).toISOString().slice(0, 10);
      addEntry({ date: isoDate, weight: parsedWeight });
    });
  };

  const parseMacroCsv = (text) => {
    const rows = text
      .split(/\r?\n/)
      .map((row) => row.split(",").map(cell => cell.trim()))
      .filter(r => r.length && r.some(c => c));

    setCsvData(rows);

    const [headerRow, ...dataRows] = rows;
    const header = (headerRow || []).map(h => h.toLowerCase());
    const idx = {
      date: header.findIndex(h => /date/.test(h)),
      calories: header.findIndex(h => /cal/.test(h)),
      protein: header.findIndex(h => /protein/.test(h)),
      carbs: header.findIndex(h => /carb/.test(h)),
      fat: header.findIndex(h => /fat/.test(h)),
      fiber: header.findIndex(h => /fib/.test(h))
    };

    const toNumber = (v) => {
      const n = parseFloat(String(v ?? "").replace(/[^0-9.\-]/g, ""));
      return Number.isNaN(n) ? 0 : n;
    };

    const entries = dataRows
      .map(cols => {
        const d = cols[idx.date];
        if (!d) return null;
        const isoDate = new Date(d).toISOString().slice(0, 10);
        return {
          date: isoDate,
          calories: toNumber(cols[idx.calories]),
          protein: toNumber(cols[idx.protein]),
          carbs: toNumber(cols[idx.carbs]),
          fat: toNumber(cols[idx.fat]),
          fiber: toNumber(cols[idx.fiber])
        };
      })
      .filter(Boolean);

    localStorage.setItem("macroEntries", JSON.stringify(entries));
    try {
      const evt = new CustomEvent("macroEntriesChanged", { detail: entries });
      window.dispatchEvent(evt);
    } catch {}
  };

  return (
    <div>
      <h5 className="mb-6">Import CSV Files</h5>
      {showWeight && (
        <div className="mb-3">
          <label className="form-label d-block">Weight CSV</label>
          <input type="file" accept=".csv" onChange={handleWeightUpload} />
        </div>
      )}
      {showMacro && (
        <div className="mb-3">
          <label className="form-label d-block">Macros CSV</label>
          <input type="file" accept=".csv" onChange={handleMacroUpload} />
        </div>
      )}
      <table className="table table-bordered">
        <tbody>
          {csvData.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
