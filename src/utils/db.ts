import Dexie, { type EntityTable } from "dexie";
import type { Category, List, TodoItem } from "@/types";

const db = new Dexie("efi-todo") as Dexie & {
  lists: EntityTable<List, "id">;
  categories: EntityTable<Category, "name">;
  todoItems: EntityTable<TodoItem, "id">;
};

db.version(1).stores({
  lists: "++id, title, hidden",
  categories: "&name, icon, hidden",
  todoItems: "++id, listId",
});

db.on("populate", async () => {
  await db.lists.bulkAdd([
    {
      title: "New List",
      color: "#90abbf",
      hidden: false,
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
      categoryName: "",
      text: "Item 1",
      checked: false,
      starred: false,
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
