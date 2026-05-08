import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-xl border border-border bg-background p-6 shadow-sm',
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

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'subtle' | 'ghost';
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cardVariants({ variant, className })}
        {...props}
      >
        {props.children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card, cardVariants };
export type { CardProps, VariantProps };