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

import { EmojiUploader } from "@/components/EmojiUploader";

import classes from "@/styles/Settings.module.css";

import MoreVertIcon from "@/assets/more_vert.svg?react";

export function Settings() {
  return (
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
          <DropdownMenuItem
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
            <span>Reset</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogTitle>Custom Emoji</DialogTitle>
        <EmojiUploader />
      </DialogContent>
    </Dialog>
  );
}

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
