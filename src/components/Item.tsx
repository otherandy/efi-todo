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
import KeyboardArrowDownIcon from "@/assets/keyboard_arrow_down.svg?react";

export function TodoItemComponent({ item }: { item: TodoItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `I${item.id}`,
      data: { order: item.order },
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleChangeItemText = (e: React.ChangeEvent<HTMLInputElement>) => {
    db.todoItems
      .update(item.id, {
        text: e.target.value,
        updatedAt: new Date(),
      })
      .catch((error) => console.error(error));
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  };

  return (
    <ItemContextMenu item={item} handleDeleteItem={handleDeleteItem}>
      <div
        ref={setNodeRef}
        className={classes.item}
        style={style}
        {...attributes}
        {...listeners}
      >
        <div className={classes.content}>
          <span className={classes.separator} />
          <input
            aria-label="Item Text"
            autoFocus
            value={item.text}
            onChange={handleChangeItemText}
            onKeyDown={handleKeyDown}
          />
          <button
            aria-label="Delete Item"
            className={classes.deleteButton}
            onClick={handleDeleteItem}
          >
            x
          </button>
        </div>
        <ItemStatusMenu item={item} />
      </div>
    </ItemContextMenu>
  );
}

function ItemStatusMenu({ item }: { item: TodoItem }) {
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

  const handleDeleteStatusElement = (index: number) => {
    db.todoItems
      .update(item.id, {
        status: {
          ...item.status,
          elements: item.status.elements.filter((_, i) => i !== index),
        },
      })
      .catch((error) => console.error(error));

    if (index === item.status.selected) {
      handleUpdateStatus(0);
    }
  };

  const handleKeyDownNewStatus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (e.key === "Enter") {
      e.preventDefault();
      const newElement = e.currentTarget.value.trim();

      if (newElement !== "") {
        db.todoItems
          .update(item.id, {
            status: {
              ...item.status,
              elements: [...item.status.elements, newElement],
            },
          })
          .catch((error) => console.error(error));
      }
    }
  };

  const handleSideClick = (direction: "Left" | "Right") => {
    const dir = direction === "Left" ? -1 : 1;
    let newIndex = item.status.selected + dir;

    if (newIndex < 0) {
      newIndex = item.status.elements.length - 1;
    } else if (newIndex >= item.status.elements.length) {
      newIndex = 0;
    }

    handleUpdateStatus(newIndex);
  };

  return (
    <MenubarRoot
      className={classes.status}
      style={{ display: item.status.hidden ? "none" : "flex" }}
    >
      <button
        className={classes.sideButton}
        onClick={() => handleSideClick("Left")}
      >
        {"<"}
      </button>
      <MenubarMenu>
        <MenubarTrigger className={classes.element}>
          <KeyboardArrowDownIcon />
          <div>{item.status.elements[item.status.selected]}</div>
        </MenubarTrigger>
        <MenubarPortal>
          <MenubarContent className={classes.menu}>
            {item.status.elements.map((element, index) => (
              <div key={index}>
                <button onClick={() => handleDeleteStatusElement(index)}>
                  x
                </button>
                <MenubarItem
                  onSelect={() => {
                    handleUpdateStatus(index);
                  }}
                >
                  {element}
                </MenubarItem>
              </div>
            ))}
            <input
              placeholder="New Status Element"
              onKeyDown={handleKeyDownNewStatus}
            />
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
      <button
        className={classes.sideButton}
        onClick={() => handleSideClick("Right")}
      >
        {">"}
      </button>
    </MenubarRoot>
  );
}

function ItemContextMenu({
  item,
  children,
  handleDeleteItem,
}: {
  item: TodoItem;
  children: React.ReactNode;
  handleDeleteItem: () => void;
}) {
  const handleToggleCheck = () => {
    db.todoItems
      .update(item.id, { checked: !item.checked })
      .catch((error) => console.error(error));
  };

  const handleToggleStar = () => {
    db.todoItems
      .update(item.id, { starred: !item.starred })
      .catch((error) => console.error(error));
  };

  const handleToggleStatus = () => {
    db.todoItems
      .update(item.id, {
        status: {
          ...item.status,
          hidden: !item.status.hidden,
        },
      })
      .catch((error) => console.error(error));
  };

  return (
    <ContextMenuRoot>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContentStyled>
        <ContextMenuItem onSelect={handleToggleCheck}>
          {item.checked ? "Uncheck" : "Check"}
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleToggleStar}>
          {item.starred ? "Unstar" : "Star"}
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleToggleStatus}>
          {item.status.hidden ? "Show" : "Hide"} Status
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleDeleteItem}>Delete</ContextMenuItem>
      </ContextMenuContentStyled>
    </ContextMenuRoot>
  );
}
