import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { db } from "@/utils/db";
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

import classes from "@/styles/List.module.css";

import AddCircleIcon from "@/assets/add_circle.svg?react";

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
    db.todoItems
      .add({
        listId: list.id,
        order: items?.length ?? 0,
        text: "",
        checked: false,
        starred: false,
        categoryName: "",
        emoji: "",
        status: {
          selected: 0,
          elements: [],
          hidden: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .catch((error) => console.error(error));
  };

  const handleChangeColor = (color: string) => {
    db.lists.update(list.id, { color }).catch((error) => console.error(error));
  };

  return (
    <div className={classes.list}>
      <ListContextMenu
        list={list}
        setDisplayColorPicker={setDisplayColorPicker}
      >
        <div className={classes.title}>
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
          </div>
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
  list,
  setDisplayColorPicker,
  children,
}: {
  list: List;
  setDisplayColorPicker: (value: boolean) => void;
  children: React.ReactNode;
}) {
  const handleHideList = () => {
    db.lists
      .update(list.id, { hidden: 1 })
      .catch((error) => console.error(error));
  };

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
        <ContextMenuItem>Clear Checkmark</ContextMenuItem>
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
