import { useHistoryState } from "@uidotdev/usehooks";

export function HistoryButton() {
  const { undo, redo, canUndo, canRedo } = useHistoryState();

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <button
        onClick={undo}
        disabled={!canUndo}
        title="Undo"
        style={{
          padding: "0.5rem",
          opacity: canUndo ? 1 : 0.5,
          cursor: canUndo ? "pointer" : "not-allowed",
        }}
      >
        ↶
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        title="Redo"
        style={{
          padding: "0.5rem",
          opacity: canRedo ? 1 : 0.5,
          cursor: canRedo ? "pointer" : "not-allowed",
        }}
      >
        ↷
      </button>
    </div>
  );
}
