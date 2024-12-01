export interface List {
  id: string;
  title: string;
  color: string;
}

export interface Item {
  id: string;
  text: string;
  completed: boolean;
  starred: boolean;
  listId: string;
  categoryId: string;
  statusItems: string[];
  statusIndex: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  listed: boolean;
}
