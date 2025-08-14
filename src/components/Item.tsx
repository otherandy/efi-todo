import { useRef, useState, useCallback, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useDatabaseService } from "@/hooks/useDatabaseService";

import { db } from "@/services/dexie.service";
import type { TodoItem } from "@/types/index.types";
import { isStageStatus, isNumberStatus } from "@/utils/status";

import { ItemEmoji } from "@/components/Emoji";
import { ItemStatus } from "@/components/ItemStatus";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/ContextMenu";
import { ColorPicker } from "@/components/ui/ColorPicker";

import classes from "@/styles/Item.module.css";

import EmptyStarIcon from "@/assets/empty_star.svg?react";
import FullStarIcon from "@/assets/full_star.svg?react";
import EmptyCheckIcon from "@/assets/empty_check.svg?react";
import FullCheckIcon from "@/assets/full_check.svg?react";
import PriorityIcon from "@/assets/priority.svg?react";

export function FullTodoItemComponent({ item }: { item: TodoItem }) {
  return (
    <div className={classes.container}>
      <label className={classes.star}>
        <input
          type="checkbox"
          checked={item.star === 2}
          ref={(el) => {
            if (el) el.indeterminate = item.star === 1;
          }}
          onChange={() => {
            // Cycle: 0 (none) → 1 (star) → 2 (priority) → 0 ...
            const nextState =
              typeof item.star === "number" ? (item.star + 1) % 3 : 1;
            db.todoItems
              .update(item.id, { star: nextState as 0 | 1 | 2 })
              .catch((error) => console.error(error));
          }}
        />
        {item.star === 2 ? (
          <PriorityIcon />
        ) : item.star === 1 ? (
          <FullStarIcon />
        ) : (
          <EmptyStarIcon />
        )}
      </label>
      <TodoItemComponent item={item} />
      <label className={classes.check}>
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => {
            db.todoItems
              .update(item.id, { checked: !item.checked })
              .catch((error) => console.error(error));
          }}
        />
        {item.checked ? <FullCheckIcon /> : <EmptyCheckIcon />}
      </label>
    </div>
  );
}

function TodoItemComponent({ item }: { item: TodoItem }) {
  const [text, setText] = useState(item.text);
  const db = useDatabaseService();

  const itemRef = useRef<HTMLDivElement>(null);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `Item-${item.id}`,
    data: { type: "item", listId: item.listId },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleChangeItemText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      db.addItem({
        listId: item.listId,
        order: item.order + 1,
        text: "",
        emoji: "",
        color: "#d9d9d9",
        star: 0,
        checked: false,
        status: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).catch((error) => console.error(error));
    }
  };

  const handleDeleteItem = () => {
    db.deleteItem(item.id).catch((error) => console.error(error));
  };

  const handleBlur = () => {
    if (text.trim() === "") {
      handleDeleteItem();
    } else if (text !== item.text) {
      db.updateItem(item.id, { text }).catch((error) => console.error(error));
    }
  };

  const handleChangeColor = (color: string) => {
    db.updateItem(item.id, { color }).catch((error) => console.error(error));
  };

  const updatePickerPos = useCallback(() => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setPickerPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, []);

  useEffect(() => {
    if (!displayColorPicker) return;

    updatePickerPos();
    window.addEventListener("scroll", updatePickerPos, true);
    window.addEventListener("resize", updatePickerPos);

    return () => {
      window.removeEventListener("scroll", updatePickerPos, true);
      window.removeEventListener("resize", updatePickerPos);
    };
  }, [displayColorPicker, updatePickerPos]);

  return (
    <ItemContextMenu item={item} setDisplayColorPicker={setDisplayColorPicker}>
      <div
        ref={setNodeRef}
        className={classes.item}
        style={style}
        {...attributes}
      >
        <div ref={itemRef} className={classes.content} {...listeners}>
          <span
            className={classes.cornerDecoration}
            style={
              {
                "--cat-color": item.color,
              } as React.CSSProperties
            }
          />
          <ItemEmoji itemId={item.id} emoji={item.emoji} />
          {/* <span className={classes.separator} /> */}
          <input
            aria-label="Item Text"
            autoFocus
            value={text}
            onChange={handleChangeItemText}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
          <button
            aria-label="Delete Item"
            className={classes.deleteButton}
            onClick={handleDeleteItem}
          >
            x
          </button>
        </div>
        <ItemStatus item={item} />
        {displayColorPicker && pickerPos && (
          <ColorPicker
            color={item.color}
            pickerPos={pickerPos}
            setDisplayColorPicker={setDisplayColorPicker}
            handleChangeColor={handleChangeColor}
          />
        )}
      </div>
    </ItemContextMenu>
  );
}

export function DummyTodoItemComponent({ item }: { item: TodoItem }) {
  return (
    <div className={classes.item}>
      <div className={classes.content}>
        <span
          className={classes.cornerDecoration}
          style={
            {
              "--cat-color": item.color,
            } as React.CSSProperties
          }
        />
        <ItemEmoji itemId={item.id} emoji={item.emoji} />
        {/* <span className={classes.separator} /> */}
        <input aria-label="Item Text" autoFocus value={item.text} readOnly />
        <button aria-label="Delete Item" className={classes.deleteButton}>
          x
        </button>
      </div>
    </div>
  );
}

function ItemContextMenu({
  item,
  setDisplayColorPicker,
  children,
}: {
  item: TodoItem;
  setDisplayColorPicker: (value: boolean) => void;
  children: React.ReactNode;
}) {
  const db = useDatabaseService();

  const handleDuplicateItem = () => {
    db.addItem({
      listId: item.listId,
      order: item.order + 1,
      text: item.text,
      emoji: item.emoji,
      color: item.color,
      star: item.star,
      checked: item.checked,
      status: item.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).catch((error) => console.error(error));
  };

  const handleAssignStageStatus = () => {
    if (isStageStatus(item.status)) {
      db.updateItem(item.id, {
        status: null,
      }).catch((error) => console.error(error));
      return;
    }

    db.updateItem(item.id, {
      status: {
        current: 0,
        max: 3,
      },
    }).catch((error) => console.error(error));
  };

  const handleAssignNumberStatus = () => {
    if (isNumberStatus(item.status)) {
      db.updateItem(item.id, {
        status: null,
      }).catch((error) => console.error(error));
      return;
    }

    db.updateItem(item.id, {
      status: {
        current: 0,
        max: 10,
      },
    }).catch((error) => console.error(error));
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => setDisplayColorPicker(true)}>
          Color
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleDuplicateItem}>
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleAssignStageStatus}>
          {isStageStatus(item.status) ? "Remove" : "Assign"} Stage Status
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleAssignNumberStatus}>
          {isNumberStatus(item.status) ? "Remove" : "Assign"} Number Status
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
