import { ListsComponent } from "@/components/Lists";
import { HiddenListManager } from "@/components/Managers";
import { Settings } from "@/components/Settings";
import { DateView } from "@/components/DateView";
import { Picture } from "@/components/Picture";
import { EmojiPickerLoader } from "@/components/ui/EmojiPicker";

import classes from "@/styles/App.module.css";

function App() {
  return (
    <main className={classes.app}>
      <EmojiPickerLoader />
      <div className={classes.topBar}>
        <Settings />
      </div>
      <ListsComponent />
      <div className={classes.bottomLeft}>
        <HiddenListManager />
      </div>
      <div className={classes.bottomRight}>
        <DateView />
        <Picture />
      </div>
    </main>
  );
}

export default App;
