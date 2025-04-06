import { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { db } from "@/utils/db";
import type { Category, TodoItem } from "@/types";

import {
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuContentStyled,
  ContextMenuItem,
} from "@/components/ui/ContextMenu";
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from "@/components/ui/DropdownMenu";

import classes from "@/styles/Item.module.css";
import classesM from "@/styles/Menubar.module.css";
import KeyboardArrowDownIcon from "@/assets/keyboard_arrow_down.svg?react";

export function TodoItemComponent({ item }: { item: TodoItem }) {
  const [category, setCategory] = useState<Category>();

  useEffect(() => {
    db.categories
      .get(item.categoryName)
      .then((category) => {
        setCategory(category);
      })
      .catch((error) => console.error(error));
  }, [item.categoryName]);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    db.todoItems
      .update(item.id, {
        categoryName: e.target.value,
        updatedAt: new Date(),
      })
      .catch((error) => console.error(error));
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
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      db.todoItems
        .add({
          text: "",
          listId: item.listId,
          order: item.order + 1,
          categoryName: item.categoryName,
          checked: false,
          starred: false,
          status: {
            selected: 0,
            elements: [],
            hidden: true,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .catch((error) => console.error(error));
    }
  };

  const handleLoseFocus = () => {
    if (item.text.trim() === "") {
      handleDeleteItem();
    }
  };

  return (
    <ItemContextMenu item={item} handleDeleteItem={handleDeleteItem}>
      <div
        ref={setNodeRef}
        className={classes.item}
        data-category={item.categoryName}
        style={style}
        {...attributes}
        {...listeners}
      >
        <div className={classes.content}>
          <span
            className={classes.decoration}
            style={
              {
                "--cat-color": category?.color,
              } as React.CSSProperties
            }
          />
          <input
            aria-label="Category"
            className={classes.category}
            value={item.categoryName ?? ""}
            onChange={handleCategoryChange}
          />
          <span className={classes.separator} />
          <input
            aria-label="Item Text"
            autoFocus
            value={item.text}
            onChange={handleChangeItemText}
            onKeyDown={handleKeyDown}
            onBlur={handleLoseFocus}
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
    <div
      className={classes.status}
      style={{ display: item.status.hidden ? "none" : "flex" }}
    >
      <button
        className={classes.sideButton}
        onClick={() => handleSideClick("Left")}
      >
        {"<"}
      </button>
      <DropdownMenuRoot>
        <DropdownMenuTrigger className={classes.element}>
          <KeyboardArrowDownIcon />
          <div>{item.status.elements[item.status.selected]}</div>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className={classesM.menu}>
            {item.status.elements.map((element, index) => (
              <div key={index}>
                <button onClick={() => handleDeleteStatusElement(index)}>
                  x
                </button>
                <DropdownMenuItem
                  onSelect={() => {
                    handleUpdateStatus(index);
                  }}
                >
                  {element}
                </DropdownMenuItem>
              </div>
            ))}
            <input
              placeholder="New Status Element"
              onKeyDown={handleKeyDownNewStatus}
            />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
      <button
        className={classes.sideButton}
        onClick={() => handleSideClick("Right")}
      >
        {">"}
      </button>
    </div>
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
