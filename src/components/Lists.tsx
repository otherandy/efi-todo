import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  DndContext,
  closestCorners,
  useSensors,
  useSensor,
  PointerSensor,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { db } from "@/utils/db";
import type { TodoItem } from "@/types";

import { ListComponent } from "@/components/List";
import { DummyTodoItemComponent } from "@/components/Item";

import classes from "@/styles/Lists.module.css";

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
    if (!active.data.current) return;

    if (active.data.current.type !== "item") return;

    const itemId = parseInt(active.id.toString().split("-")[1]);

    db.todoItems
      .get(itemId)
      .then((item) => {
        if (item) setOverlayItem(item);
      })
      .catch((error) => console.error(error));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    if (active.id === over.id) return;
    if (!active.data.current) return;

    if (active.data.current.type !== "item") return;

    if (!over.data.current) return;

    const itemId = parseInt(active.id.toString().split("-")[1]);
    const listId = over.data.current.listId as number;

    db.todoItems
      .get(itemId)
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

    if (!active.data.current) return;
    if (active.data.current.type !== "item") return;

    if (!over.data.current) return;
    if (over.data.current.type !== "item") return;

    const activeItemId = parseInt(active.id.toString().split("-")[1]);
    const overItemId = parseInt(over.id.toString().split("-")[1]);
    const overListId = over.data.current.listId as number;

    db.todoItems
      .where({ listId: overListId })
      .sortBy("order")
      .then(async (items) => {
        const sortedItems = arrayMove(
          items,
          items.findIndex((item) => item.id === activeItemId),
          items.findIndex((item) => item.id === overItemId),
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={classes.lists}>
        {lists?.map((list) => {
          if (list.hidden) return null;
          return <ListComponent key={list.id} list={list} />;
        })}
      </div>
      <DragOverlay>
        {overlayItem !== null && <DummyTodoItemComponent item={overlayItem} />}
      </DragOverlay>
    </DndContext>
  );
}
