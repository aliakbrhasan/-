"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog@1.1.6";
import { XIcon } from "lucide-react@0.487.0";

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
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const [open, setOpen] = React.useState(props.open ?? false);
  
  // Use body scroll lock when dialog is open
  useBodyScrollLock(open);
  
  return (
    <DialogPrimitive.Root 
      data-slot="dialog" 
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        props.onOpenChange?.(newOpen);
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
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-[6px]",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <div className="fixed inset-0 z-[1000] overflow-y-auto">
        <div
          className="flex min-h-full items-center justify-center p-4 sm:p-6 supports-[padding:max(env(safe-area-inset-top),1.5rem)]:pt-[max(env(safe-area-inset-top),1.5rem)] supports-[padding:max(env(safe-area-inset-bottom),1.5rem)]:pb-[max(env(safe-area-inset-bottom),1.5rem)]"
        >
          <DialogPrimitive.Content
            data-slot="dialog-content"
            className={cn(
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative flex max-h-[calc(100dvh-3rem)] w-full max-w-[min(100vw-2rem,90rem)] flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-background/98 via-background to-background/95 shadow-[0_40px_120px_-30px_rgba(15,23,42,0.75),0_20px_60px_-25px_rgba(15,23,42,0.6)] backdrop-blur-sm outline-none ring-1 ring-border/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:max-h-[calc(100dvh-4rem)]",
              className,
            )}
            {...props}
          >
            <DialogPrimitive.Close className="ring-offset-background absolute top-4 ltr:right-4 rtl:left-4 inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
            <div className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
              {children}
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
