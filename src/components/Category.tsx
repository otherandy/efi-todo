import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";
import type { Category } from "@/types";

import classes from "@/styles/Category.module.css";

export function CategoriesComponent() {
  const categories = useLiveQuery(() => db.categories.toArray());

  return (
    <>
      <h1>Categories</h1>
      <div id="categories">
        {categories?.map((category) => {
          if (category.hidden) return null;
          return <CategoryComponent key={category.id} category={category} />;
        })}
      </div>
      <button
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
        Add Category
      </button>
    </>
  );
}

export function CategoryComponent({ category }: { category: Category }) {
  return (
    <div
      className={classes.container}
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
