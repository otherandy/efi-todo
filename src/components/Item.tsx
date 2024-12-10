import { TodoItem } from "@/types";
import classes from "@/styles/Item.module.css";

interface TodoItemProps {
  item: TodoItem;
  handleUpdateTodoItem: (text: string) => void;
  handleDeleteTodoItem: () => void;
}

export function TodoItemComponent({
  item,
  handleUpdateTodoItem,
  handleDeleteTodoItem,
}: TodoItemProps) {
  return (
    <div className={classes.content}>
      <input
        className={classes.text}
        value={item.text}
        onChange={(e) => handleUpdateTodoItem(e.target.value)}
      />
      <button onClick={handleDeleteTodoItem} className={classes.delete}>
        x
      </button>
    </div>
  );
}
