import { useCallback, useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { createItem, db, deleteList } from "@/utils/db";
import { getReadableTextColor } from "@/utils/color";
import type { List, TodoItem } from "@/types";

import { FullTodoItemComponent } from "@/components/Item";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/ContextMenu";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { DangerButton } from "@/components/ui/DangerButton";

import classes from "@/styles/List.module.css";

import AddCircleIcon from "@/assets/add_circle.svg?react";
import TrashIcon from "@/assets/trash.svg?react";
import MinLineIcon from "@/assets/min_line.svg?react";
import ClearCheckIcon from "@/assets/clear_check.svg?react";
import ThreeLinesIcon from "@/assets/three_lines.svg?react";

export function ListComponent({ list }: { list: List }) {
  const items = useLiveQuery(() =>
    db.todoItems.where({ listId: list.id }).sortBy("order"),
  );

  const listRef = useRef<HTMLInputElement>(null);
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
    id: `List-${list.id}`,
    data: { type: "list", listId: list.id },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: list.color,
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    db.lists
      .update(list.id, { title: e.target.value })
      .catch((error) => console.error(error));
  };

  const handleAddItem = () => {
    createItem(list.id, items?.length ?? 0);
  };

  const handleChangeColor = (color: string) => {
    db.lists.update(list.id, { color }).catch((error) => console.error(error));
  };

  const handleHideList = () => {
    db.lists
      .update(list.id, { hidden: 1 })
      .catch((error) => console.error(error));
  };

  const handleClearCheckmarks = () => {
    db.todoItems
      .where({ listId: list.id })
      .modify({ checked: false, updatedAt: new Date() })
      .catch((error) => console.error(error));
  };

  const handleDeleteItems = () => {
    db.todoItems
      .where({ listId: list.id })
      .delete()
      .catch((error) => console.error(error));
  };

  const handleResize = () => {
    db.lists
      .update(list.id, { halfSize: !list.halfSize })
      .catch((error) => console.error(error));
  };

  const updatePickerPos = useCallback(() => {
    if (listRef.current) {
      const rect = listRef.current.getBoundingClientRect();
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
    <div
      className={classes.list}
      style={{
        height: list.halfSize ? "50%" : "100%",
      }}
    >
      <ListContextMenu
        setDisplayColorPicker={setDisplayColorPicker}
        handleHideList={handleHideList}
        handleClearCheckmarks={handleClearCheckmarks}
        handleResize={handleResize}
        halfSize={list.halfSize}
      >
        <div className={classes.title}>
          <div className={classes.icons}>
            <DangerButton
              action="Delete?"
              description={`You're about to delete the list "${list.title}".`}
              confirmAction={() => deleteList(list.id)}
              asChild
            >
              <span>
                <TrashIcon />
              </span>
            </DangerButton>
            <span onClick={handleHideList}>
              <MinLineIcon />
            </span>
          </div>
          <div
            className={classes.color}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
          >
            <input
              ref={listRef}
              className={classes.input}
              style={{
                color: getReadableTextColor(list.color),
              }}
              value={list.title}
              onChange={handleChangeTitle}
            />
            {displayColorPicker && pickerPos && (
              <ColorPicker
                color={list.color}
                pickerPos={pickerPos}
                setDisplayColorPicker={setDisplayColorPicker}
                handleChangeColor={handleChangeColor}
              />
            )}
          </div>
          <div className={classes.icons}>
            <span onClick={handleClearCheckmarks}>
              <ClearCheckIcon />
            </span>
            <span onClick={handleDeleteItems}>
              <ThreeLinesIcon />
            </span>
          </div>
        </div>
      </ListContextMenu>
      <ListItems id={list.id} items={items} />
      <div className={classes.createButton}>
        <button title="Add Item" onClick={handleAddItem}>
          <AddCircleIcon />
        </button>
      </div>
    </div>
  );
}

export function DummyListComponent({ list }: { list: List }) {
  return (
    <div className={classes.title}>
      <div className={classes.color} style={{ backgroundColor: list.color }}>
        <input
          className={classes.input}
          value={list.title}
          disabled
          style={{
            color: getReadableTextColor(list.color),
          }}
        />
      </div>
    </div>
  );
}

function ListContextMenu({
  setDisplayColorPicker,
  handleHideList,
  handleClearCheckmarks,
  handleResize,
  halfSize,
  children,
}: {
  setDisplayColorPicker: (value: boolean) => void;
  handleHideList: () => void;
  handleClearCheckmarks: () => void;
  handleResize: () => void;
  halfSize: boolean;
  children: React.ReactNode;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            setDisplayColorPicker(true);
          }}
        >
          Color
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleHideList}>Minimize</ContextMenuItem>
        <ContextMenuItem onSelect={handleClearCheckmarks}>
          Clear Checkmarks
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleResize}>
          {halfSize ? "Full Size" : "Half Size"}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function ListItems({ id, items }: { id: number; items?: TodoItem[] }) {
  const { setNodeRef } = useDroppable({
    id: "List-" + id,
    data: { type: "list", listId: id },
  });

  if (!items) {
    return null;
  }

  return (
    <SortableContext
      id={"List-" + id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className={classes.items}>
        {items.map((item) => {
          return <FullTodoItemComponent key={item.id} item={item} />;
        })}
      </div>
    </SortableContext>
  );
}
