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

import { db } from "@/utils/db";
import type { List, TodoItem } from "@/types";

import { GroupComponent } from "@/components/Group";
import { TodoItemComponent } from "@/components/Item";
import {
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuContentStyled,
  ContextMenuItem,
} from "@/components/ui/ContextMenu";

import classes from "@/styles/List.module.css";
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

    const id = active.id as string;
    if (!id.startsWith("I")) return;

    db.todoItems
      .get(Number(id.slice(1)))
      .then((item) => {
        if (item) {
          setOverlayItem(item);
        }
      })
      .catch((error) => console.error(error));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!active || !over) return;
    if (active.id === over.id) return;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) return;
    if (active.id === over.id) return;
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
  const groups = useLiveQuery(() =>
    db.groups.where({ listId: list.id }).sortBy("order"),
  );

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    db.lists
      .update(list.id, { title: e.target.value })
      .catch((error) => console.error(error));
  };

  const handleAddItem = () => {
    db.transaction("rw", db.groups, db.todoItems, async () => {
      const groupId = await db.groups.add({
        listId: list.id,
        categoryId: 1,
        color: "#d9d9d9",
        order: groups?.length ?? 0,
      });

      await db.todoItems.add({
        text: "New Item",
        groupId,
        checked: false,
        starred: false,
        status: {
          selected: 0,
          elements: ["Storyboard", "Layout", "Sketch"],
          hidden: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 0,
      });
    }).catch((error) => console.error(error));
  };

  return (
    <div className={classes.list}>
      <ListContextMenu list={list}>
        <div
          className={classes.title}
          style={{
            backgroundColor: list.color,
          }}
        >
          <input value={list.title} onChange={handleChangeTitle} />
        </div>
      </ListContextMenu>
      <div className={classes.groups}>
        {groups?.map((group) => (
          <GroupComponent key={group.id} group={group} />
        ))}
        <button
          title="Add Item"
          className={classes.createButton}
          onClick={handleAddItem}
        >
          <AddCircleIcon />
        </button>
      </div>
    </div>
  );
}

function ListContextMenu({
  list,
  children,
}: {
  list: List;
  children: React.ReactNode;
}) {
  const handleHideList = () => {
    db.lists
      .update(list.id, { hidden: true })
      .catch((error) => console.error(error));
  };

  const handleDeleteList = () => {
    db.transaction("rw", db.todoItems, db.groups, db.lists, async () => {
      const groups = await db.groups.where({ listId: list.id }).toArray();
      for (const group of groups) {
        await db.todoItems.where({ groupId: group.id }).delete();
      }
      await db.groups.where({ listId: list.id }).delete();
      await db.lists.delete(list.id);
    }).catch((error) => console.error(error));
  };

  return (
    <ContextMenuRoot>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContentStyled>
        <ContextMenuItem onSelect={handleHideList}>Hide</ContextMenuItem>
        <ContextMenuItem>Color</ContextMenuItem>
        <ContextMenuItem onSelect={handleDeleteList}>Delete</ContextMenuItem>
      </ContextMenuContentStyled>
    </ContextMenuRoot>
  );
}
