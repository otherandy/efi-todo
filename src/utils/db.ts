import Dexie, { type EntityTable } from "dexie";
import type {
  Category,
  CustomEmoji,
  List,
  NumberStatus,
  StageStatus,
  Star,
  TodoItem,
} from "@/types";

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
      size: "full",
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

function deleteList(id: number) {
  db.transaction("rw", db.lists, db.todoItems, async () => {
    await db.todoItems.where("listId").equals(id).delete();
    await db.lists.delete(id);
  }).catch((error) => {
    console.error(error);
  });
}

function addList() {
  db.lists
    .add({
      title: "New List",
      color: "#d9d9d9",
      size: "full",
      hidden: 0,
    })
    .catch((error) => console.error(error));
}

function createItem(
  listId: number,
  order: number,
  text = "",
  emoji = "",
  color = "#d9d9d9",
  star: Star = 0,
  checked = false,
  status: StageStatus | NumberStatus | null = null,
) {
  db.todoItems
    .add({
      listId,
      order,
      text,
      emoji,
      color,
      star,
      checked,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .catch((error) => console.error(error));
}

export { db, deleteList, addList, createItem };
