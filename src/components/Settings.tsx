import { db } from "@/utils/db";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/ContextMenu";

import { EmojiUploader } from "@/components/EmojiUploader";

import classes from "@/styles/Settings.module.css";

import MoreVertIcon from "@/assets/more_vert.svg?react";

export function Settings() {
  return (
    <Dialog>
      <ContextMenu>
        <ContextMenuTrigger className={classes.settingsButton}>
          <MoreVertIcon />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem asChild>
            <DialogTrigger>
              <span>Custom Emoji</span>
            </DialogTrigger>
          </ContextMenuItem>
          <ContextMenuItem
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
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
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
