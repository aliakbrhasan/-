"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "./utils";

// Hook to manage body scroll lock
function useBodyScrollLock(isLocked: boolean) {
  React.useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLocked]);
}

function Dialog({
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false,
  );
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  useBodyScrollLock(open);

  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isControlled) {
          setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      }}
      {...props}
    />
  );
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-[999] bg-slate-950/70 backdrop-blur data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 tm-modal__overlay",
        className,
      )}
      {...props}
    />
  );
}

function isElementOfType<
  T extends
    | typeof DialogHeader
    | typeof DialogFooter,
>(
  child: React.ReactNode,
  component: T,
): child is React.ReactElement<React.ComponentProps<T>> {
  return (
    React.isValidElement(child) &&
    (child.type === component ||
      // Support for possible displayName overrides after bundling
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((child.type as any)?.displayName &&
        (child.type as any)?.displayName === (component as unknown as { displayName?: string }).displayName))
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  const childArray = React.Children.toArray(children);
  const headerElements: React.ReactElement[] = [];
  const footerElements: React.ReactElement[] = [];
  const bodyElements: React.ReactNode[] = [];

  childArray.forEach((child) => {
    if (isElementOfType(child, DialogHeader)) {
      headerElements.push(child);
      return;
    }

    if (isElementOfType(child, DialogFooter)) {
      footerElements.push(child);
      return;
    }

    bodyElements.push(child);
  });

  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <div className="fixed inset-0 z-[1000] overflow-y-auto tm-modal">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <DialogPrimitive.Content
            data-slot="dialog-content"
            className={cn(
              "relative flex max-h-[calc(100dvh-3rem)] w-full max-w-[min(100vw-2rem,90rem)] flex-col overflow-hidden rounded-2xl border border-border/60 bg-background text-foreground shadow-[0_20px_70px_rgba(15,23,42,0.35)] outline-none ring-1 ring-border/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-h-[calc(100dvh-4rem)] tm-modal__panel",
              className,
            )}
            {...props}
          >
            <DialogPrimitive.Close className="ring-offset-background absolute top-4 ltr:right-4 rtl:left-4 inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/95 text-muted-foreground shadow-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
              <X />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
            <div className="flex min-h-0 flex-1 flex-col">
              {headerElements.map((element) =>
                React.cloneElement(element, {
                  className: cn("flex-shrink-0", element.props.className),
                }),
              )}
              <div className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
                {bodyElements}
              </div>
              {footerElements.map((element) =>
                React.cloneElement(element, {
                  className: cn("flex-shrink-0", element.props.className),
                }),
              )}
            </div>
          </DialogPrimitive.Content>
        </div>
      </div>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "sticky top-0 z-10 flex flex-col gap-2 border-b border-border/60 bg-gradient-to-b from-background/92 via-background/95 to-background/98 p-6 pb-4 text-center shadow-[0_10px_30px_-20px_rgba(15,23,42,0.75)] sm:text-left",
        className,
      )}
      {...props}
    />
  );
}

DialogHeader.displayName = "DialogHeader";

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "sticky bottom-0 mt-auto z-10 flex flex-col-reverse gap-2 border-t border-border/60 bg-gradient-to-t from-background/92 via-background/95 to-background/98 p-6 pt-4 shadow-[0_-10px_30px_-20px_rgba(15,23,42,0.65)] sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

DialogFooter.displayName = "DialogFooter";

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
