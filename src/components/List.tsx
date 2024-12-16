import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { db } from "@/utils/db";
import type { List, TodoItem } from "@/types";

import { GroupComponent } from "@/components/Group";
import { TodoItemComponent } from "@/components/Item";
import * as ContextMenu from "@radix-ui/react-context-menu";

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
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={classes.lists}>
        {lists?.map((list) => <ListComponent key={list.id} list={list} />)}
        <button
          title="Add List"
          className={classes.create}
          onClick={() => {
            db.lists
              .add({
                title: "New List",
                color: "#d9d9d9",
                hidden: false,
              })
              .catch((error) => console.error(error));
          }}
        >
          <AddCircleIcon />
        </button>
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

  return (
    <div className={classes.list}>
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <div
            className={classes.title}
            style={{
              backgroundColor: list.color,
            }}
          >
            <input
              className={classes.title}
              value={list.title}
              onChange={(e) => {
                db.lists
                  .update(list.id, { title: e.target.value })
                  .catch((error) => console.error(error));
              }}
            />
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content>
            <ContextMenu.Item
              onSelect={() => {
                db.todoItems
                  .where({ listId: list.id })
                  .delete()
                  .catch((error) => console.error(error));
                db.groups
                  .where({ listId: list.id })
                  .delete()
                  .catch((error) => console.error(error));
                db.lists.delete(list.id).catch((error) => console.error(error));
              }}
            >
              Delete
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <div className={classes.groups}>
        {groups?.map((group) => (
          <GroupComponent key={group.id} group={group} />
        ))}
        <button
          title="Add Item"
          className={classes.create}
          onClick={() => {
            db.groups
              .put({
                listId: list.id,
                categoryId: 1,
                order: groups?.length ?? 0,
              })
              .then(async (groupId) => {
                await db.todoItems.add({
                  text: "New Item",
                  groupId,
                  completed: false,
                  starred: false,
                  status: { selectedIndex: 0, elements: [] },
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  order: 0,
                });
              })
              .catch((error) => console.error(error));
          }}
        >
          <AddCircleIcon />
        </button>
      </div>
    </div>
  );
}
