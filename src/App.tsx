import { useEffect, useState } from "react";
import {
  createList,
  createTodoItem,
  readLists,
  deleteList,
  createCategory,
  deleteCategory,
  deleteTodoItem,
  updateList,
} from "./utils/db";
import { ListComponent } from "./components/List";
import { TodoItemComponent } from "./components/Item";
import { CategoryComponent } from "./components/Category";
import { Category, List } from "./types";
import "./App.css";
import { GroupComponent } from "./components/Group";

function App() {
  const [lists, setLists] = useState<List[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    readLists()
      .then((data) => setLists(data))
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

  const handleDeleteList = (listId: string) => {
    deleteList(listId)
      .then((deleted) => {
        if (!deleted) return;
        const newLists = lists!.filter((list) => list.id !== listId);
        setLists(newLists);
      })
      .catch((error) => console.error(error));
  };

  const handleAddTodoItem = (list: List, groupId?: string) => {
    createTodoItem(list, groupId, "New Item")
      .then((data) => {
        if (!data) return;
        const newLists = lists!.map((list) =>
          list.id === data.id ? data : list,
        );
        setLists(newLists);
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteTodoItem = (
    list: List,
    groupId: string,
    itemId: string,
  ) => {
    deleteTodoItem(list, groupId, itemId)
      .then((data) => {
        if (!data) return;
        const newLists = lists!.map((list) =>
          list.id === data.id ? data : list,
        );
        setLists(newLists);
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteGroup = (list: List, groupId: string) => {
    const newList = {
      ...list,
      groups: list.groups.filter((group) => group.id !== groupId),
    };

    updateList(newList)
      .then((data) => {
        if (!data) return;
        const newLists = lists!.map((list) =>
          list.id === data.id ? data : list,
        );
        setLists(newLists);
      })
      .catch((error) => console.error(error));
  };

  const handleCreateCategory = () => {
    createCategory("New Category")
      .then((data) => {
        if (!data) return;
        const newCategories = categories ? [...categories, data] : [data];
        setCategories(newCategories);
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId)
      .then((deleted) => {
        if (!deleted) return;
        const newCategories = categories!.filter(
          (category) => category.id !== categoryId,
        );
        setCategories(newCategories);
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      {lists?.map((list) => (
        <ListComponent
          key={list.id}
          handleAddTodoItem={() => handleAddTodoItem(list)}
          handleDeleteList={() => handleDeleteList(list.id)}
          {...list}
        >
          {list.groups.map((group) => (
            <GroupComponent
              key={group.id}
              handleDeleteGroup={() => handleDeleteGroup(list, group.id)}
              {...group}
            >
              {group.items.map((item) => (
                <TodoItemComponent
                  key={item.id}
                  handleDeleteTodoItem={() =>
                    handleDeleteTodoItem(list, group.id, item.id)
                  }
                  {...item}
                />
              ))}
            </GroupComponent>
          ))}
        </ListComponent>
      ))}
      <button onClick={handleCreateList}>Create List</button>
      <h2>Category List</h2>
      <ul>
        {categories?.map((category) => (
          <CategoryComponent
            key={category.id}
            handleDeleteCategory={() => handleDeleteCategory(category.id)}
            {...category}
          />
        ))}
      </ul>
      <button onClick={handleCreateCategory}>Create Category</button>
    </>
  );
}

export default App;
