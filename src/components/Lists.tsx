import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  DndContext,
  rectIntersection,
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
  rectSwappingStrategy,
} from "@dnd-kit/sortable";

import { db } from "@/utils/db";
import type { List, TodoItem } from "@/types";

import { DummyListComponent, ListComponent } from "@/components/List";
import { DummyTodoItemComponent } from "@/components/Item";

import classes from "@/styles/Lists.module.css";

export function ListsComponent() {
  const lists = useLiveQuery(() => db.lists.orderBy("order").toArray());
  const [overlayItem, setOverlayItem] = useState<TodoItem | null>(null);
  const [overlayList, setOverlayList] = useState<List | null>(null);
  const [overlayType, setOverlayType] = useState<"item" | "list" | null>(null);

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

    if (active.data.current.type === "item") {
      const itemId = parseInt(active.id.toString().split("-")[1]);

      db.todoItems
        .get(itemId)
        .then((item) => {
          if (item) setOverlayItem(item);
        })
        .catch((error) => console.error(error));

      setOverlayType("item");
    }

    if (active.data.current.type === "list") {
      const listId = parseInt(active.id.toString().split("-")[1]);

      db.lists
        .get(listId)
        .then((list) => {
          if (list) setOverlayList(list);
        })
        .catch((error) => console.error(error));

      setOverlayType("list");
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    if (active.id === over.id) return;
    if (!active.data.current) return;
    if (!over.data.current) return;

    if (active.data.current.type === "item") {
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
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) return;
    if (active.id === over.id) return;

    if (!active.data.current) return;
    if (!over.data.current) return;

    if (
      active.data.current.type === "item" &&
      over.data.current.type === "item"
    ) {
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
    }

    if (
      active.data.current.type === "list" &&
      over.data.current.type === "list"
    ) {
      const activeListId = parseInt(active.id.toString().split("-")[1]);
      const overListId = parseInt(over.id.toString().split("-")[1]);

      db.lists
        .orderBy("order")
        .toArray()
        .then(async (lists) => {
          const sortedLists = arrayMove(
            lists,
            lists.findIndex((list) => list.id === activeListId),
            lists.findIndex((list) => list.id === overListId),
          );

          for (const list of sortedLists) {
            await db.lists.update(list.id, {
              order: sortedLists.indexOf(list),
            });
          }
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={lists?.map((list) => list.id) ?? []}
        strategy={rectSwappingStrategy}
      >
        <div className={classes.lists}>
          {lists?.map((list) => {
            if (list.hidden) return null;
            return <ListComponent key={list.id} list={list} />;
          })}
        </div>
      </SortableContext>
      <DragOverlay>
        {overlayType === "item" && overlayItem ? (
          <DummyTodoItemComponent item={overlayItem} />
        ) : null}
        {overlayType === "list" && overlayList ? (
          <DummyListComponent list={overlayList} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
