import { useState } from "react";
import { useDatabaseService } from "@/hooks/useDatabaseService";

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
  const db = useDatabaseService();

  const handleReset = () => {
    db.reset()
      .then(() => {
        setAlertOpen(false);
        window.location.reload();
      })
      .catch(console.error);
  };

  const handleAddList = () => {
    db.getLists()
      .then((lists) => {
        lists.sort((a, b) => a.order - b.order);
        return lists.slice(-1);
      })
      .then((last) => {
        const newOrder = last.length > 0 ? last[0].order + 1 : 0;
        return db.addList({
          order: newOrder,
          title: "New List",
          color: "#90abbf",
          halfSize: false,
          hidden: 0,
        });
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
          <DropdownMenuItem onClick={handleAddList}>
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
