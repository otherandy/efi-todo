import type { StageStatus, NumberStatus } from "@/types/index.types";

export function isStageStatus(status: unknown): status is StageStatus {
  return (
    typeof status === "object" &&
    status !== null &&
    Array.isArray((status as Record<string, unknown>).elements) &&
    typeof (status as Record<string, unknown>).selected === "number"
  );
}

export function isNumberStatus(status: unknown): status is NumberStatus {
  return (
    typeof status === "object" &&
    status !== null &&
    typeof (status as Record<string, unknown>).current === "number" &&
    typeof (status as Record<string, unknown>).max === "number"
  );
}
