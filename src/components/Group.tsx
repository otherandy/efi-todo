import { useLiveQuery } from "dexie-react-hooks";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { db } from "@/utils/db";
import type { Group } from "@/types";

import { TodoItemComponent } from "@/components/Item";

import classes from "@/styles/Group.module.css";

export function GroupComponent({ group }: { group: Group }) {
  const items = useLiveQuery(() =>
    db.todoItems.where({ groupId: group.id }).sortBy("order"),
  );

  const category = useLiveQuery(() => db.categories.get(group.categoryId));

  const { isOver, setNodeRef } = useDroppable({
    id: `G${group.id}`,
    data: { order: group.order },
  });

  const style: React.CSSProperties = {
    borderColor: category?.color,
    backgroundColor: isOver ? category?.color : undefined,
  };

  if (!items) {
    return null;
  }

  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div className={classes.group} style={style}>
        <div className={classes.category}>
          <div
            className={classes.icon}
            style={{ backgroundColor: category?.color }}
          >
            {category?.icon}
          </div>
          <div className={classes.name}>{category?.name}</div>
        </div>
        <div ref={setNodeRef} className={classes.items}>
          {items?.map((item) => (
            <TodoItemComponent key={item.id} item={item} />
          ))}
        </div>
      </div>
    </SortableContext>
  );
}
