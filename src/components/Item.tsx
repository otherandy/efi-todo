import { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { db } from "@/utils/db";
import type { Category, TodoItem } from "@/types";

import { ItemEmoji } from "@/components/Emoji";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/ContextMenu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu";

import classes from "@/styles/Item.module.css";

import KeyboardArrowDownIcon from "@/assets/keyboard_arrow_down.svg?react";
import StarIcon from "@/assets/star.svg?react";
import CircleIcon from "@/assets/circle.svg?react";
import CheckCircleIcon from "@/assets/check_circle.svg?react";

export function FullTodoItemComponent({ item }: { item: TodoItem }) {
  return (
    <div className={classes.container}>
      <label className={classes.star}>
        <input
          type="checkbox"
          checked={item.starred}
          onChange={() => {
            db.todoItems
              .update(item.id, { starred: !item.starred })
              .catch((error) => console.error(error));
          }}
        />
        <StarIcon />
      </label>
      <TodoItemComponent item={item} />
      <label className={classes.check}>
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => {
            db.todoItems
              .update(item.id, { checked: !item.checked })
              .catch((error) => console.error(error));
          }}
        />
        {item.checked ? <CheckCircleIcon /> : <CircleIcon />}
      </label>
    </div>
  );
}

function TodoItemComponent({ item }: { item: TodoItem }) {
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
      id: `Item-${item.id}`,
      data: { type: "item", listId: item.listId },
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
  };

  const handleLoseFocus = () => {
    if (item.text.trim() === "") {
      handleDeleteItem();
    }
  };

  // const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   db.todoItems
  //     .update(item.id, {
  //       categoryName: e.target.value,
  //       updatedAt: new Date(),
  //     })
  //     .catch((error) => console.error(error));
  // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      db.todoItems
        .add({
          text: "",
          listId: item.listId,
          order: item.order + 1,
          checked: false,
          starred: false,
          categoryName: item.categoryName,
          emoji: "",
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
          <span
            className={classes.cornerDecoration}
            style={
              {
                "--cat-color": category?.color,
              } as React.CSSProperties
            }
          />
          {/* <input
            aria-label="Category"
            className={classes.category}
            value={item.categoryName ?? ""}
            onChange={handleCategoryChange}
          /> */}
          <ItemEmoji itemId={item.id} emoji={item.emoji} />
          {/* <span className={classes.separator} /> */}
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

export function DummyTodoItemComponent({ item }: { item: TodoItem }) {
  const [category, setCategory] = useState<Category>();

  useEffect(() => {
    db.categories
      .get(item.categoryName)
      .then((category) => {
        setCategory(category);
      })
      .catch((error) => console.error(error));
  }, [item.categoryName]);

  return (
    <div className={classes.item}>
      <div className={classes.content}>
        <span
          className={classes.cornerDecoration}
          style={
            {
              "--cat-color": category?.color,
            } as React.CSSProperties
          }
        />
        <ItemEmoji itemId={item.id} emoji={item.emoji} />
        {/* <span className={classes.separator} /> */}
        <input aria-label="Item Text" autoFocus value={item.text} readOnly />
        <button aria-label="Delete Item" className={classes.deleteButton}>
          x
        </button>
      </div>
      <ItemStatusMenu item={item} />
    </div>
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
      <DropdownMenu>
        <DropdownMenuTrigger className={classes.element}>
          <KeyboardArrowDownIcon />
          <div>{item.status.elements[item.status.selected]}</div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
          <input placeholder="" onKeyDown={handleKeyDownNewStatus} />
        </DropdownMenuContent>
      </DropdownMenu>
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
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
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
      </ContextMenuContent>
    </ContextMenu>
  );
}
