import * as ContextMenu from "@radix-ui/react-context-menu";
import classes from "@/styles/ContextMenu.module.css";

export const ContextMenuRoot = ContextMenu.Root;

export function ContextMenuTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>;
}

export function ContextMenuContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ContextMenu.Content className={className}>{children}</ContextMenu.Content>
  );
}

export function ContextMenuItem({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
}) {
  return <ContextMenu.Item onSelect={onSelect}>{children}</ContextMenu.Item>;
}

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
