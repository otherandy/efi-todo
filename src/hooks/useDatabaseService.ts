import { useContext } from "react";
import { DatabaseContext } from "@/services/DatabaseContext";
import type { DatabaseService } from "@/types/db.interface";

export function useDatabaseService(): DatabaseService {
  const context = useContext(DatabaseContext) as DatabaseService | undefined;
  if (!context) {
    throw new Error(
      "useDatabaseService must be used within a DatabaseProvider",
    );
  }
  return context;
}
