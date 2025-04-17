import Dexie, { type EntityTable } from "dexie";
import type { Category, CustomEmoji, List, TodoItem } from "@/types";

const db = new Dexie("efi-todo") as Dexie & {
  lists: EntityTable<List, "id">;
  categories: EntityTable<Category, "name">;
  todoItems: EntityTable<TodoItem, "id">;
  customEmojis: EntityTable<CustomEmoji, "id">;
};

db.version(1).stores({
  lists: "++id, hidden",
  categories: "&name",
  todoItems: "++id, listId",
  customEmojis: "&id",
});

db.on("populate", async () => {
  await db.lists.bulkAdd([
    {
      title: "New List",
      color: "#90abbf",
      hidden: 0,
    },
  ]);

  await db.categories.bulkAdd([
    {
      name: "",
      color: "#d9d9d9",
      icon: "📁",
      hidden: true,
    },
  ]);

  await db.todoItems.bulkAdd([
    {
      listId: 1,
      order: 0,
      text: "Item 1",
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
    },
  ]);
});

export function deleteList(id: number) {
  db.transaction("rw", db.lists, db.todoItems, async () => {
    await db.todoItems.where("listId").equals(id).delete();
    await db.lists.delete(id);
  }).catch((error) => {
    console.error(error);
  });
}

export { db };
