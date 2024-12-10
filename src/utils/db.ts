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

export { db };
