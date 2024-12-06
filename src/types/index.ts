export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  listed: boolean;
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
  categoryId: string;
  items: TodoItem[];
}

export interface List {
  id: string;
  title: string;
  color: string;
  groups: Group[];
}
