import * as React from "react";

type ViewTransitionProps = {
  children: React.ReactNode;
  /** Elements sharing a name on the old and new page morph between each other. */
  name?: string;
  share?: string;
  default?: string;
  enter?: string;
  exit?: string;
};

/**
 * Thin wrapper over React's <ViewTransition>.
 *
 * React 19.2 ships it in the build Next vendors for the App Router, but
 * @types/react does not declare it yet, so it cannot be imported by name
 * without a type error. This reads it off the namespace and falls back to
 * rendering children untouched if it is ever missing, so a React change can
 * never take a page down over an animation.
 */
const Impl = (
  React as unknown as {
    ViewTransition?: React.ComponentType<ViewTransitionProps>;
  }
).ViewTransition;

export function ViewTransition({ children, ...props }: ViewTransitionProps) {
  if (!Impl) return <>{children}</>;
  return <Impl {...props}>{children}</Impl>;
}
