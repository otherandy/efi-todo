import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";

import classes from "@/styles/EmojiUploader.module.css";

import { Emoji } from "@/components/Emoji";
import { Separator } from "@/components/ui/Separator";

import type { CustomEmoji } from "@/types";

import TrashIcon from "@/assets/trash.svg?react";
import AddCircleIcon from "@/assets/add_circle.svg?react";

export function EmojiUploader() {
  const customEmojis = useLiveQuery(() => db.customEmojis.toArray(), [], []);

  const [newEmojiName, setNewEmojiName] = useState("");
  const [newEmojiUrl, setNewEmojiUrl] = useState("");

  return (
    <div className={classes.container}>
      <ul className={classes.list}>
        {customEmojis?.map((emoji) => (
          <li key={emoji.id} className={classes.item}>
            <div className={classes.customEmoji}>
              <span>
                <Emoji unified={emoji.id} />
              </span>
              <span>{emoji.id}</span>
            </div>
            <button
              className={classes.deleteButton}
              onClick={() => {
                db.customEmojis.delete(emoji.id).catch(console.error);
              }}
            >
              <span aria-label="delete">
                <TrashIcon />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Separator orientation="horizontal" />
      <form className={classes.addForm}>
        <div className={classes.fileInput}>
          <label htmlFor="emojiFile" className={classes.fileLabel}>
            Upload Emoji
          </label>
          <input
            id="emojiFile"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = (event) => {
                const base64 = event.target?.result as string;
                setNewEmojiUrl(base64);
              };
              reader.readAsDataURL(file);
            }}
          />
        </div>
        <div className={classes.inputGroup}>
          <input
            type="text"
            value={newEmojiName}
            className={classes.nameInput}
            placeholder="Emoji Name"
            required
            onChange={(e) => {
              const value = e.target.value;
              setNewEmojiName(value);
            }}
          />
          <button
            type="submit"
            className={classes.addButton}
            onClick={(e) => {
              e.preventDefault();
              if (!newEmojiName || !newEmojiUrl) return;

              if (customEmojis?.some((emoji) => emoji.id === newEmojiName)) {
                alert("Emoji with this name already exists.");
                return;
              }

              const newEmoji: CustomEmoji = {
                id: newEmojiName.toLowerCase(),
                imgUrl: newEmojiUrl,
                names: [newEmojiName],
              };

              db.customEmojis
                .add(newEmoji)
                .then(() => {
                  setNewEmojiName("");
                  setNewEmojiUrl("");
                })
                .catch((error) => {
                  console.error("Error adding emoji:", error);
                });
            }}
          >
            <span aria-label="add">
              <AddCircleIcon />
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
