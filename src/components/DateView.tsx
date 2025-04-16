import { useEffect, useState } from "react";

import classes from "@/styles/DateView.module.css";
import { Separator } from "@/components/ui/Separator";

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

  const getWeek = function () {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  return (
    <div className={classes.date}>
      <div className={classes.header}>
        <div>{date.getFullYear()}</div>
        <Separator />
        <div>W{String(getWeek()).padStart(2, "0")}</div>
      </div>
      <Separator orientation="horizontal" />
      <div className={classes.body}>
        <div>{months[date.getMonth()]}</div>
        <Separator style={{ height: "60%" }} />
        <div>{date.getDate()}</div>
        <Separator style={{ height: "60%" }} />
        <div className={classes.emoji}>{days[date.getDay()]}</div>
      </div>
    </div>
  );
}
