import { useEffect, useState } from "react";
import {
  createList,
  createItem,
  readLists,
  readItems,
  deleteItem,
} from "./utils/db";
import { ListComponent } from "./components/List";
import { ItemComponent } from "./components/Item";
import { Item, List } from "./types";
import "./App.css";

function App() {
  const [lists, setLists] = useState<List[] | null>(null);
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    readLists()
      .then((data) => setLists(data))
      .catch((error) => console.error(error));

    readItems()
      .then((data) => setItems(data))
      .catch((error) => console.error(error));
  }, []);

  const handleCreateList = () => {
    createList("New List")
      .then((data) => {
        if (!data) return;
        const newLists = lists ? [...lists, data] : [data];
        setLists(newLists);
      })
      .catch((error) => console.error(error));
  };

  const handleAddItem = (id: string) => {
    createItem(id, "New Item")
      .then((data) => {
        if (!data) return;
        const newItems = items ? [...items, data] : [data];
        setItems(newItems);
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteItem = (id: string) => {
    deleteItem(id)
      .then((deleted) => {
        if (!deleted) return;
        if (!items) return;
        const newItems = items.filter((item) => item.id !== id);
        setItems(newItems);
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      {lists?.map((list) => (
        <ListComponent
          key={list.id}
          handleAddItem={() => handleAddItem(list.id)}
          {...list}
        >
          {items
            ?.filter((item) => item.listId === list.id)
            .map((item) => (
              <ItemComponent
                key={item.id}
                handleDeleteItem={() => handleDeleteItem(item.id)}
                {...item}
              />
            ))}
        </ListComponent>
      ))}
      <button onClick={handleCreateList}>Create List</button>
    </>
  );
}

export default App;
