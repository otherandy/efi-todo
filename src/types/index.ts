type Color = string;
type Hidden = 0 | 1;

interface List {
  id: number;
  title: string;
  hidden: Hidden;
  color: Color;
}

interface TodoItem {
  id: number;
  listId: number;
  order: number;
  text: string;
  checked: boolean;
  starred: boolean;
  categoryName: string;
  emoji: string;
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

interface CustomEmoji {
  id: string;
  names: string[];
  imgUrl: string;
}

export type { List, TodoItem, Category, Status, CustomEmoji };
