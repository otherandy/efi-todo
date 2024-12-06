import { List } from "@/types";
import classes from "@/styles/List.module.css";

type ListProps = List & {
  children: React.ReactNode;
  handleAddTodoItem: () => void;
  handleDeleteList: () => void;
};

export function ListComponent({
  title,
  color,
  children,
  handleAddTodoItem,
  handleDeleteList,
}: ListProps) {
  return (
    <div className={classes.container}>
      <div
        className={classes.title}
        style={{
          backgroundColor: color,
        }}
      >
        <h2>{title}</h2>
        <div className={classes.menu}>
          <button></button>
          <div>
            <button onClick={handleDeleteList}>Delete List</button>
          </div>
        </div>
      </div>
      <div className={classes.items}>
        {children}
        <button onClick={handleAddTodoItem} className={classes.create}>
          +
        </button>
      </div>
    </div>
  );
}
