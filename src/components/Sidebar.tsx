import { useEffect, useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import { ListManager } from "@/components/managers/ListManager";
import { CategoryManager } from "@/components/managers/CategoryManager";

import classes from "@/styles/Sidebar.module.css";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
}

function Sidebar({ isCollapsed, ...props }: SidebarProps) {
  return (
    <div className={classes.sidebar} {...props}>
      <div className={classes.header}></div>
      <ScrollArea className={classes.scrollArea} data-collapsed={isCollapsed}>
        <ListManager />
        <CategoryManager />
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
      <SidebarToggleButton
        isCollapsed={isCollapsed}
        onClick={handleToggleSidebar}
      />
      {children}
    </>
  );
}

export function SidebarToggleButton({
  isCollapsed,
  onClick,
}: React.HTMLAttributes<HTMLButtonElement> & {
  isCollapsed: boolean;
}) {
  return (
    <div className={classes.toggleButton}>
      <button onClick={onClick}>{isCollapsed ? ">" : "<"}</button>
    </div>
  );
}
