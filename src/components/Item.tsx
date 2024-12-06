import { TodoItem } from "@/types";
import classes from "@/styles/Item.module.css";

type TodoItemProps = TodoItem & {
  handleDeleteTodoItem: () => void;
};

export function TodoItemComponent({
  text,
  handleDeleteTodoItem,
}: TodoItemProps) {
  return (
    <div className={classes.content}>
      <div className={classes.text}>{text}</div>
      <button onClick={handleDeleteTodoItem} className={classes.delete}>
        x
      </button>
    </div>
  );
}
