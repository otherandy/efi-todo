import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { db, deleteList } from "@/utils/db";
import type { List, TodoItem } from "@/types";

import { TodoItemComponent } from "@/components/Item";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/ContextMenu";
import { ColorPicker } from "@/components/ui/ColorPicker";

import classes from "@/styles/List.module.css";

import AddCircleIcon from "@/assets/add_circle.svg?react";

export function ListComponent({
  list,
  hovering,
}: {
  list: List;
  hovering?: boolean;
}) {
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
        categoryName: "",
        text: "",
        checked: false,
        starred: false,
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
            style={{
              backgroundColor: list.color,
            }}
          >
            <input value={list.title} onChange={handleChangeTitle} />
          </div>
        </div>
      </ListContextMenu>
      {displayColorPicker && (
        <ColorPicker
          color={list.color}
          onChange={(color) => {
            handleChangeColor(color);
            setDisplayColorPicker(false);
          }}
        />
      )}
      <ListItems id={list.id} items={items} hovering={hovering} />
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

  const handleDeleteList = () => {
    deleteList(list.id);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={handleHideList}>Hide</ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            setDisplayColorPicker(true);
          }}
        >
          Color
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleDeleteList}>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function ListItems({
  id,
  items,
  hovering,
}: {
  id: number;
  items?: TodoItem[];
  hovering?: boolean;
}) {
  if (!items) {
    return null;
  }

  return (
    <SortableContext
      id={id.toString()}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div className={classes.items}>
        {items.length === 0 && hovering ? (
          <div className={classes.emptyDropZone}>
            <p>Drop items here</p>
          </div>
        ) : (
          items.map((item) => {
            return <TodoItemComponent key={item.id} item={item} />;
          })
        )}
      </div>
    </SortableContext>
  );
}
