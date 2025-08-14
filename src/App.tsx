import { HistoryStateProvider } from "@/services/HistoryStateContext";
import { DatabaseProvider } from "@/services/DatabaseContext";

import { ListsComponent } from "@/components/Lists";
import { Settings } from "@/components/Settings";
import { DateView } from "@/components/DateView";
import { Picture } from "@/components/Picture";
import { HistoryButton } from "@/components/HistoryButton";
import { HiddenListManager } from "@/components/managers/HiddenListManager";
import { EmojiPickerLoader } from "@/components/ui/EmojiPicker";

import classes from "@/styles/App.module.css";

function App() {
  return (
    <DatabaseProvider>
      <HistoryStateProvider>
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
            <HistoryButton />
            <DateView />
            <Picture />
          </div>
        </main>
      </HistoryStateProvider>
    </DatabaseProvider>
  );
}

export default App;
