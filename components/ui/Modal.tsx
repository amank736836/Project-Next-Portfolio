import React, { useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@radix-ui/react-dialog';
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
      <Dialog
        ref={ref}
        open={false}
        onOpenChange={onOpenChange}
        {...props}
      >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={contentClassName} className="fixed inset-0 z-50 flex min-h-screen items-end justify-center p-4 pointer-events-none sm:items-center sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 pointer-events-only sm:inset-0" aria-hidden="true" />
          <div className="relative pointer-events-auto w-full max-w-lg max-h-[90vh] max-w-[90vh] overflow-y-auto">
            <div className="relative bg-popover text-popover-foreground border border-popover/50 shadow-xl rounded-lg w-full">
              <div className="flex h-10 items-center justify-between p-4 border-b border-popover/50">
                <DialogHeader>
                  {title && <DialogTitle className="text-lg font-semibold leading-none">{title}</DialogTitle>}
                  {description && <DialogDescription className="text-sm text-muted-foreground mt-1">{description}</DialogDescription>}
                </DialogHeader>
                <DialogTrigger asChild>
                  <X className="h-4 w-4 rounded-xs ring-offset-bg hover:bg-accent hover:text-accent-foreground" />
                </DialogTrigger>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto">{children}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

Modal.displayName = 'Modal';

export { Modal };