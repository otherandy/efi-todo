import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";
import { GroupComponent } from "@/components/Group";
import type { List } from "@/types";

import classes from "@/styles/List.module.css";

export function ListsComponent() {
  const lists = useLiveQuery(() => db.lists.toArray());

  return (
    <div id="lists">
      {lists?.map((list) => <ListComponent key={list.id} list={list} />)}
    </div>
  );
}

export function ListComponent({ list }: { list: List }) {
  const groups = useLiveQuery(() =>
    db.groups.where({ listId: list.id }).toArray(),
  );

  return (
    <div className={classes.container}>
      <div
        className={classes.title}
        style={{
          backgroundColor: list.color,
        }}
      >
        <h2>{list.title}</h2>
        <div className={classes.menu}>
          <div>
            <button
              onClick={() => {
                db.lists.delete(list.id).catch((error) => console.error(error));
              }}
            >
              Delete List
            </button>
          </div>
        </div>
      </div>
      <div className={classes.items}>
        {groups?.map((group) => (
          <GroupComponent key={group.id} group={group} />
        ))}
      </div>
      <button
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
        +
      </button>
    </div>
  );
}
