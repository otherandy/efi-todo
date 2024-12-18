type Color = string;

interface List {
  id: number;
  title: string;
  color: Color;
  hidden: boolean;
}

interface Category {
  id: number;
  name: string;
  color: Color;
  icon: string;
  hidden: boolean;
}

interface Group {
  id: number;
  listId: number;
  categoryId: number;
  categoryName?: string;
  color: Color;
  icon?: string;
  order: number;
}

interface TodoItem {
  id: number;
  groupId: number;
  text: string;
  completed: boolean;
  starred: boolean;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

interface Status {
  selectedIndex: number;
  elements: string[];
}

export type { Category, Status, TodoItem, Group, List };
