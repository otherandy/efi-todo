import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";
import { TodoItemComponent } from "@/components/Item";
import type { Group } from "@/types";

import classes from "@/styles/Group.module.css";

export function GroupComponent({ group }: { group: Group }) {
  const items = useLiveQuery(() =>
    db.todoItems.where({ groupId: group.id }).toArray(),
  );

  const category = useLiveQuery(() => db.categories.get(group.categoryId));

  return (
    <div
      className={classes.group}
      style={{
        borderColor: category?.color,
      }}
    >
      <div className={classes.category}>
        <div className={classes.icon}>{category?.icon}</div>
        <input className={classes.name} value={category?.name} />
      </div>
      <div className={classes.items}>
        {items?.map((item) => <TodoItemComponent key={item.id} item={item} />)}
      </div>
      {/* <button
        title="Add Item to Group"
        className={classes.create}
        onClick={() => {
          db.todoItems
            .add({
              text: "New Item",
              groupId: group.id,
              completed: false,
              starred: false,
              status: { selectedIndex: 0, array: [] },
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .catch((error) => console.error(error));
        }}
      >
        +
      </button> */}
    </div>
  );
}
