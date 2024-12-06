import { TodoItem } from "@/types";

type TodoItemProps = TodoItem & {
  handleDeleteTodoItem: () => void;
};

export function TodoItemComponent({
  text,
  handleDeleteTodoItem,
}: TodoItemProps) {
  return (
    <li>
      <div>{text}</div>
      <button onClick={handleDeleteTodoItem}>Delete</button>
    </li>
  );
}
