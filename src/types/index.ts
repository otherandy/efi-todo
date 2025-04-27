type Color = string;
type Hidden = 0 | 1;
type Star = 0 | 1 | 2;

interface List {
  id: number;
  title: string;
  color: Color;
  halfSize: boolean;
  hidden: Hidden;
}

interface TodoItem {
  id: number;
  listId: number;
  order: number;
  text: string;
  emoji: string;
  color: Color;
  star: Star;
  checked: boolean;
  status: StageStatus | NumberStatus | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  name: string;
  color: Color;
  icon: string;
  hidden: boolean;
}

interface StageStatus {
  selected: number;
  elements: string[];
}

interface NumberStatus {
  current: number;
  max: number;
}

interface CustomEmoji {
  id: string;
  names: string[];
  imgUrl: string;
}

export type {
  List,
  TodoItem,
  Category,
  StageStatus,
  NumberStatus,
  CustomEmoji,
  Color,
  Hidden,
  Star,
};
