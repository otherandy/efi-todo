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

  return (
    <div className={classes.date}>
      <div className={classes.header}>
        <div>{date.getFullYear()}</div>
        <Separator />
        <div>W{String(Math.ceil(date.getDate() / 7)).padStart(2, "0")}</div>
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
