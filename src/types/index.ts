type Color = string;

interface List {
  id: number;
  title: string;
  hidden: boolean;
  color: Color;
}

interface TodoItem {
  id: number;
  listId: number;
  order: number;
  categoryName: string;
  text: string;
  checked: boolean;
  starred: boolean;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  name: string;
  color: Color;
  icon: string;
  hidden: boolean;
}

interface Status {
  selected: number;
  elements: string[];
  hidden: boolean;
}

export type { List, TodoItem, Category, Status };
