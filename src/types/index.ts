interface List {
  id: string;
  title: string;
  color: string;
  hidden: boolean;
}

interface Group {
  id: string;
  listId: string;
  categoryId: string;
}

interface TodoItem {
  id: string;
  groupId: string;
  text: string;
  completed: boolean;
  starred: boolean;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

interface Status {
  selectedIndex: number;
  array: string[];
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  hidden: boolean;
}

export type { Category, Status, TodoItem, Group, List };
