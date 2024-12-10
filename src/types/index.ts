type Color = string;

interface List {
  id: number;
  title: string;
  color: Color;
  hidden: boolean;
}

interface Group {
  id: number;
  listId: number;
  categoryId: number;
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
}

interface Status {
  selectedIndex: number;
  array: string[];
}

interface Category {
  id: number;
  name: string;
  color: Color;
  icon: string;
  hidden: boolean;
}

export type { Category, Status, TodoItem, Group, List };
