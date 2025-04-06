import { useState } from "react";

import { db } from "@/utils/db";
import type { Category } from "@/types";

import classes from "@/styles/Category.module.css";
import {
  ContextMenuContentStyled,
  ContextMenuRoot,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/ContextMenu";
import { ColorPicker } from "@/components/ui/ColorPicker";

export function CategoryComponent({ category }: { category: Category }) {
  const [name, setName] = useState(category.name);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleChangeName = () => {
    db.categories
      .update(category.name, { name })
      .catch((error) => console.error(error));
  };

  const handleChangeColor = (color: string) => {
    db.categories
      .update(category.name, { color })
      .catch((error) => console.error(error));
  };

  const handleDeleteCategory = () => {
    db.categories.delete(category.name).catch((error) => console.error(error));
  };

  return (
    <ContextMenuRoot>
      <ContextMenuTrigger>
        <div
          className={classes.category}
          style={{
            borderColor: category.color,
          }}
        >
          <div>{category.icon}</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleChangeName}
          />
          <button
            className={classes.deleteButton}
            onClick={handleDeleteCategory}
          >
            x
          </button>
        </div>
        {displayColorPicker && (
          <ColorPicker
            color={category.color}
            onChange={(color) => {
              handleChangeColor(color);
              setDisplayColorPicker(false);
            }}
          />
        )}
      </ContextMenuTrigger>
      <ContextMenuContentStyled>
        <ContextMenuItem
          onClick={() => {
            setDisplayColorPicker(true);
          }}
        >
          Color
        </ContextMenuItem>
      </ContextMenuContentStyled>
    </ContextMenuRoot>
  );
}
