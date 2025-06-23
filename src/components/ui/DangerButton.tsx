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
  action,
  description,
  confirmAction,
  children,
}: {
  action: string;
  description?: string;
  confirmAction: () => void;
  asChild?: boolean;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>{action}</AlertDialogTitle>
        <AlertDialogDescription>
          {description ?? "This action cannot be undone."}
        </AlertDialogDescription>
        <div
          style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
        >
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
