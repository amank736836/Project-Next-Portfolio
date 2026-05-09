import React, { useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = DialogPrimitive.Overlay;
const DialogClose = DialogPrimitive.Close;
const DialogContent = DialogPrimitive.Content;
const DialogHeader = ({ className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />
);
const DialogFooter = ({ className, ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props} />
);
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;
import { X } from 'lucide-react';

interface ModalProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({
    children,
    trigger,
    title,
    description,
    onOpenChange,
    className,
    contentClassName,
    ...props
  }, ref) => {
    return (
      <Dialog onOpenChange={onOpenChange} {...props}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogContent
            ref={ref}
            className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg ${contentClassName}`}
          >
            <DialogHeader>
              {title && <DialogTitle className="text-lg font-semibold leading-none tracking-tight">{title}</DialogTitle>}
              {description && <DialogDescription className="text-sm text-muted-foreground">{description}</DialogDescription>}
            </DialogHeader>
            <div className="grid gap-4 py-4">{children}</div>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
  }
);

Modal.displayName = 'Modal';

export { Modal };