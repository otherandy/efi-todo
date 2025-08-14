import type { List, TodoItem } from "@/types/index.types";

export interface AppState {
  lists: List[];
  items: TodoItem[];
}

export interface HistoryStateType {
  state: AppState;
  set: (newPresent: AppState) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
