import { Sidebar } from "@/components/Sidebar";
import { DateView } from "@/components/DateView";
import { ListsComponent } from "@/components/List";

function App() {
  return (
    <>
      <Sidebar />
      <main className="main">
        <DateView />
        <ListsComponent />
      </main>
    </>
  );
}

export default App;
