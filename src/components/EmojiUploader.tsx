import { useEffect, useState } from "react";
import { useDatabaseService } from "@/hooks/useDatabaseService";

import classes from "@/styles/EmojiUploader.module.css";

import { Emoji } from "@/components/Emoji";
import { Separator } from "@/components/ui/Separator";

import type { CustomEmoji } from "@/types/index.types";

import TrashIcon from "@/assets/trash.svg?react";
import AddCircleIcon from "@/assets/add_circle.svg?react";

export function EmojiUploader() {
  const db = useDatabaseService();
  const [customEmojis, setCustomEmojis] = useState<CustomEmoji[] | undefined>(
    undefined,
  );

  const [newEmojiName, setNewEmojiName] = useState("");
  const [newEmojiUrl, setNewEmojiUrl] = useState("");

  useEffect(() => {
    let mounted = true;
    db.getCustomEmojis()
      .then((emojis) => {
        if (mounted) setCustomEmojis(emojis);
      })
      .catch((error) => console.error("Error fetching custom emojis:", error));
    return () => {
      mounted = false;
    };
  }, [db]);

  const handleDeleteEmoji = (emojiId: string) => {
    db.deleteCustomEmoji(emojiId)
      .then(() => {
        setCustomEmojis((prev) => prev?.filter((e) => e.id !== emojiId));
      })
      .catch((error) => console.error("Error deleting emoji:", error));
  };

  const handleUploadEmoji = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setNewEmojiUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleAddEmoji = (e: React.FormEvent) => {
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

    db.addCustomEmoji(newEmoji)
      .then(() => {
        setNewEmojiName("");
        setNewEmojiUrl("");
      })
      .catch((error) => console.error("Error adding emoji:", error));
  };

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
              onClick={() => handleDeleteEmoji(emoji.id)}
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
            onChange={handleUploadEmoji}
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
            onClick={handleAddEmoji}
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
