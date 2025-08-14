import { useContext } from "react";
import { HistoryStateContext } from "@/services/HistoryStateContext";

export function useHistory() {
  const context = useContext(HistoryStateContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryStateProvider");
  }
  return context;
}
