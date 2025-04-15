import { useEffect, useState } from "react";

import classes from "@/styles/DateView.module.css";

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

export function DateView() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.date}>
      <div className={classes.header}>
        <div>Y{date.getFullYear()}</div>
        <span className={classes.divider} />
        <div>W{String(Math.ceil(date.getDate() / 7)).padStart(2, "0")}</div>
      </div>
      <span className={classes.dividerHorizontal} />
      <div className={classes.body}>
        <div>{months[date.getMonth()]}</div>
        <span className={classes.divider} />
        <div>{date.getDate()}</div>
        <span className={classes.divider} />
        <div className={classes.emoji}>{days[date.getDay()]}</div>
      </div>
    </div>
  );
}
