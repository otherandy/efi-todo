import * as ProgressPrimitive from "@radix-ui/react-progress";

import classes from "@/styles/ui/Progress.module.css";

export const Progress = (props: ProgressPrimitive.ProgressProps) => (
  <ProgressPrimitive.Root className={classes.root} {...props} />
);

export const ProgressIndicator = (
  props: ProgressPrimitive.ProgressIndicatorProps,
) => <ProgressPrimitive.Indicator className={classes.indicator} {...props} />;
