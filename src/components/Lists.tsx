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
import { arrayMove } from "@dnd-kit/sortable";

import { db } from "@/utils/db";
import type { TodoItem } from "@/types";

import { ListComponent } from "@/components/List";
import { TodoItemComponent } from "@/components/Item";

import classes from "@/styles/Lists.module.css";

export function ListsComponent() {
  const lists = useLiveQuery(() => db.lists.toArray());
  const [overlayItem, setOverlayItem] = useState<TodoItem | null>(null);
  const [hovering, setHovering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setHovering(true);

    const { active } = event;
    if (!active) return;

    const itemId = parseInt(active.id as string);

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

    const itemId = parseInt(active.id as string);

    const listId = parseInt(
      (over.data.current as { sortable: { containerId: string } }).sortable
        .containerId,
    );

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
    setHovering(false);

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
          return (
            <ListComponent key={list.id} list={list} hovering={hovering} />
          );
        })}
      </div>
      <DragOverlay>
        {overlayItem !== null && <TodoItemComponent item={overlayItem} />}
      </DragOverlay>
    </DndContext>
  );
}
