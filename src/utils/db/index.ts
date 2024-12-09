import {
  addData,
  deleteData,
  getData,
  initDb,
  Stores,
  updateData,
} from "./idb";

import { Category, Group, List, TodoItem } from "@/types";

const dbName = "efi-todo";
const dbVersion = 1;
const stores = [
  { name: Stores.LISTS, keyPath: "id" },
  { name: Stores.CATEGORIES, keyPath: "name" },
];

function connectDb() {
  return initDb(dbName, dbVersion, stores);
}

function createList(title: string) {
  const data: List = {
    id: Date.now().toString(),
    title,
    color: "#f3f3f3",
    hidden: false,
    groups: [],
  };

  return addData(dbName, dbVersion, Stores.LISTS, data);
}

function createTodoItem(list: List, groupId?: string, text = "") {
  const data: TodoItem = {
    id: Date.now().toString(),
    text,
    completed: false,
    starred: false,
    status: { selectedIndex: 0, array: [] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  let newList = { ...list };

  if (!groupId) {
    const newGroup: Group = {
      id: Date.now().toString(),
      categoryName: "",
      items: [data],
    };

    newList = {
      ...newList,
      groups: [...newList.groups, newGroup],
    };
  }

  newList = {
    ...newList,
    groups: newList.groups.map((group) => {
      if (group.id === groupId) {
        return { ...group, items: [...group.items, data] };
      }
      return group;
    }),
  };

  return updateData(dbName, dbVersion, Stores.LISTS, newList);
}

function createCategory(name: string) {
  const data: Category = {
    name,
    color: "red",
    icon: "📁",
    hidden: false,
  };

  return addData(dbName, dbVersion, Stores.CATEGORIES, data);
}

function readLists() {
  return getData<List>(dbName, dbVersion, Stores.LISTS);
}

function readCategories() {
  return getData<Category>(dbName, dbVersion, Stores.CATEGORIES);
}

function updateList(data: List) {
  return updateData(dbName, dbVersion, Stores.LISTS, data);
}

function updateTodoItem(list: List, groupId: string, data: TodoItem) {
  const newList = {
    ...list,
    groups: list.groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          items: group.items.map((item) => (item.id === data.id ? data : item)),
        };
      }
      return group;
    }),
  };

  return updateData(dbName, dbVersion, Stores.LISTS, newList);
}

function updateCategory(data: Category) {
  return updateData(dbName, dbVersion, Stores.CATEGORIES, data);
}

function deleteList(id: string) {
  return deleteData(dbName, dbVersion, Stores.LISTS, id);
}

function deleteTodoItem(list: List, groupId: string, id: string) {
  const newList = {
    ...list,
    groups: list.groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          items: group.items.filter((item) => item.id !== id),
        };
      }
      return group;
    }),
  };

  return updateData(dbName, dbVersion, Stores.LISTS, newList);
}

function deleteCategory(id: string) {
  return deleteData(dbName, dbVersion, Stores.CATEGORIES, id);
}

export {
  connectDb,
  createList,
  createTodoItem,
  createCategory,
  readLists,
  readCategories,
  updateList,
  updateTodoItem,
  updateCategory,
  deleteList,
  deleteTodoItem,
  deleteCategory,
};
