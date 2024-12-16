import { ListsComponent } from "@/components/List";
import { CategoriesComponent } from "@/components/Category";
import { Calendar } from "@/components/Calendar";

function App() {
  return (
    <>
      <Calendar />
      <ListsComponent />
      <CategoriesComponent />
    </>
  );
}

export default App;
