import { useLiveQuery } from "dexie-react-hooks";

import { db } from "@/utils/db";
import type { Category } from "@/types";

import classes from "@/styles/Category.module.css";
import AddCircleIcon from "@/assets/add_circle.svg?react";

export function CategoriesComponent() {
  const categories = useLiveQuery(() => db.categories.toArray());

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
        className={classes.create}
        title="Add Category"
        onClick={() => {
          db.categories
            .add({
              name: "New Category",
              color: "#d9d9d9",
              icon: "📁",
              hidden: false,
            })
            .catch((error) => console.error(error));
        }}
      >
        <AddCircleIcon />
      </button>
    </div>
  );
}

export function CategoryComponent({ category }: { category: Category }) {
  return (
    <div
      className={classes.category}
      style={{
        borderColor: category.color,
      }}
    >
      <div>{category.icon}</div>
      <input
        value={category.name}
        onChange={(e) => {
          db.categories
            .update(category.id, { name: e.target.value })
            .catch((error) => console.error(error));
        }}
      />
      <button
        className={classes.delete}
        onClick={() => {
          db.categories
            .delete(category.id)
            .catch((error) => console.error(error));
        }}
      >
        x
      </button>
    </div>
  );
}
