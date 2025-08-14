import React, { createContext } from "react";
import type { DatabaseService } from "@/types/db.interface";
import { DexieService } from "@/services/dexie.service";

const DatabaseContext = createContext<DatabaseService | null>(null);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dbService = React.useMemo(() => new DexieService(), []);
  return (
    <DatabaseContext.Provider value={dbService}>
      {children}
    </DatabaseContext.Provider>
  );
};

export { DatabaseContext };
