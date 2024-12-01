import {
  addData,
  deleteData,
  getData,
  initDb,
  Stores,
  updateData,
} from "./idb";

import { Category, Item, List } from "../../types";

const dbName = "efi-todo";
const dbVersion = 1;

function connectDb() {
  return initDb(dbName, dbVersion, [
    Stores.LISTS,
    Stores.ITEMS,
    Stores.CATEGORIES,
  ]);
}

function createList(title: string) {
  const data: List = {
    id: Date.now().toString(),
    title,
    color: "#000000",
  };

  return addData(dbName, dbVersion, Stores.LISTS, data);
}

function createItem(listId: string, text?: string) {
  const data: Item = {
    id: Date.now().toString(),
    text: text ?? "",
    completed: false,
    starred: false,
    listId,
    categoryId: "",
    statusItems: [],
    statusIndex: 0,
  };

  return addData(dbName, dbVersion, Stores.ITEMS, data);
}

function createCategory(data: Category) {
  return addData(dbName, dbVersion, Stores.CATEGORIES, data);
}

function readLists() {
  return getData<List>(dbName, dbVersion, Stores.LISTS);
}

function readItems() {
  return getData<Item>(dbName, dbVersion, Stores.ITEMS);
}

function readCategories() {
  return getData<Category>(dbName, dbVersion, Stores.CATEGORIES);
}

function updateList(data: List) {
  return updateData(dbName, dbVersion, Stores.LISTS, data);
}

function updateItem(data: Item) {
  return updateData(dbName, dbVersion, Stores.ITEMS, data);
}

function updateCategory(data: Category) {
  return updateData(dbName, dbVersion, Stores.CATEGORIES, data);
}

function deleteList(id: string) {
  return deleteData(dbName, dbVersion, Stores.LISTS, id);
}

function deleteItem(id: string) {
  return deleteData(dbName, dbVersion, Stores.ITEMS, id);
}

function deleteCategory(id: string) {
  return deleteData(dbName, dbVersion, Stores.CATEGORIES, id);
}

export {
  connectDb,
  createList,
  createItem,
  createCategory,
  readLists,
  readItems,
  readCategories,
  updateList,
  updateItem,
  updateCategory,
  deleteList,
  deleteItem,
  deleteCategory,
};
