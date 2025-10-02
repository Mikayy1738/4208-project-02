import React, { useState, useEffect } from 'react';
import { getEntries } from '../services/weightService.js';

export default function CurrentWeight() {
  const [range, setRange] = useState(30);
  const [entries, setEntries] = useState(getEntries());
  
  useEffect(() => {
    const updateEntries = () => setEntries(getEntries());
    const handleRangeChange = (event) => setRange(event.detail.range);
    
    window.addEventListener('weightEntriesChanged', updateEntries);
    window.addEventListener('weightChartRangeChanged', handleRangeChange);
    
    return () => {
      window.removeEventListener('weightEntriesChanged', updateEntries);
      window.removeEventListener('weightChartRangeChanged', handleRangeChange);
    };
  }, []);

  const currentWeight = entries[entries.length - 1]?.weight;
  
  // Calculate average weight for the selected range
  const getAverageWeight = () => {
    if (entries.length === 0) return null;
    
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const lastDate = new Date(sortedEntries[sortedEntries.length - 1]?.date);
    
    if (isNaN(lastDate.getTime())) return null;
    
    let dataSource = sortedEntries;
    if (range > 0) {
      const cutoffDate = new Date(lastDate);
      cutoffDate.setDate(cutoffDate.getDate() - range + 1);
      dataSource = sortedEntries.filter(entry => new Date(entry.date) >= cutoffDate);
    }
    
    if (dataSource.length === 0) return null;
    
    const totalWeight = dataSource.reduce((sum, entry) => sum + entry.weight, 0);
    return (totalWeight / dataSource.length).toFixed(1);
  };

  const averageWeight = getAverageWeight();
  const rangeText = range === 0 ? 'All time' : `Last ${range} days`;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Current Weight</h5>
        <div className="display-4">{currentWeight}</div>
        <div className="text-muted mb-2">Last updated: {entries[entries.length - 1]?.date}</div>
        {averageWeight && (
          <div className="text-muted small">
            Avg ({rangeText}): {averageWeight} lbs
          </div>
        )}
      </div>
    </div>
  );
}
