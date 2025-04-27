import { db } from "@/utils/db";
import type { TodoItem, StageStatus, NumberStatus } from "@/types";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu";

import classes from "@/styles/ItemStatus.module.css";

import TriangleIcon from "@/assets/triangle.svg?react";

function isStageStatus(status: unknown): status is StageStatus {
  return (
    typeof status === "object" &&
    status !== null &&
    Array.isArray((status as Record<string, unknown>).elements) &&
    typeof (status as Record<string, unknown>).selected === "number"
  );
}

function isNumberStatus(status: unknown): status is NumberStatus {
  return (
    typeof status === "object" &&
    status !== null &&
    typeof (status as Record<string, unknown>).current === "number" &&
    typeof (status as Record<string, unknown>).max === "number"
  );
}

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
        <DropdownMenuTrigger className={classes.element}>
          <TriangleIcon />
          <div>
            {
              (item.status as StageStatus).elements[
                (item.status as StageStatus).selected
              ]
            }
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent variant="item">
          {(item.status as StageStatus).elements.map((element, index) => (
            <div key={index}>
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
  return (
    <div className={classes.status}>
      <div>{(item.status as NumberStatus).current}</div>
      <div>/</div>
      <div>{(item.status as NumberStatus).max}</div>
    </div>
  );
}
