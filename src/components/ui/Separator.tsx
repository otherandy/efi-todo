import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";

import classes from "@/styles/ui/Separator.module.css";

import PropTypes from "prop-types";

export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ decorative = true, orientation = "vertical", ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    data-orientation={orientation}
    className={classes.separator}
    {...props}
  />
));

Separator.propTypes = {
  decorative: PropTypes.bool,
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
};

Separator.displayName = "Separator";
