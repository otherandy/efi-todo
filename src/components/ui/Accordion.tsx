import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";

import classes from "@/styles/ui/Accordion.module.css";

import KeyboardArrowDownIcon from "@/assets/keyboard_arrow_down.svg?react";

export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = AccordionPrimitive.Item;
export const AccordionContent = AccordionPrimitive.Content;

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ children, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={classes.trigger}
      {...props}
    >
      {children}
      <KeyboardArrowDownIcon aria-hidden />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = "AccordionTrigger";
