import { db, addList } from "@/utils/db";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/AlertDialog";

import { EmojiUploader } from "@/components/EmojiUploader";

import classes from "@/styles/Settings.module.css";

import MoreVertIcon from "@/assets/more_vert.svg?react";

export function Settings() {
  const handleReset = () => {
    db.delete({
      disableAutoOpen: true,
    })
      .then(() => {
        window.location.reload();
      })
      .catch(console.error);
  };

  return (
    <AlertDialog>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={classes.settingsButton}
            title="Settings"
          >
            <MoreVertIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={addList}>
              <span>New List</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DialogTrigger asChild>
                <span>Custom Emoji</span>
              </DialogTrigger>
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                <span>Reset</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogTitle>Custom Emoji</DialogTitle>
          <EmojiUploader />
        </DialogContent>
      </Dialog>
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
            <button onClick={handleReset}>Confirm</button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
