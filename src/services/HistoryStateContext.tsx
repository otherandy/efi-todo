import { createContext } from "react";
import { useHistoryState } from "@uidotdev/usehooks";
import type { AppState, HistoryStateType } from "@/types/history.types";

const HistoryStateContext = createContext<HistoryStateType | undefined>(
  undefined,
);

export function HistoryStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const historyState = useHistoryState<AppState>();
  return (
    <HistoryStateContext.Provider value={historyState}>
      {children}
    </HistoryStateContext.Provider>
  );
}

export { HistoryStateContext };
