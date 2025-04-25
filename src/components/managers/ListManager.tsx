import { useLiveQuery } from "dexie-react-hooks";
import { db, deleteList, addList } from "@/utils/db";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/ContextMenu";

import classes from "@/styles/managers/ListManager.module.css";

import AddCircleIcon from "@/assets/add_circle.svg?react";

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
  return (
    <button
      className={classes.createButton}
      title="Add Category"
      onClick={addList}
    >
      <AddCircleIcon />
    </button>
  );
}
