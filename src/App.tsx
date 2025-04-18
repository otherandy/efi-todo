import { ListsComponent } from "@/components/Lists";
import { HiddenListManager } from "@/components/Managers";
import { Settings } from "@/components/Settings";
import { DateView } from "@/components/DateView";
import { Picture } from "@/components/Picture";

import classes from "@/styles/App.module.css";

function App() {
  return (
    <main className={classes.app}>
      <ListsComponent />
      <div className={classes.bottomLeft}>
        <HiddenListManager />
      </div>
      <div className={classes.bottomRight}>
        <DateView />
        <Picture />
      </div>
      <div className={classes.topRight}>
        <Settings />
      </div>
    </main>
  );
}

export default App;
