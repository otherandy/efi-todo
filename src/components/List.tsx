import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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

  const [displayColorPicker, setDisplayColorPicker] = useState(false);

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

  return (
    <div className={classes.list}>
      <ListContextMenu
        setDisplayColorPicker={setDisplayColorPicker}
        handleHideList={handleHideList}
        handleClearCheckmarks={handleClearCheckmarks}
      >
        <div className={classes.title}>
          <div className={classes.icons}>
            <DangerButton confirmAction={() => deleteList(list.id)} asChild>
              <span>
                <TrashIcon />
              </span>
            </DangerButton>
            <span>
              <MinLineIcon onClick={handleHideList} />
            </span>
          </div>
          <div
            className={classes.color}
            style={{
              backgroundColor: list.color,
            }}
          >
            <input
              className={classes.input}
              style={{
                color: getReadableTextColor(list.color),
              }}
              value={list.title}
              onChange={handleChangeTitle}
            />
            {displayColorPicker && (
              <>
                <div
                  style={{
                    position: "fixed",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px",
                  }}
                  onClick={() => setDisplayColorPicker(false)}
                />
                <ColorPicker
                  color={list.color}
                  onChange={(color) => {
                    handleChangeColor(color);
                    setDisplayColorPicker(false);
                  }}
                />
              </>
            )}
          </div>
          <div className={classes.icons}>
            <span>
              <ClearCheckIcon onClick={handleClearCheckmarks} />
            </span>
            <span>
              <ThreeLinesIcon onClick={handleDeleteItems} />
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

function ListContextMenu({
  setDisplayColorPicker,
  handleHideList,
  handleClearCheckmarks,
  children,
}: {
  setDisplayColorPicker: (value: boolean) => void;
  handleHideList: () => void;
  handleClearCheckmarks: () => void;
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
        <ContextMenuItem>Half Size / Full Size</ContextMenuItem>
        {/* <ContextMenuItem onSelect={handleDeleteList}>Delete</ContextMenuItem> */}
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
