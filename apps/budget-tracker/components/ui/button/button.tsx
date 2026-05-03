import * as React from 'react';
import { Pressable, Text, TouchableOpacityProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@MrJeleika/utils';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-lg disabled:opacity-50 active:opacity-70',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        accent: 'bg-accent',
        destructive: 'bg-accent',
        outline: 'border border-border bg-background',
        secondary: 'bg-surface',
        ghost: 'bg-transparent',
        link: 'bg-transparent',
      },
      size: {
        default: '',
        cta: 'w-full p-4 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const textVariants = cva('font-medium', {
  variants: {
    variant: {
      default: 'text-background',
      accent: 'text-background',
      destructive: 'text-background',
      outline: 'text-text',
      secondary: 'text-text',
      ghost: 'text-text',
      link: 'text-accent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type ButtonProps = TouchableOpacityProps &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    textClassName?: string;
    children: React.ReactNode;
  };

function Button({
  className,
  textClassName,
  variant = 'default',
  size = 'default',
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className={cn(textVariants({ variant }), textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export { Button, buttonVariants };
