import { SidebarProvider } from "@/components/Sidebar";
import { ListsComponent } from "@/components/List";
import { ResetButton } from "@/components/Settings";

function App() {
  return (
    <SidebarProvider>
      <main className="main">
        <ListsComponent />
        <ResetButton />
      </main>
    </SidebarProvider>
  );
}

export default App;
