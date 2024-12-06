import { List } from "@/types";

type ListProps = List & {
  children: React.ReactNode;
  handleAddTodoItem: () => void;
  handleDeleteList: () => void;
};

export function ListComponent({
  title,
  children,
  handleAddTodoItem,
  handleDeleteList,
}: ListProps) {
  return (
    <>
      <h2>{title}</h2>
      <ul>{children}</ul>
      <button onClick={handleAddTodoItem}>Add Item</button>
      <button onClick={handleDeleteList}>Delete List</button>
    </>
  );
}
