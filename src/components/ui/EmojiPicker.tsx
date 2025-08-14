import Picker, {
  type PickerProps,
  type EmojiClickData,
  EmojiStyle,
} from "emoji-picker-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/dexie.service";

import classes from "@/styles/Emoji.module.css";

type Props = {
  itemId: number;
  onClose?: () => void;
} & Omit<
  PickerProps,
  "customEmojis" | "onEmojiClick" | "emojiStyle" | "previewConfig"
>;

export function EmojiPickerLoader() {
  const customEmojis = useLiveQuery(() => db.customEmojis.toArray(), []);
  return <Picker open={false} customEmojis={customEmojis} />;
}

export function ItemEmojiPicker(props: Props) {
  const { itemId, onClose, ...rest } = props;
  const customEmojis = useLiveQuery(() => db.customEmojis.toArray(), []);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const { unified } = emojiData;

    db.todoItems
      .update(itemId, {
        emoji: unified,
      })
      .catch((error) => {
        console.error("Error updating emoji:", error);
      });
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={classes.picker} onPointerDown={(e) => e.stopPropagation()}>
      <Picker
        customEmojis={customEmojis}
        onEmojiClick={onEmojiClick}
        emojiStyle={EmojiStyle.TWITTER}
        previewConfig={{
          showPreview: false,
        }}
        {...rest}
      />
    </div>
  );
}
