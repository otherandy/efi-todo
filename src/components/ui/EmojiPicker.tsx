import Picker, {
  type PickerProps,
  type EmojiClickData,
  EmojiStyle,
} from "emoji-picker-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";

import classes from "@/styles/Emoji.module.css";

type Props = {
  itemId: number;
} & Omit<
  PickerProps,
  "className" | "customEmojis" | "onEmojiClick" | "previewConfig"
>;

export function EmojiPicker(props: Props) {
  const customEmojis = useLiveQuery(() => db.customEmojis.toArray(), []);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const { unified } = emojiData;

    db.todoItems
      .update(props.itemId, {
        emoji: unified,
      })
      .catch((error) => {
        console.error("Error updating emoji:", error);
      });
  };

  return (
    <div className={classes.picker}>
      <Picker
        customEmojis={customEmojis}
        onEmojiClick={onEmojiClick}
        emojiStyle={EmojiStyle.NATIVE}
        previewConfig={{
          showPreview: false,
        }}
        {...props}
      />
    </div>
  );
}
