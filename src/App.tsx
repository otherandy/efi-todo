import { ListsComponent } from "@/components/Lists";
import { HiddenListManager } from "@/components/Managers";
import { ResetButton } from "@/components/Settings";
import { DateView } from "@/components/DateView";
import { Picture } from "@/components/Picture";

import classes from "@/styles/App.module.css";

function App() {
  return (
    <main className={classes.app}>
      <ListsComponent />
      <div className={classes.floatingLeft}>
        <HiddenListManager />
      </div>
      <div className={classes.floatingRight}>
        <ResetButton />
        <DateView />
        <Picture />
      </div>
    </main>
  );
}

export default App;
