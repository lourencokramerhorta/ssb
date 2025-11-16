/**
 * Icon component using Tabler Icons
 * Provides a consistent icon experience across all platforms (iOS, Android, Web)
 */

import * as TablerIcons from '@tabler/icons-react';
import { ComponentType } from 'react';
import { OpaqueColorValue, View, type StyleProp, type ViewStyle } from 'react-native';

export function IconSymbol({
  icon: IconComponent,
  size = 24,
  color,
  style,
  weight,
}: {
  icon: ComponentType<{ size?: number; color?: string; stroke?: number }>;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: 'regular' | 'medium' | 'bold';
}) {
  if (!IconComponent) {
    console.warn('Icon component not provided');
    return null;
  }

  const strokeWidth = weight === 'bold' ? 2.5 : weight === 'medium' ? 2 : 1.5;

  return (
    <View style={[{ width: size, height: size }, style]}>
      <IconComponent
        size={size}
        color={color as string}
        stroke={strokeWidth}
      />
    </View>
  );
}

// Export commonly used icons for convenience
export const Icons = {
  Home: TablerIcons.IconHome,
  Send: TablerIcons.IconSend,
  User: TablerIcons.IconUser,
  Code: TablerIcons.IconCode,
  ChevronRight: TablerIcons.IconChevronRight,
};
