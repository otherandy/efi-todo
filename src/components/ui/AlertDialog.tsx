import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as React from "react";

import classes from "@/styles/ui/AlertDialog.module.css";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogTitle = AlertDialogPrimitive.Title;

export const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ children, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={classes.description}
    {...props}
  >
    {children}
  </AlertDialogPrimitive.Description>
));

AlertDialogDescription.displayName = "AlertDialogDescription";

export const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ children, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={classes.cancelButton}
    {...props}
  >
    {children}
  </AlertDialogPrimitive.Cancel>
));

AlertDialogCancel.displayName = "AlertDialogCancel";

export const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ children, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={classes.actionButton}
    {...props}
  >
    {children}
  </AlertDialogPrimitive.Action>
));

AlertDialogAction.displayName = "AlertDialogAction";

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
