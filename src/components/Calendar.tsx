import { useEffect, useState } from "react";

import classes from "@/styles/Calendar.module.css";

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const days = ["☀️", "🌙", "🔥", "💧", "🌳", "⭐", "🏔"];

export function Calendar() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.calendar}>
      <div>{months[date.getMonth()]}</div>
      <span />
      <div>{date.getDate()}</div>
      <span />
      <div>{days[date.getDay()]}</div>
    </div>
  );
}
