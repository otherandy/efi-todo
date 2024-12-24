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
import {
  MenubarMenu,
  MenubarRoot,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarPortal,
} from "@/components/ui/Menubar";

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

  const handleUpdateStatus = (newIndex: number) => {
    db.todoItems
      .update(item.id, {
        status: {
          ...item.status,
          selected: newIndex,
        },
      })
      .catch((error) => console.error(error));
  };

  return (
    <ContextMenuRoot>
      <ContextMenuTrigger asChild>
        <div
          ref={setNodeRef}
          className={classes.item}
          style={style}
          {...attributes}
          {...listeners}
        >
          <div className={classes.content}>
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
                        status: {
                          selected: 0,
                          elements: ["Storyboard", "Layout", "Sketch"],
                          hidden: true,
                        },
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
          <div
            className={classes.status}
            style={{ display: item.status.hidden ? "none" : "block" }}
          >
            <MenubarRoot>
              <MenubarMenu>
                <MenubarTrigger
                  onClick={() => {
                    let newIndex = item.status.selected - 1;

                    if (newIndex < 0) {
                      newIndex = item.status.elements.length - 1;
                    }

                    handleUpdateStatus(newIndex);
                  }}
                >
                  {"<"}
                </MenubarTrigger>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>
                  {item.status.elements[item.status.selected]}
                </MenubarTrigger>
                <MenubarPortal>
                  <MenubarContent>
                    {item.status.elements.map((element, index) => (
                      <MenubarItem
                        key={index}
                        onSelect={() => {
                          handleUpdateStatus(index);
                        }}
                      >
                        {element}
                      </MenubarItem>
                    ))}
                    <MenubarItem>
                      <input
                        aria-label="New Status Element"
                        placeholder="New Status Element"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();

                            const newElement = e.currentTarget.value;

                            if (newElement.trim() !== "") {
                              db.todoItems
                                .update(item.id, {
                                  status: {
                                    ...item.status,
                                    elements: [
                                      ...item.status.elements,
                                      newElement,
                                    ],
                                  },
                                })
                                .catch((error) => console.error(error));
                            }
                          }
                        }}
                      />
                    </MenubarItem>
                  </MenubarContent>
                </MenubarPortal>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger
                  onClick={() => {
                    let newIndex = item.status.selected + 1;

                    if (newIndex >= item.status.elements.length) {
                      newIndex = 0;
                    }

                    handleUpdateStatus(newIndex);
                  }}
                >
                  {">"}
                </MenubarTrigger>
              </MenubarMenu>
            </MenubarRoot>
          </div>
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
        <ContextMenuItem
          onSelect={() => {
            db.todoItems
              .update(item.id, { starred: !item.starred })
              .catch((error) => console.error(error));
          }}
        >
          {item.starred ? "Unstar" : "Star"}
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={() => {
            db.todoItems
              .update(item.id, {
                status: {
                  ...item.status,
                  hidden: !item.status.hidden,
                },
              })
              .catch((error) => console.error(error));
          }}
        >
          {item.status.hidden ? "Show" : "Hide"} Status
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleDeleteItem}>Delete</ContextMenuItem>
      </ContextMenuContentStyled>
    </ContextMenuRoot>
  );
}
