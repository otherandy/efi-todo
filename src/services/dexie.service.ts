import Dexie, { type EntityTable } from "dexie";
import type {
  Category,
  CustomEmoji,
  List,
  TodoItem,
} from "@/types/index.types";
import type { DatabaseService } from "../types/db.interface";

import LvUpEmblem1Icon from "@/assets/lvup_emblem_color1.svg";
import MantaDreamsIcon from "@/assets/manta_dreams.svg";
import FracturedCoreIcon from "@/assets/fractured_core.svg";

const db = new Dexie("efi-todo") as Dexie & {
  lists: EntityTable<List, "id">;
  categories: EntityTable<Category, "name">;
  todoItems: EntityTable<TodoItem, "id">;
  customEmojis: EntityTable<CustomEmoji, "id">;
};

db.version(1).stores({
  lists: "++id, order, hidden",
  categories: "&name",
  todoItems: "++id, listId",
  customEmojis: "&id",
});

db.on("populate", async () => {
  await db.lists.bulkAdd([
    {
      order: 0,
      title: "New List",
      color: "#90abbf",
      halfSize: false,
      hidden: 0,
    },
  ]);

  // await db.categories.bulkAdd([
  //   {
  //     name: "",
  //     color: "#d9d9d9",
  //     icon: "📁",
  //     hidden: true,
  //   },
  // ]);

  await db.todoItems.bulkAdd([
    {
      listId: 1,
      order: 0,
      text: "Item 1",
      emoji: "",
      color: "#d9d9d9",
      star: 0,
      checked: false,
      status: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  await db.customEmojis.bulkAdd([
    {
      id: "lvup1",
      names: ["LvUp 1", "LvUp Emblem 1", "LvUp Emblem Color 1"],
      imgUrl: LvUpEmblem1Icon,
    },
    {
      id: "manta",
      names: ["Manta", "Manta Dreams"],
      imgUrl: MantaDreamsIcon,
    },
    {
      id: "fractured",
      names: ["Fractured", "Fractured Core"],
      imgUrl: FracturedCoreIcon,
    },
  ]);
});

export class DexieService implements DatabaseService {
  async getLists(): Promise<List[]> {
    return db.lists.orderBy("order").toArray();
  }

  async getListById(id: number): Promise<List | undefined> {
    return db.lists.get(id);
  }

  async getItems(): Promise<TodoItem[]> {
    return db.todoItems.toArray();
  }

  async getItemById(id: number): Promise<TodoItem | undefined> {
    return db.todoItems.get(id);
  }

  async getItemsByListId(listId: number): Promise<TodoItem[]> {
    return db.todoItems.where({ listId }).sortBy("order");
  }

  async getCustomEmojis(): Promise<CustomEmoji[]> {
    return db.customEmojis.toArray();
  }

  async addList(listData: Omit<List, "id">): Promise<List> {
    const id = await db.lists.add(listData);
    return { ...listData, id } as List;
  }

  async updateList(id: number, updates: Partial<List>): Promise<void> {
    await db.lists.update(id, updates);
  }

  async deleteList(id: number): Promise<void> {
    await db.transaction("rw", db.lists, db.todoItems, async () => {
      await db.todoItems.where("listId").equals(id).delete();
      await db.lists.delete(id);
    });
  }

  async addItem(itemData: Omit<TodoItem, "id">): Promise<TodoItem> {
    const now = new Date();
    const fullItemData = {
      ...itemData,
      createdAt: itemData.createdAt || now,
      updatedAt: itemData.updatedAt || now,
    };

    const id = await db.todoItems.add(fullItemData);
    return { ...fullItemData, id } as TodoItem;
  }

  async updateItem(id: number, updates: Partial<TodoItem>): Promise<void> {
    await db.todoItems.update(id, { ...updates, updatedAt: new Date() });
  }

  async deleteItem(id: number): Promise<void> {
    await db.todoItems.delete(id);
  }

  async addCustomEmoji(emoji: CustomEmoji): Promise<void> {
    await db.customEmojis.add(emoji);
  }

  async deleteCustomEmoji(emojiName: string): Promise<void> {
    await db.customEmojis.delete(emojiName);
  }

  async getAllTodoData(): Promise<{ lists: List[]; items: TodoItem[] }> {
    const [lists, items] = await Promise.all([
      this.getLists(),
      this.getItems(),
    ]);
    return { lists, items };
  }

  async reset(): Promise<void> {
    await db.delete({ disableAutoOpen: true });
  }
}

export { db };
