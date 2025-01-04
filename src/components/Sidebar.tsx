import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";

import { ScrollArea } from "@radix-ui/react-scroll-area";

import { DateView } from "@/components/DateView";
import { CategoryComponent } from "@/components/Category";

import classes from "@/styles/Sidebar.module.css";
import AddCircleIcon from "@/assets/add_circle.svg?react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
}

export function Sidebar({ isCollapsed, ...props }: SidebarProps) {
  return (
    <div className={classes.sidebar} {...props}>
      <div className={classes.header}>
        <DateView />
      </div>
      <ScrollArea className={classes.scrollArea} data-collapsed={isCollapsed}>
        <ListSidebarComponent />
        <CategorySidebarComponent />
      </ScrollArea>
    </div>
  );
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <Sidebar isCollapsed={isCollapsed} />
      <SidebarToggleButton onClick={() => setIsCollapsed(!isCollapsed)} />
      {children}
    </>
  );
}

export function SidebarToggleButton({
  onClick,
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <div className={classes.toggleButton}>
      <button onClick={onClick}>+</button>
    </div>
  );
}

function ListSidebarComponent() {
  const lists = useLiveQuery(() => db.lists.toArray());

  const handleToggleHidden = (listId: number) => {
    db.lists
      .update(listId, {
        hidden: !lists?.find((list) => list.id === listId)?.hidden,
      })
      .catch((error) => console.error(error));
  };

  const handleAddList = () => {
    db.lists
      .add({
        title: "New List",
        color: "#d9d9d9",
        hidden: false,
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <div className={classes.title}>Lists</div>
      <div className={classes.lists}>
        {lists?.map((list) => (
          <div key={list.id}>
            <input
              type="checkbox"
              checked={!list.hidden}
              onChange={() => handleToggleHidden(list.id)}
            />
            <span>{list.title}</span>
          </div>
        ))}
        <button
          className={classes.createButton}
          title="Add Category"
          onClick={handleAddList}
        >
          <AddCircleIcon />
        </button>
      </div>
    </div>
  );
}

function CategorySidebarComponent() {
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
      <div className={classes.title}>Categories</div>
      <div className={classes.categories}>
        {categories?.map((category) => {
          if (category.hidden) return null;
          return <CategoryComponent key={category.id} category={category} />;
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
