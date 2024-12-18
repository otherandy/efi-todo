import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { db } from "@/utils/db";
import type { TodoItem } from "@/types";

import {
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuContentStyled,
  ContextMenuItem,
} from "@/components/ui/ContextMenu";

import classes from "@/styles/Item.module.css";

interface Props {
  item: TodoItem;
}

export function TodoItemComponent({ item }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `I${item.id}`,
      data: { order: item.order },
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteItem = () => {
    db.todoItems.delete(item.id).catch((error) => console.error(error));

    db.todoItems
      .where({ groupId: item.groupId })
      .count()
      .then(async (count) => {
        console.log(count);
        if (count === 0) {
          await db.groups.delete(item.groupId);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <ContextMenuRoot>
      <ContextMenuTrigger>
        <div
          ref={setNodeRef}
          className={classes.item}
          style={style}
          {...attributes}
          {...listeners}
        >
          <span className={classes.separator} />
          <div className={classes.text}>
            <input
              aria-label="Item Text"
              autoFocus
              value={item.text}
              onChange={(e) => {
                db.todoItems
                  .update(item.id, {
                    text: e.target.value,
                    updatedAt: new Date(),
                  })
                  .catch((error) => console.error(error));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  db.todoItems
                    .add({
                      text: "",
                      groupId: item.groupId,
                      checked: false,
                      starred: false,
                      status: { selectedIndex: 0, elements: [] },
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      order: item.order + 1,
                    })
                    .catch((error) => console.error(error));
                }
              }}
            />
          </div>
          <button
            aria-label="Delete Item"
            className={classes.delete}
            onClick={handleDeleteItem}
          >
            x
          </button>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContentStyled>
        <ContextMenuItem
          onSelect={() => {
            db.todoItems
              .update(item.id, { checked: !item.checked })
              .catch((error) => console.error(error));
          }}
        >
          {item.checked ? "Uncheck" : "Check"}
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleDeleteItem}>Delete</ContextMenuItem>
      </ContextMenuContentStyled>
    </ContextMenuRoot>
  );
}
