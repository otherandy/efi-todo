import { db } from "@/utils/db";
import type { Category } from "@/types";

import classes from "@/styles/Category.module.css";

export function CategoryComponent({ category }: { category: Category }) {
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    db.categories
      .update(category.id, { name: e.target.value })
      .catch((error) => console.error(error));
  };

  const handleDeleteCategory = () => {
    db.categories.delete(category.id).catch((error) => console.error(error));
  };

  return (
    <div
      className={classes.category}
      style={{
        borderColor: category.color,
      }}
    >
      <div>{category.icon}</div>
      <input value={category.name} onChange={handleChangeName} />
      <button className={classes.deleteButton} onClick={handleDeleteCategory}>
        x
      </button>
    </div>
  );
}
