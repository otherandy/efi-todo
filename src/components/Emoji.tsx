import { Emoji as EmojiPrimitive, EmojiStyle } from "emoji-picker-react";
import { useState } from "react";

import { ItemEmojiPicker } from "@/components/ui/EmojiPicker";
import { Portal } from "@/components/ui/Portal";

import classes from "@/styles/Emoji.module.css";

const size = 24;

export function ItemEmoji({
  itemId,
  emoji,
}: {
  itemId: number;
  emoji: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={classes.emoji}>
      {isOpen && (
        <Portal onClick={() => setIsOpen(false)} className={classes.overlay} />
      )}
      <span
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: size,
          height: size,
        }}
      >
        <Emoji unified={emoji} />
      </span>
      <ItemEmojiPicker itemId={itemId} open={isOpen} />
    </div>
  );
}

export function Emoji({ unified }: { unified?: string }) {
  return (
    <EmojiPrimitive
      unified={unified ?? "1f539"}
      size={size}
      emojiStyle={EmojiStyle.TWITTER}
    />
  );
}
