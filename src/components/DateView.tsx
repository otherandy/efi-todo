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
        <div>
          W
          {Math.ceil(
            (date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) /
              (1000 * 60 * 60 * 24 * 7),
          )}
        </div>
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
