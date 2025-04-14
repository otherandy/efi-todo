import { SidebarProvider } from "@/components/Sidebar";
import { ListsComponent } from "@/components/List";
import { ResetButton } from "@/components/Settings";
import { DateView } from "@/components/DateView";

import classes from "@/styles/App.module.css";

function App() {
  return (
    <SidebarProvider>
      <main className="main">
        <ListsComponent />
        <div className={classes.bottom}>
          <ResetButton />
          <DateView />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default App;
