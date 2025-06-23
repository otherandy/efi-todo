import { Emoji as EmojiPrimitive, EmojiStyle } from "emoji-picker-react";
import { useRef, useState, useEffect, useCallback } from "react";

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
  const [pickerPos, setPickerPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const emojiRef = useRef<HTMLSpanElement>(null);

  const updatePickerPos = useCallback(() => {
    if (emojiRef.current) {
      const rect = emojiRef.current.getBoundingClientRect();
      setPickerPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    updatePickerPos();
    window.addEventListener("scroll", updatePickerPos, true);
    window.addEventListener("resize", updatePickerPos);

    return () => {
      window.removeEventListener("scroll", updatePickerPos, true);
      window.removeEventListener("resize", updatePickerPos);
    };
  }, [isOpen, updatePickerPos]);

  const handleEmojiClick = () => {
    if (!isOpen) {
      updatePickerPos();
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={classes.emoji}>
      <span
        ref={emojiRef}
        onClick={handleEmojiClick}
        style={{
          width: size,
          height: size,
        }}
      >
        <Emoji unified={emoji} />
      </span>
      {isOpen && pickerPos && (
        <Portal>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 9998,
            }}
            onClick={() => setIsOpen(false)}
          ></div>
          <div
            style={{
              position: "absolute",
              top: pickerPos.top,
              left: pickerPos.left,
              zIndex: 9999,
            }}
          >
            <ItemEmojiPicker itemId={itemId} onClose={() => setIsOpen(false)} />
          </div>
        </Portal>
      )}
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
