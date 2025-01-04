import { SidebarProvider } from "@/components/Sidebar";
import { ListsComponent } from "@/components/List";

function App() {
  return (
    <SidebarProvider>
      <main className="main">
        <ListsComponent />
      </main>
    </SidebarProvider>
  );
}

export default App;
