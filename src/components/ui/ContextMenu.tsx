import * as ContextMenu from "@radix-ui/react-context-menu";
import classes from "@/styles/ContextMenu.module.css";

export const ContextMenuRoot = ContextMenu.Root;

export const ContextMenuTrigger = ContextMenu.Trigger;

export const ContextMenuContent = ContextMenu.Content;

export const ContextMenuItem = ContextMenu.Item;

export function ContextMenuContentStyled({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContextMenu.Portal>
      <ContextMenu.Content className={classes.contextMenu}>
        {children}
      </ContextMenu.Content>
    </ContextMenu.Portal>
  );
}
