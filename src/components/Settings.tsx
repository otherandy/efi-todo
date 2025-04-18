import { db } from "@/utils/db";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";

import classes from "@/styles/Settings.module.css";

import CircleIcon from "@/assets/circle.svg?react";
import { EmojiUploader } from "@/components/EmojiUploader";

export function Settings() {
  return (
    <Dialog>
      <DialogTrigger>
        <CircleIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
        <div className={classes.dialog}>
          <div>
            <h3>General</h3>
            <br />
            <EmojiUploader />
          </div>
          <div>
            <h3>Danger Area</h3>
            <br />
            <ResetButton />
          </div>
        </div>
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
