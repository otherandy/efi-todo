import * as PortalPrimitive from "@radix-ui/react-portal";
import * as React from "react";

export const Portal = React.forwardRef<
  React.ElementRef<typeof PortalPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof PortalPrimitive.Root>
>(({ children, ...props }, ref) => {
  return (
    <PortalPrimitive.Root ref={ref} {...props}>
      {children}
    </PortalPrimitive.Root>
  );
});

Portal.displayName = "Portal";
