import Dexie, { type EntityTable } from "dexie";
import type { Category, Group, List, TodoItem } from "@/types";

const db = new Dexie("efi-todo") as Dexie & {
  lists: EntityTable<List, "id">;
  categories: EntityTable<Category, "id">;
  groups: EntityTable<Group, "id">;
  todoItems: EntityTable<TodoItem, "id">;
};

db.version(1).stores({
  lists: "++id, title",
  categories: "++id, &name",
  groups: "++id, listId, categoryId",
  todoItems: "++id, groupId",
});

db.on("populate", async () => {
  await db.lists.bulkAdd([
    { title: "New List", color: "#d9d9d9", hidden: false },
  ]);

  await db.categories.bulkAdd([
    { name: "", color: "#d9d9d9", icon: "", hidden: true },
  ]);
});

export { db };
