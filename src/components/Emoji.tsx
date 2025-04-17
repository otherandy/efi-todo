import { Emoji as EmojiPrimitive } from "emoji-picker-react";
import { useState } from "react";

import { EmojiPicker } from "@/components/ui/EmojiPicker";
import { Portal } from "@/components/ui/Portal";

import classes from "@/styles/Emoji.module.css";

const size = 18; // Default size for the emoji

export function ItemEmoji({
  itemId,
  emoji,
}: {
  itemId: number;
  emoji: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      {isOpen && (
        <Portal onClick={() => setIsOpen(false)} className={classes.overlay} />
      )}
      <span
        className={classes.emoji}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: size,
          height: size,
        }}
      >
        <Emoji emoji={emoji} />
      </span>
      <EmojiPicker itemId={itemId} open={isOpen} />
    </div>
  );
}

export function Emoji({ emoji }: { emoji: string }) {
  if (!emoji) {
    return <EmojiPrimitive unified="1f914" size={size} />; // 🤔
  }

  return <EmojiPrimitive unified={emoji} size={size} />;
}
