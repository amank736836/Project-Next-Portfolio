import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-xl border border-border bg-background p-8 shadow-sm',
  {
    variants: {
      variant: {
        default: '',
        elevated: 'shadow-md',
        outline: 'border-border',
        subtle: 'border-border/50 bg-background/50',
        ghost: 'border-none bg-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Card = React.forwardRef(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card, cardVariants };