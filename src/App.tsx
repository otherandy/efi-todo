import { Sidebar } from "@/components/Sidebar";
import { Calendar } from "@/components/Calendar";
import { ListsComponent } from "@/components/List";

function App() {
  return (
    <>
      <Sidebar />
      <main className="main">
        <Calendar />
        <ListsComponent />
      </main>
    </>
  );
}

export default App;
