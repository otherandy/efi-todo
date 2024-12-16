import { ListSidebarComponent } from "@/components/List";
import { CategoriesComponent } from "@/components/Category";

import classes from "@/styles/Sidebar.module.css";

export function Sidebar() {
  return (
    <div className={classes.sidebar}>
      <ListSidebarComponent />
      <CategoriesComponent />
    </div>
  );
}
