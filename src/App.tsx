import { ListsComponent } from "@/components/Lists";
import { ResetButton } from "@/components/Settings";
import { DateView } from "@/components/DateView";
import { HiddenListManager } from "@/components/Managers";

import classes from "@/styles/App.module.css";

function App() {
  return (
    <main className="main">
      <ListsComponent />
      <div className={classes.floatingLeft}>
        <HiddenListManager />
      </div>
      <div className={classes.floatingRight}>
        <ResetButton />
        <DateView />
      </div>
    </main>
  );
}

export default App;
