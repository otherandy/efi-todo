import { Category } from "@/types";
import classes from "@/styles/Category.module.css";

type CategoryProps = Category & {
  handleDeleteCategory: () => void;
};

export function CategoryComponent({
  color,
  icon,
  name,
  handleDeleteCategory,
}: CategoryProps) {
  return (
    <div
      className={classes.container}
      style={{
        borderColor: color,
      }}
    >
      <div>{icon}</div>
      <div>{name}</div>
      <button onClick={handleDeleteCategory} className={classes.delete}>
        x
      </button>
    </div>
  );
}
