import { db } from "@/utils/db";

export function ResetButton() {
  return (
    <button
      onClick={() => {
        db.delete({
          disableAutoOpen: true,
        })
          .then(() => {
            window.location.reload();
          })
          .catch(console.error);
      }}
    >
      Reset
    </button>
  );
}
