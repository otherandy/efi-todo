import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import * as React from "react";

import classes from "@/styles/ui/ContextMenu.module.css";

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuItem = ContextMenuPrimitive.Item;

export const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ children, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={classes.contextContent}
      {...props}
    >
      {children}
    </ContextMenuPrimitive.Content>
  </ContextMenuPrimitive.Portal>
));

ContextMenuContent.displayName = "ContextMenuContent";
