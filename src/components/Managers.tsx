import { useLiveQuery } from "dexie-react-hooks";
import { db, deleteList } from "@/utils/db";

import { CategoryComponent } from "@/components/Category";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/ContextMenu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";

import classes from "@/styles/Managers.module.css";

import AddCircleIcon from "@/assets/add_circle.svg?react";

export function HiddenListManager() {
  const lists = useLiveQuery(() =>
    db.lists.where("hidden").equals(1).toArray(),
  );

  const handleSetUnhidden = (listId: number) => {
    db.lists
      .update(listId, {
        hidden: 0,
      })
      .catch((error) => console.error(error));
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="hidden-lists">
        <div className={classes.container}>
          <AccordionTrigger>Lists</AccordionTrigger>
          <AddListButton />
        </div>
        <AccordionContent className={classes.lists}>
          {lists?.map((list) => (
            <button key={list.id} onClick={() => handleSetUnhidden(list.id)}>
              {list.title}
            </button>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function ListManager() {
  const lists = useLiveQuery(() => db.lists.toArray());

  const handleToggleHidden = (listId: number) => {
    db.lists
      .update(listId, {
        hidden: lists?.find((list) => list.id === listId)?.hidden === 0 ? 1 : 0,
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <div className={classes.header}>Lists</div>
      <div className={classes.lists}>
        {lists?.map((list) => (
          <ContextMenu key={list.id}>
            <ContextMenuTrigger>
              <div className={classes.container}>
                <input
                  type="checkbox"
                  checked={!list.hidden}
                  onChange={() => handleToggleHidden(list.id)}
                />
                <span className={classes.title}>{list.title}</span>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() => {
                  deleteList(list.id);
                }}
              >
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
        <AddListButton />
      </div>
    </div>
  );
}

export function AddListButton() {
  const handleAddList = () => {
    db.lists
      .add({
        title: "New List",
        color: "#d9d9d9",
        hidden: 0,
      })
      .catch((error) => console.error(error));
  };

  return (
    <button
      className={classes.createButton}
      title="Add Category"
      onClick={handleAddList}
    >
      <AddCircleIcon />
    </button>
  );
}

export function CategoryManager() {
  const categories = useLiveQuery(() => db.categories.toArray());

  const handleAddCategory = () => {
    const length = categories?.length ?? 0;

    db.categories
      .add({
        name: "Category" + length,
        color: "#d9d9d9",
        icon: "📁",
        hidden: false,
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <div className={classes.header}>Categories</div>
      <div className={classes.categories}>
        {categories?.map((category) => {
          if (category.hidden) return null;
          return <CategoryComponent key={category.name} category={category} />;
        })}
        <button
          className={classes.createButton}
          title="Add Category"
          onClick={handleAddCategory}
        >
          <AddCircleIcon />
        </button>
      </div>
    </div>
  );
}
