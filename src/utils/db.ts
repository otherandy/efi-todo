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
  groups: "++id, listId, categoryId, order",
  todoItems: "++id, groupId, order",
});

db.on("populate", async () => {
  await db.lists.bulkAdd([
    { title: "New List", color: "#d9d9d9", hidden: false },
  ]);

  await db.categories.bulkAdd([
    { name: "New Category", color: "#d9d9d9", icon: "📁", hidden: false },
  ]);

  await db.groups.bulkAdd([
    {
      listId: 1,
      categoryId: 1,
      color: "#d9d9d9",
      order: 0,
    },
  ]);

  await db.todoItems.bulkAdd([
    {
      groupId: 1,
      text: "New Item",
      completed: false,
      starred: false,
      status: { selectedIndex: 0, elements: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
      order: 0,
    },
  ]);
});

export { db };
