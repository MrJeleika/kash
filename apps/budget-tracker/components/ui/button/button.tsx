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
        destructive: 'bg-destructive',
        outline: 'border bg-background',
        secondary: 'bg-gray',
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

const textVariants = cva('text-white', {
  variants: {
    text: {
      default: '',
      cta: 'text-black font-medium',
    },
  },
  defaultVariants: {
    text: 'default',
  },
});

type ButtonProps = TouchableOpacityProps &
  VariantProps<typeof buttonVariants> &
  VariantProps<typeof textVariants> & {
    className?: string;
    children: React.ReactNode;
  };

function Button({
  className,
  variant = 'default',
  size = 'default',
  children,
  text = 'default',
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <Text className={cn(textVariants({ text }))}>{children}</Text>
    </Pressable>
  );
}

export { Button, buttonVariants };
