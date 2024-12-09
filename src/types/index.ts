export interface Category {
  name: string;
  color: string;
  icon: string;
  hidden: boolean;
}

interface Status {
  selectedIndex: number;
  array: string[];
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  starred: boolean;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  categoryName: string;
  items: TodoItem[];
}

export interface List {
  id: string;
  title: string;
  color: string;
  hidden: boolean;
  groups: Group[];
}
