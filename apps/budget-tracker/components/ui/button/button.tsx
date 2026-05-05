import * as React from 'react';
import { Pressable, Text, TouchableOpacityProps, View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/shared';
import { C, FONTS } from '@/utils/theme';

const buttonVariants = cva(
  'flex-row items-center justify-center disabled:opacity-50 active:opacity-70',
  {
    variants: {
      variant: {
        default: '',
        accent: '',
        destructive: '',
        outline: 'border',
        secondary: 'border',
        ghost: '',
        link: '',
      },
      size: {
        default: 'h-12 px-5 rounded-[4px]',
        cta: 'w-full h-14 px-5 rounded-[4px]',
        sm: 'h-10 px-4 rounded-[4px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const variantStyles: Record<string, { bg: string; fg: string; border?: string }> = {
  default: { bg: C.ink, fg: C.textOnInk },
  accent: { bg: C.red, fg: C.textOnInk },
  destructive: { bg: C.red, fg: C.textOnInk },
  outline: { bg: 'transparent', fg: C.text, border: C.ink },
  secondary: { bg: C.paperHi, fg: C.text, border: C.rule },
  ghost: { bg: 'transparent', fg: C.text },
  link: { bg: 'transparent', fg: C.red },
};

type ButtonProps = TouchableOpacityProps &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    textClassName?: string;
    children: React.ReactNode;
  };

function Button({
  className,
  variant = 'default',
  size = 'default',
  children,
  style,
  ...props
}: ButtonProps) {
  const v = variantStyles[variant ?? 'default'];
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size, className }))}
      style={[
        { backgroundColor: v.bg, borderColor: v.border ?? 'transparent' },
        style as any,
      ]}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          style={{
            fontFamily: FONTS.monoBold,
            color: v.fg,
            fontSize: 11,
            letterSpacing: 1.76,
            textTransform: 'uppercase',
          }}
        >
          {children}
        </Text>
      ) : (
        <View
          className="flex-row items-center justify-center gap-2"
          style={{ flexDirection: 'row' }}
        >
          {children}
        </View>
      )}
    </Pressable>
  );
}

export { Button, buttonVariants };
