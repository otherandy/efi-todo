import { db } from "@/utils/db";
import type { TodoItem } from "@/types";

import classes from "@/styles/Item.module.css";

export function TodoItemComponent({ item }: { item: TodoItem }) {
  return (
    <div className={classes.content}>
      <input
        className={classes.text}
        value={item.text}
        onChange={(e) => {
          db.todoItems
            .update(item.id, { text: e.target.value })
            .catch((error) => console.error(error));
        }}
      />
      <button
        className={classes.delete}
        onClick={() => {
          db.todoItems.delete(item.id).catch((error) => console.error(error));
        }}
      >
        x
      </button>
    </div>
  );
}
