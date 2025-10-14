import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MyCalendar({ value, onChange }) {
  const [internalDate, setInternalDate] = useState(new Date());
  const date = value ?? internalDate;
  const handleChange = onChange ?? setInternalDate;

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h5>Calendar</h5>
      </div>
      <div className="calendar-wrapper">
        <Calendar
          onChange={handleChange}
          value={date}
        />
      </div>
      <div className="calendar-selected-date">
        <strong>Selected date:</strong> {date.toDateString()}
      </div>
    </div>
  );
}

export default MyCalendar;
