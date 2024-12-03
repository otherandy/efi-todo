import { Category } from "../types";

type CategoryProps = Category & {
  handleDeleteCategory: () => void;
};

export function CategoryComponent({
  name,
  handleDeleteCategory,
}: CategoryProps) {
  return (
    <li>
      <div>{name}</div>
      <button onClick={handleDeleteCategory}>Delete</button>
    </li>
  );
}
