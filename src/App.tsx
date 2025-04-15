import { ListsComponent } from "@/components/Lists";
import { ResetButton } from "@/components/Settings";
import { DateView } from "@/components/DateView";

import classes from "@/styles/App.module.css";

function App() {
  return (
    <main className="main">
      <ListsComponent />
      <div className={classes.toast}>
        <ResetButton />
        <DateView />
      </div>
    </main>
  );
}

export default App;
