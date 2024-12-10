import { useEffect, useState } from "react";

import { ListComponent } from "@/components/List";
import { GroupComponent } from "@/components/Group";
import { TodoItemComponent } from "@/components/Item";
import { CategoryComponent } from "@/components/Category";

import {
  createList,
  createTodoItem,
  readLists,
  deleteList,
  createCategory,
  deleteCategory,
  deleteTodoItem,
  updateList,
  readCategories,
  updateCategory,
} from "@/utils/db";
import { Category, List } from "@/types";
import "@/styles/App.css";

function App() {
  const [lists, setLists] = useState<List[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    readLists()
      .then((data) => setLists(data))
      .catch((error) => console.error(error));

    readCategories()
      .then((data) => setCategories(data))
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

  const handleUpdateTodoItem = (
    list: List,
    groupId: string,
    itemId: string,
    text: string,
  ) => {
    const newList = {
      ...list,
      groups: list.groups.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          items: group.items.map((item) => {
            if (item.id !== itemId) return item;
            return { ...item, text };
          }),
        };
      }),
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

  const handleDeleteCategory = (categoryName: string) => {
    deleteCategory(categoryName)
      .then((deleted) => {
        if (!deleted) return;
        const newCategories = categories!.filter(
          (category) => category.name !== categoryName,
        );
        setCategories(newCategories);
      })
      .catch((error) => console.error(error));
  };

  const handleUpdateCategory = (category: Category) => {
    updateCategory(category)
      .then((data) => {
        if (!data) return;
        const newCategories = categories!.map((category) =>
          category.name === data.name ? data : category,
        );
        setCategories(newCategories);
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <div id="lists">
        {lists?.map((list) => (
          <ListComponent
            key={list.id}
            list={list}
            handleAddTodoItem={() => handleAddTodoItem(list)}
            handleDeleteList={() => handleDeleteList(list.id)}
          >
            {list.groups.map((group) => {
              const category = categories?.find(
                (category) => category.name === group.categoryName,
              );
              return (
                <GroupComponent
                  key={group.id}
                  category={category}
                  handleDeleteGroup={() => handleDeleteGroup(list, group.id)}
                >
                  {group.items.map((item) => (
                    <TodoItemComponent
                      key={item.id}
                      item={item}
                      handleUpdateTodoItem={(text) =>
                        handleUpdateTodoItem(list, group.id, item.id, text)
                      }
                      handleDeleteTodoItem={() =>
                        handleDeleteTodoItem(list, group.id, item.id)
                      }
                    />
                  ))}
                </GroupComponent>
              );
            })}
          </ListComponent>
        ))}
        <button onClick={handleCreateList} className="create-list-button">
          +
        </button>
      </div>
      <h2>Category List</h2>
      <div>
        {categories?.map((category) => (
          <CategoryComponent
            key={category.name}
            category={category}
            handleUpdateCategory={handleUpdateCategory}
            handleDeleteCategory={() => handleDeleteCategory(category.name)}
          />
        ))}
      </div>
      <button onClick={handleCreateCategory}>Create Category</button>
    </>
  );
}

export default App;
