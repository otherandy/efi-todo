import { useCallback, useEffect, useRef, useState } from "react";

import { db } from "@/utils/db";
import type { Category } from "@/types";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/ContextMenu";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/Dialog";

import classes from "@/styles/Category.module.css";

export function CategoryComponent({ category }: { category: Category }) {
  const [name, setName] = useState(category.name);

  const categoryRef = useRef<HTMLDivElement>(null);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

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

  const updatePickerPos = useCallback(() => {
    if (categoryRef.current) {
      const rect = categoryRef.current.getBoundingClientRect();
      setPickerPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, []);

  useEffect(() => {
    if (!displayColorPicker) return;

    updatePickerPos();
    window.addEventListener("scroll", updatePickerPos, true);
    window.addEventListener("resize", updatePickerPos);

    return () => {
      window.removeEventListener("scroll", updatePickerPos, true);
      window.removeEventListener("resize", updatePickerPos);
    };
  }, [displayColorPicker, updatePickerPos]);

  return (
    <Dialog>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            ref={categoryRef}
            className={classes.category}
            style={{
              borderColor: category.color,
            }}
          >
            <div>{category.icon}</div>
            <input
              className={classes.categoryName}
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
          {displayColorPicker && pickerPos && (
            <ColorPicker
              color={category.color}
              pickerPos={pickerPos}
              setDisplayColorPicker={setDisplayColorPicker}
              handleChangeColor={handleChangeColor}
            />
          )}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => {
              setDisplayColorPicker(true);
            }}
          >
            Color
          </ContextMenuItem>
          <DialogTrigger asChild>
            <ContextMenuItem>Icon</ContextMenuItem>
          </DialogTrigger>
        </ContextMenuContent>
      </ContextMenu>
      <DialogContent>
        <div>Test</div>
      </DialogContent>
    </Dialog>
  );
}
