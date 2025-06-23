import { useState } from "react";
import { db, addList } from "@/utils/db";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  AlertDialog,
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

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
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
          <DropdownMenuItem
            onClick={() => {
              setDropdownOpen(false);
              setDialogOpen(true);
            }}
          >
            <span>Custom Emoji</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setDropdownOpen(false);
              setAlertOpen(true);
            }}
          >
            <span>Reset</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle>Custom Emoji</DialogTitle>
          <EmojiUploader />
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Reset?</AlertDialogTitle>
          <AlertDialogDescription>
            This erases all your lists and emoji.
          </AlertDialogDescription>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
          >
            <AlertDialogCancel asChild>
              <button>Cancel</button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button onClick={handleReset}>Confirm</button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
