import { useState } from "react";

import { db } from "@/utils/db";
import type { Category } from "@/types";

import classes from "@/styles/Category.module.css";

export function CategoryComponent({ category }: { category: Category }) {
  const [name, setName] = useState(category.name);

  const handleChangeName = () => {
    db.categories
      .update(category.name, { name })
      .catch((error) => console.error(error));
  };

  const handleDeleteCategory = () => {
    db.categories.delete(category.name).catch((error) => console.error(error));
  };

  return (
    <div
      className={classes.category}
      style={{
        borderColor: category.color,
      }}
    >
      <div>{category.icon}</div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleChangeName}
      />
      <button className={classes.deleteButton} onClick={handleDeleteCategory}>
        x
      </button>
    </div>
  );
}
