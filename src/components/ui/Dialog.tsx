import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import classes from "@/styles/Dialog.module.css";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className={classes.overlay} />
    <DialogPrimitive.Content ref={ref} className={classes.content} {...props}>
      <div>{children}</div>
      <DialogPrimitive.Close className={classes.closeButton} aria-label="Close">
        X
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

DialogContent.displayName = "DialogContent";
