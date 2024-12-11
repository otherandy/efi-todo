import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";
import { GroupComponent } from "@/components/Group";
import type { List } from "@/types";

import * as ContextMenu from "@radix-ui/react-context-menu";

import classes from "@/styles/List.module.css";
import AddCircleIcon from "@/assets/add_circle.svg?react";

export function ListsComponent() {
  const lists = useLiveQuery(() => db.lists.toArray());

  return (
    <div className={classes.lists}>
      {lists?.map((list) => <ListComponent key={list.id} list={list} />)}
      <button
        title="Add List"
        className={classes.create}
        onClick={() => {
          db.lists
            .add({
              title: "New List",
              color: "#d9d9d9",
              hidden: false,
            })
            .catch((error) => console.error(error));
        }}
      >
        <AddCircleIcon />
      </button>
    </div>
  );
}

export function ListComponent({ list }: { list: List }) {
  const groups = useLiveQuery(() =>
    db.groups.where({ listId: list.id }).toArray(),
  );

  return (
    <div className={classes.list}>
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <div
            className={classes.title}
            style={{
              backgroundColor: list.color,
            }}
          >
            <h2>{list.title}</h2>
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content>
            <ContextMenu.Item
              onSelect={() => {
                db.todoItems
                  .where({ listId: list.id })
                  .delete()
                  .catch((error) => console.error(error));
                db.groups
                  .where({ listId: list.id })
                  .delete()
                  .catch((error) => console.error(error));
                db.lists.delete(list.id).catch((error) => console.error(error));
              }}
            >
              Delete
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <div className={classes.groups}>
        {groups?.map((group) => (
          <GroupComponent key={group.id} group={group} />
        ))}
        <button
          title="Add Group"
          className={classes.create}
          onClick={() => {
            db.groups
              .add({
                listId: list.id,
                categoryId: 1,
              })
              .then(async (group) => {
                await db.todoItems.add({
                  text: "New Item",
                  groupId: group,
                  completed: false,
                  starred: false,
                  status: { selectedIndex: 0, array: [] },
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
              })
              .catch((error) => console.error(error));
          }}
        >
          <AddCircleIcon />
        </button>
      </div>
    </div>
  );
}
