import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as React from "react";

import classes from "@/styles/ui/AlertDialog.module.css";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogTitle = AlertDialogPrimitive.Title;
export const AlertDialogDescription = AlertDialogPrimitive.Description;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;
export const AlertDialogAction = AlertDialogPrimitive.Action;

export const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ children, ...props }, ref) => (
  <AlertDialogPrimitive.Portal>
    <AlertDialogPrimitive.Overlay className={classes.overlay} />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={classes.content}
      {...props}
    >
      <div>{children}</div>
    </AlertDialogPrimitive.Content>
  </AlertDialogPrimitive.Portal>
));

AlertDialogContent.displayName = "AlertDialogContent";
