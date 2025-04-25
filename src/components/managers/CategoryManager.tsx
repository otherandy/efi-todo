import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";

import { CategoryComponent } from "@/components/Category";

import classes from "@/styles/managers/CategoryManager.module.css";

import AddCircleIcon from "@/assets/add_circle.svg?react";

export function CategoryManager() {
  const categories = useLiveQuery(() => db.categories.toArray());

  const handleAddCategory = () => {
    const length = categories?.length ?? 0;

    db.categories
      .add({
        name: "Category" + length,
        color: "#d9d9d9",
        icon: "📁",
        hidden: false,
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <div className={classes.header}>Categories</div>
      <div className={classes.categories}>
        {categories?.map((category) => {
          if (category.hidden) return null;
          return <CategoryComponent key={category.name} category={category} />;
        })}
        <button
          className={classes.createButton}
          title="Add Category"
          onClick={handleAddCategory}
        >
          <AddCircleIcon />
        </button>
      </div>
    </div>
  );
}
