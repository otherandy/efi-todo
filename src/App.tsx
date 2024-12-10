import { ListComponent } from "@/components/List";
import { GroupComponent } from "@/components/Group";
import { TodoItemComponent } from "@/components/Item";
import { CategoryComponent } from "@/components/Category";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";

import type { Category, TodoItem } from "@/types";
import "@/styles/App.css";

function App() {
  const lists = useLiveQuery(() => db.lists.toArray());
  const categories = useLiveQuery(() => db.categories.toArray());
  const groups = useLiveQuery(() => db.groups.toArray());
  const todoItems = useLiveQuery(() => db.todoItems.toArray());

  const handleCreateList = () => {
    db.lists
      .add({
        title: "New List",
        color: "d9d9d9",
        hidden: false,
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteList = (listId: string) => {
    db.lists.delete(listId).catch((error) => console.error(error));
  };

  const handleAddTodoItem = (
    listId: string,
    groupId?: string,
    categoryId?: string,
  ) => {
    let group = groups?.find((group) => group.id === groupId);

    if (!group) {
      db.groups
        .add({
          listId,
          categoryId: categoryId ?? "",
        })
        .then((id) => db.groups.get(id))
        .then((newGroup) => {
          group = newGroup;
        })
        .catch((error) => console.error(error));
    }

    if (!group) return;

    const newItem: Omit<TodoItem, "id"> = {
      groupId: group.id,
      text: "New Item",
      completed: false,
      starred: false,
      status: { selectedIndex: 0, array: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.todoItems.add(newItem).catch((error) => console.error(error));
  };

  const handleDeleteTodoItem = (item: TodoItem) => {
    db.todoItems.delete(item.id).catch((error) => console.error(error));

    const group = groups?.find((group) => group.id === item.groupId);

    if (!group) return;

    const items = todoItems?.filter(
      (todoItem) => todoItem.groupId === group?.id,
    );

    if (items?.length === 0) {
      db.groups.delete(group.id).catch((error) => console.error(error));
    }
  };

  const handleUpdateTodoItem = (item: TodoItem) => {
    db.lists.update(item.id, item).catch((error) => console.error(error));
  };

  const handleDeleteGroup = (groupId: string) => {
    db.groups.delete(groupId).catch((error) => console.error(error));

    const items = todoItems?.filter((todoItem) => todoItem.groupId === groupId);

    if (!items) return;

    const itemIds = items.map((item) => item.id);
    db.todoItems.bulkDelete(itemIds).catch((error) => console.error(error));
  };

  const handleCreateCategory = () => {
    db.categories
      .add({
        name: "New Category",
        color: "d9d9d9",
        icon: "📁",
        hidden: false,
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteCategory = (categoryId: string) => {
    db.categories.delete(categoryId).catch((error) => console.error(error));
  };

  const handleUpdateCategory = (category: Category) => {
    db.categories
      .update(category.id, category)
      .catch((error) => console.error(error));
  };

  return (
    <>
      <div id="lists">
        {lists?.map((list) => (
          <ListComponent
            key={list.id}
            list={list}
            handleAddTodoItem={() =>
              handleAddTodoItem(list.id, undefined, undefined)
            }
            handleDeleteList={() => handleDeleteList(list.id)}
          >
            {groups
              ?.filter((group) => group.listId === list.id)
              .map((group) => (
                <GroupComponent
                  key={group.id}
                  category={categories?.find(
                    (category) => category.id === group.categoryId,
                  )}
                  handleDeleteGroup={() => handleDeleteGroup(group.id)}
                >
                  {todoItems
                    ?.filter((item) => item.groupId === group.id)
                    .map((item) => (
                      <TodoItemComponent
                        key={item.id}
                        item={item}
                        handleDeleteTodoItem={() => handleDeleteTodoItem(item)}
                        handleUpdateTodoItem={handleUpdateTodoItem}
                      />
                    ))}
                </GroupComponent>
              ))}
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
