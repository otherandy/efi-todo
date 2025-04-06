import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, deleteList } from "@/utils/db";

import { ScrollArea } from "@radix-ui/react-scroll-area";

import { DateView } from "@/components/DateView";
import { CategoryComponent } from "@/components/Category";

import {
  ContextMenuContentStyled,
  ContextMenuRoot,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/ContextMenu";

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

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState) {
      setIsCollapsed(savedState === "true");
    }
  }, []);

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
    localStorage.setItem("sidebar-collapsed", (!isCollapsed).toString());
  };

  return (
    <>
      <Sidebar isCollapsed={isCollapsed} />
      <SidebarToggleButton onClick={handleToggleSidebar} />
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
          <ContextMenuRoot key={list.id}>
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
            <ContextMenuContentStyled>
              <ContextMenuItem
                onClick={() => {
                  deleteList(list.id);
                }}
              >
                Delete
              </ContextMenuItem>
            </ContextMenuContentStyled>
          </ContextMenuRoot>
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
