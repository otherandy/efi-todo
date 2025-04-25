import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/AlertDialog";

export function DangerButton({
  confirmAction,
  children,
}: {
  confirmAction: () => void;
  asChild?: boolean;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
        <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
          <AlertDialogCancel asChild>
            <button>Cancel</button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button onClick={confirmAction}>Confirm</button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
