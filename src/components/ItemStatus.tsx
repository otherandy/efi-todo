import { useState } from "react";
import { db } from "@/utils/db";
import { isStageStatus, isNumberStatus } from "@/utils/status";
import type { TodoItem, StageStatus, NumberStatus } from "@/types";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu";
import { Progress, ProgressIndicator } from "@/components/ui/Progress";

import classes from "@/styles/ItemStatus.module.css";

import TriangleIcon from "@/assets/triangle.svg?react";

export function ItemStatus({ item }: { item: TodoItem }) {
  if (!item.status) {
    return null;
  }

  if (isStageStatus(item.status)) {
    return <ItemStageStatus item={item} />;
  }

  if (isNumberStatus(item.status)) {
    return <ItemNumberStatus item={item} />;
  }
}

function ItemStageStatus({ item }: { item: TodoItem }) {
  const handleUpdateStatus = (newIndex: number) => {
    db.todoItems
      .update(item.id, {
        status: {
          ...item.status,
          selected: newIndex,
        } as StageStatus,
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteStatusElement = (index: number) => {
    db.todoItems
      .update(item.id, {
        status: {
          ...item.status,
          elements: (item.status as StageStatus).elements.filter(
            (_, i) => i !== index,
          ),
        } as StageStatus,
      })
      .catch((error) => console.error(error));

    if (index === (item.status as StageStatus).selected) {
      handleUpdateStatus(0);
    }
  };

  const handleKeyDownNewStatus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (e.key === "Enter") {
      e.preventDefault();
      const newElement = e.currentTarget.value.trim();

      if (newElement !== "") {
        db.todoItems
          .update(item.id, {
            status: {
              ...item.status,
              elements: [...(item.status as StageStatus).elements, newElement],
            } as StageStatus,
          })
          .catch((error) => console.error(error));

        e.currentTarget.value = "";
      }
    }
  };

  const handleSideClick = (direction: "Left" | "Right") => {
    const dir = direction === "Left" ? -1 : 1;
    let newIndex = (item.status as StageStatus).selected + dir;

    if (newIndex < 0) {
      newIndex = (item.status as StageStatus).elements.length - 1;
    } else if (newIndex >= (item.status as StageStatus).elements.length) {
      newIndex = 0;
    }

    handleUpdateStatus(newIndex);
  };

  return (
    <div className={classes.status}>
      <button
        className={classes.sideButton}
        onClick={() => handleSideClick("Left")}
      >
        <TriangleIcon
          style={{
            transform: "rotate(90deg)",
          }}
        />
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger className={classes.currentContainer}>
          <TriangleIcon className={classes.currentTriangle} />
          <div className={classes.current}>
            {
              (item.status as StageStatus).elements[
                (item.status as StageStatus).selected
              ]
            }
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent variant="item">
          {(item.status as StageStatus).elements.map((element, index) => (
            <div key={index} className={classes.stageItem}>
              <button onClick={() => handleDeleteStatusElement(index)}>
                x
              </button>
              <DropdownMenuItem
                onSelect={() => {
                  handleUpdateStatus(index);
                }}
              >
                {element}
              </DropdownMenuItem>
            </div>
          ))}
          <input placeholder="" onKeyDown={handleKeyDownNewStatus} />
        </DropdownMenuContent>
      </DropdownMenu>
      <button
        className={classes.sideButton}
        onClick={() => handleSideClick("Right")}
      >
        <TriangleIcon
          style={{
            transform: "rotate(-90deg)",
          }}
        />
      </button>
    </div>
  );
}

function ItemNumberStatus({ item }: { item: TodoItem }) {
  const [progress, setProgress] = useState(
    ((item.status as NumberStatus).current /
      (item.status as NumberStatus).max) *
      100,
  );

  const handleSideClick = (direction: "Left" | "Right") => {
    const dir = direction === "Left" ? -1 : 1;
    const newCurrent = (item.status as NumberStatus).current + dir;
    if (newCurrent < 0 || newCurrent > (item.status as NumberStatus).max) {
      return;
    }

    handleUpdateStatus({
      current: newCurrent,
      max: (item.status as NumberStatus).max,
    });
  };

  const handleUpdateStatus = (newStatus: NumberStatus) => {
    setProgress((newStatus.current / newStatus.max) * 100);

    db.todoItems
      .update(item.id, {
        status: newStatus,
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className={classes.status}>
      <button
        className={classes.sideButton}
        onClick={() => handleSideClick("Left")}
      >
        <TriangleIcon
          style={{
            transform: "rotate(90deg)",
          }}
        />
      </button>
      <DropdownMenu>
        <Progress asChild value={progress}>
          <DropdownMenuTrigger className={classes.currentContainer}>
            <ProgressIndicator
              style={{
                backgroundColor: item.color,
                transform: `translateX(-${Math.max(0, 100 - progress)}%)`,
              }}
            />
            <TriangleIcon className={classes.currentTriangle} />
            <div className={classes.current}>
              {(item.status as NumberStatus).current}
              {" / "}
              {(item.status as NumberStatus).max}
            </div>
          </DropdownMenuTrigger>
        </Progress>
        <DropdownMenuContent variant="item">
          <div className={classes.numberInputContainer}>
            <label className={classes.numberInput}>
              <span>CURRENT</span>
              <input
                type="number"
                value={(item.status as NumberStatus).current}
                onChange={(e) => {
                  const newCurrent = parseInt(e.target.value, 10);
                  if (!isNaN(newCurrent)) {
                    handleUpdateStatus({
                      current: newCurrent,
                      max: (item.status as NumberStatus).max,
                    });
                  }
                }}
                min={0}
                max={(item.status as NumberStatus).max}
                step={1}
              />
            </label>
            <label className={classes.numberInput}>
              <span>MAX</span>
              <input
                type="number"
                value={(item.status as NumberStatus).max}
                onChange={(e) => {
                  const newMax = parseInt(e.target.value, 10);
                  if (!isNaN(newMax)) {
                    handleUpdateStatus({
                      max: newMax,
                      current: (item.status as NumberStatus).current,
                    });
                  }
                }}
                min={0}
                max={100}
                step={1}
              />
            </label>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <button
        className={classes.sideButton}
        onClick={() => handleSideClick("Right")}
      >
        <TriangleIcon
          style={{
            transform: "rotate(-90deg)",
          }}
        />
      </button>
    </div>
  );
}
