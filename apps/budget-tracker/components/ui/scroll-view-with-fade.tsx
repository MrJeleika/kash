import { LinearGradient } from 'expo-linear-gradient';
import { Platform, ScrollView, ScrollViewProps, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScrollViewWithFadeProps extends ScrollViewProps {
  enableFade?: boolean;
  fadeLength?: number;
  fadeColor?: string;
  fadeOpacity?: number;
}

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const ScrollViewWithFade = ({
  enableFade = true,
  fadeLength = 100,
  fadeColor = '#000000',
  fadeOpacity = 0.6,
  children,
  style,
  ...props
}: ScrollViewWithFadeProps) => {
  const { left, right } = useSafeAreaInsets();

  const solidColor = hexToRgba(fadeColor, fadeOpacity);
  const transparentColor = hexToRgba(fadeColor, 0);

  return (
    <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <ScrollView
        {...props}
        style={[
          { flex: 1, paddingLeft: left + 4, paddingRight: right + 4 },
          style,
        ]}
        fadingEdgeLength={
          Platform.OS === 'android' && enableFade ? fadeLength : 0
        }
      >
        {children}
      </ScrollView>
      {enableFade && (
        <>
          {/* Top fade overlay - from solid (40% opacity) to transparent */}
          <LinearGradient
            colors={[solidColor, transparentColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: fadeLength,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
          {/* Bottom fade overlay - from transparent to solid (40% opacity) */}
          <LinearGradient
            colors={[transparentColor, solidColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: fadeLength,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        </>
      )}
    </View>
  );
};
