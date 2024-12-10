import { Category } from "@/types";
import classes from "@/styles/Category.module.css";

interface CategoryProps {
  category: Category;
  handleUpdateCategory: (category: Category) => void;
  handleDeleteCategory: () => void;
}

export function CategoryComponent({
  category,
  handleUpdateCategory,
  handleDeleteCategory,
}: CategoryProps) {
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
        onChange={(e) =>
          handleUpdateCategory({ ...category, name: e.target.value })
        }
      />
      <button onClick={handleDeleteCategory} className={classes.delete}>
        x
      </button>
    </div>
  );
}
