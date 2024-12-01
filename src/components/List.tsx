import { List } from "../types";

type ListProps = List & {
  children: React.ReactNode;
  handleAddItem: () => void;
};

export function ListComponent({ title, children, handleAddItem }: ListProps) {
  return (
    <>
      <h2>{title}</h2>
      <ul>{children}</ul>
      <button onClick={handleAddItem}>Add Item</button>
    </>
  );
}
