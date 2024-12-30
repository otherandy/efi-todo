import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";

import { CategoryComponent } from "@/components/Category";

import classes from "@/styles/Sidebar.module.css";
import AddCircleIcon from "@/assets/add_circle.svg?react";

export function Sidebar() {
  return (
    <div className={classes.sidebar}>
      <ListSidebarComponent />
      <CategorySidebarComponent />
    </div>
  );
}

function ListSidebarComponent() {
  const lists = useLiveQuery(() => db.lists.toArray());

  const handleToggleHidden = (listId: number) => {
    db.lists
      .update(listId, {
        hidden: !lists?.find((list) => list.id === listId)?.hidden,
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className={classes.lists}>
      <h2 className={classes.header}>Lists</h2>
      <div>
        {lists?.map((list) => (
          <div key={list.id} className={classes.item}>
            <input
              type="checkbox"
              checked={!list.hidden}
              onChange={() => handleToggleHidden(list.id)}
            />
            <span>{list.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategorySidebarComponent() {
  const categories = useLiveQuery(() => db.categories.toArray());

  const handleAddCategory = () => {
    db.categories
      .add({
        name: "New Category",
        color: "#d9d9d9",
        icon: "📁",
        hidden: false,
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className={classes.categories}>
      <h2 className={classes.header}>Categories</h2>
      <div>
        {categories?.map((category) => {
          if (category.hidden) return null;
          return <CategoryComponent key={category.id} category={category} />;
        })}
      </div>
      <button
        className={classes.createButton}
        title="Add Category"
        onClick={handleAddCategory}
      >
        <AddCircleIcon />
      </button>
    </div>
  );
}
