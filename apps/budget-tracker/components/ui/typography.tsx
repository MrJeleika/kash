import { Text, TextProps, View, ViewProps } from 'react-native';
import { C, FONTS } from '@/utils/theme';

export interface EyebrowProps extends TextProps {
  children: React.ReactNode;
}

export const Eyebrow = ({ children, style, ...rest }: EyebrowProps) => (
  <Text
    {...rest}
    style={[
      {
        fontFamily: FONTS.monoSemi,
        fontSize: 10,
        lineHeight: 16,
        letterSpacing: 1.4,
        color: C.textMuted,
        textTransform: 'uppercase',
      },
      style,
    ]}
  >
    {children}
  </Text>
);

export interface MonoLabelProps extends TextProps {
  children: React.ReactNode;
  size?: number;
  letterSpacing?: number;
  color?: string;
  bold?: boolean;
}

export const MonoLabel = ({
  children,
  size = 10,
  letterSpacing = 1.4,
  color = C.text,
  bold = false,
  style,
  ...rest
}: MonoLabelProps) => (
  <Text
    {...rest}
    style={[
      {
        fontFamily: bold ? FONTS.monoBold : FONTS.monoSemi,
        fontSize: size,
        lineHeight: Math.round(size * 1.2),
        letterSpacing,
        color,
        textTransform: 'uppercase',
      },
      style,
    ]}
  >
    {children}
  </Text>
);

export interface HeroAmountProps extends ViewProps {
  whole: string;
  cents: string;
  suffix?: string;
  size?: number;
  suffixSize?: number;
  prefix?: string;
}

export const HeroAmount = ({
  whole,
  cents,
  suffix,
  size = 76,
  suffixSize = 14,
  prefix,
  style,
  ...rest
}: HeroAmountProps) => (
  <View
    {...rest}
    className="flex-row items-baseline gap-2"
    style={style}
  >
    {prefix ? (
      <Text
        style={{
          fontFamily: FONTS.serif,
          fontSize: size * 0.7,
          lineHeight: Math.round(size * 0.7 * 1.2),
          color: C.textMuted,
        }}
      >
        {prefix}
      </Text>
    ) : null}
    <Text
      style={{
        fontFamily: FONTS.serif,
        fontSize: size,
        lineHeight: size * 1.1,
        color: C.ink,
        letterSpacing: -size * 0.03,
      }}
    >
      {whole}
    </Text>
    <Text
      style={{
        fontFamily: FONTS.monoSemi,
        fontSize: suffixSize,
        lineHeight: Math.round(suffixSize * 1.2),
        color: C.textMuted,
      }}
    >
      .{cents}
      {suffix ? ` ${suffix}` : ''}
    </Text>
  </View>
);
