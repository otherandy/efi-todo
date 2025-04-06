import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { db, deleteList } from "@/utils/db";
import type { List, TodoItem } from "@/types";

import { TodoItemComponent } from "@/components/Item";
import {
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuContentStyled,
  ContextMenuItem,
} from "@/components/ui/ContextMenu";
import { ColorPicker } from "@/components/ui/ColorPicker";
import {
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuPortal,
} from "@/components/ui/DropdownMenu";

import classes from "@/styles/List.module.css";
import classesCM from "@/styles/ContextMenu.module.css";
import AddCircleIcon from "@/assets/add_circle.svg?react";

export function ListsComponent() {
  const lists = useLiveQuery(() => db.lists.toArray());
  const [overlayItem, setOverlayItem] = useState<TodoItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (!active) return;

    db.todoItems
      .get(parseInt(active.id as string))
      .then((item) => {
        if (item) setOverlayItem(item);
      })
      .catch((error) => console.error(error));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!active || !over) return;
    if (active.id === over.id) return;

    const listId = parseInt(
      (over.data.current as { sortable: { containerId: string } }).sortable
        .containerId,
    );

    db.todoItems
      .get(parseInt(active.id as string))
      .then((item) => {
        if (!item) return;

        if (item.listId !== listId) {
          db.todoItems
            .update(item.id, {
              listId: listId,
              updatedAt: new Date(),
            })
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => console.error(error));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) return;
    if (active.id === over.id) return;

    const listId = parseInt(
      (over.data.current as { sortable: { containerId: string } }).sortable
        .containerId,
    );

    db.todoItems
      .where({ listId: listId })
      .sortBy("order")
      .then(async (items) => {
        const sortedItems = arrayMove(
          items,
          items.findIndex((item) => item.id === parseInt(active.id as string)),
          items.findIndex((item) => item.id === parseInt(over.id as string)),
        );

        for (const item of sortedItems) {
          await db.todoItems.update(item.id, {
            order: sortedItems.indexOf(item),
            updatedAt: new Date(),
          });
        }
      })
      .catch((error) => console.error(error));
  };

  // const handleAddList = () => {
  //   db.lists
  //     .add({
  //       title: "New List",
  //       color: "#d9d9d9",
  //       hidden: false,
  //     })
  //     .catch((error) => console.error(error));
  // };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={classes.lists}>
        {lists?.map((list) => {
          if (list.hidden) return null;
          return <ListComponent key={list.id} list={list} />;
        })}
        {/* <button
          title="Add List"
          className={classes.createButton}
          onClick={handleAddList}
        >
          <AddCircleIcon />
        </button> */}
      </div>
      <DragOverlay>
        {overlayItem !== null && <TodoItemComponent item={overlayItem} />}
      </DragOverlay>
    </DndContext>
  );
}

export function ListComponent({ list }: { list: List }) {
  const items = useLiveQuery(() =>
    db.todoItems.where({ listId: list.id }).sortBy("order"),
  );

  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  // const categories = items?.reduce((acc, item) => {
  //   if (!acc.includes(item.categoryName)) {
  //     acc.push(item.categoryName);
  //   }
  //   return acc;
  // }, [] as string[]);

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
        <>
          <div
            className={classes.title}
            style={{
              backgroundColor: list.color,
            }}
          >
            <input value={list.title} onChange={handleChangeTitle} />
            <DropdownMenuRoot>
              <DropdownMenuTrigger asChild>
                <button>:</button>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent className={classesCM.contextMenu}>
                  <DropdownMenuItem
                    onClick={() => {
                      setDisplayColorPicker(true);
                    }}
                  >
                    Color
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </div>
          {displayColorPicker && (
            <ColorPicker
              color={list.color}
              onChange={(color) => {
                handleChangeColor(color);
                setDisplayColorPicker(false);
              }}
            />
          )}
        </>
      </ListContextMenu>
      <ListItems id={list.id} items={items} />
      <button
        title="Add Item"
        className={classes.createButton}
        onClick={handleAddItem}
      >
        <AddCircleIcon />
      </button>
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
      .update(list.id, { hidden: true })
      .catch((error) => console.error(error));
  };

  const handleDeleteList = () => {
    deleteList(list.id);
  };

  return (
    <ContextMenuRoot>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContentStyled>
        <ContextMenuItem onSelect={handleHideList}>Hide</ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            setDisplayColorPicker(true);
          }}
        >
          Color
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleDeleteList}>Delete</ContextMenuItem>
      </ContextMenuContentStyled>
    </ContextMenuRoot>
  );
}

function ListItems({ id, items }: { id: number; items?: TodoItem[] }) {
  if (!items) return null;

  return (
    <SortableContext
      id={id.toString()}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div className={classes.items}>
        {items.map((item) => {
          return <TodoItemComponent key={item.id} item={item} />;
        })}
      </div>
    </SortableContext>
  );
}
