import type { CustomEmoji, List, TodoItem } from "@/types/index.types";

export interface DatabaseService {
  // Read operations
  getLists(): Promise<List[]>;
  getListById(id: number): Promise<List | undefined>;
  getItems(): Promise<TodoItem[]>;
  getItemById(id: number): Promise<TodoItem | undefined>;
  getItemsByListId(listId: number): Promise<TodoItem[]>;

  getCustomEmojis(): Promise<CustomEmoji[]>;

  // Write operations
  addList(list: Omit<List, "id">): Promise<List>;
  updateList(id: number, updates: Partial<List>): Promise<void>;
  deleteList(id: number): Promise<void>;

  addItem(item: Omit<TodoItem, "id">): Promise<TodoItem>;
  updateItem(id: number, updates: Partial<TodoItem>): Promise<void>;
  deleteItem(id: number): Promise<void>;

  addCustomEmoji(emoji: CustomEmoji): Promise<void>;
  deleteCustomEmoji(emojiName: string): Promise<void>;

  // Batch operations
  getAllTodoData(): Promise<{ lists: List[]; items: TodoItem[] }>;
  reset(): Promise<void>;
}
