import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";

import classes from "@/styles/EmojiUploader.module.css";

import { Emoji } from "@/components/Emoji";
import type { CustomEmoji } from "@/types";

export function EmojiUploader() {
  const customEmojis = useLiveQuery(() => db.customEmojis.toArray(), [], []);

  const [newEmojiName, setNewEmojiName] = useState("");
  const [newEmojiUrl, setNewEmojiUrl] = useState("");

  return (
    <div>
      {customEmojis?.map((emoji) => (
        <div key={emoji.id} className={classes.customEmoji}>
          <span>{emoji.id}</span>
          <span>
            <Emoji unified={emoji.id} />
          </span>
          <button
            className={classes.deleteButton}
            onClick={() => {
              db.customEmojis.delete(emoji.id).catch(console.error);
            }}
          >
            <span role="img" aria-label="delete">
              ❌
            </span>
          </button>
        </div>
      ))}
      <form>
        <input
          type="text"
          value={newEmojiName}
          required
          onChange={(e) => {
            const value = e.target.value;
            setNewEmojiName(value);
          }}
        />
        <input
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
        <button
          type="submit"
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
          Add Emoji
        </button>
      </form>
    </div>
  );
}
