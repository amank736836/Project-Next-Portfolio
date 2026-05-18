import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-[3px] h-10 px-4',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/20 transition-all',
        glass: 'border-none bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08] transition-all shadow-xl',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  const Component = asChild ? 'a' : 'button';

  return (
    <Component
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Component>
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };