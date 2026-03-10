import { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { VitalisColors, VitalisRadius, VitalisSpacing } from '@/constants/vitalis-theme';

type ScreenContainerProps = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
};

type ButtonProps = {
  label: string;
  onPress?: () => void;
  tone?: 'primary' | 'secondary' | 'danger';
  style?: StyleProp<ViewStyle>;
};

type InputFieldProps = TextInputProps & {
  label: string;
};

export function ScreenContainer({
  children,
  contentContainerStyle,
  scroll = false,
}: ScreenContainerProps) {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.background}>
        <View style={[styles.glow, styles.glowBlue]} />
        <View style={[styles.glow, styles.glowGreen]} />
        <View style={[styles.glow, styles.glowSoft]} />
        {content}
      </View>
    </SafeAreaView>
  );
}

export function ScreenLabel({ children }: { children: ReactNode }) {
  return (
    <View style={styles.labelPill}>
      <Text style={styles.labelText}>{children}</Text>
    </View>
  );
}

export function LogoMark({ size = 76 }: { size?: number }) {
  return (
    <View style={[styles.logoMark, { width: size, height: size, borderRadius: size / 3.2 }]}>
      <Text style={[styles.logoText, { fontSize: size * 0.42, lineHeight: size * 0.56 }]}>V</Text>
    </View>
  );
}

export function SectionCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PrimaryButton({ label, onPress, tone = 'primary', style }: ButtonProps) {
  const palette =
    tone === 'secondary'
      ? styles.secondaryButton
      : tone === 'danger'
        ? styles.dangerButton
        : styles.primaryButton;
  const textTone =
    tone === 'secondary'
      ? styles.secondaryButtonText
      : tone === 'danger'
        ? styles.dangerButtonText
        : styles.primaryButtonText;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [palette, style, pressed && styles.pressed]}>
      <Text style={textTone}>{label}</Text>
    </Pressable>
  );
}

export function InputField({ label, style, multiline, ...props }: InputFieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        multiline={multiline}
        placeholderTextColor={VitalisColors.muted}
        style={[styles.input, multiline && styles.inputMultiline, style]}
        {...props}
      />
    </View>
  );
}

export function SmallMuted({ children }: { children: ReactNode }) {
  return <Text style={styles.smallMuted}>{children}</Text>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: VitalisColors.background,
  },
  background: {
    flex: 1,
    backgroundColor: VitalisColors.background,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingHorizontal: VitalisSpacing.lg,
    paddingBottom: VitalisSpacing.xxl,
  },
  scrollContent: {
    paddingHorizontal: VitalisSpacing.lg,
    paddingBottom: 120,
    gap: VitalisSpacing.md,
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.28,
  },
  glowBlue: {
    width: 220,
    height: 220,
    backgroundColor: '#87BEFC',
    top: -56,
    right: -44,
  },
  glowGreen: {
    width: 240,
    height: 240,
    backgroundColor: '#82DEAF',
    left: -88,
    top: 240,
  },
  glowSoft: {
    width: 300,
    height: 300,
    backgroundColor: '#FFFFFF',
    left: 40,
    top: 180,
    opacity: 0.6,
  },
  labelPill: {
    alignSelf: 'flex-start',
    backgroundColor: VitalisColors.primarySoft,
    borderColor: '#B9D6FF',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  labelText: {
    color: VitalisColors.muted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  logoMark: {
    alignItems: 'center',
    backgroundColor: VitalisColors.primary,
    justifyContent: 'center',
    shadowColor: VitalisColors.primary,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '400',
  },
  card: {
    backgroundColor: VitalisColors.surface,
    borderColor: VitalisColors.border,
    borderWidth: 1,
    borderRadius: VitalisRadius.lg,
    padding: VitalisSpacing.md,
    shadowColor: '#123860',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 4,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: VitalisColors.primary,
    borderRadius: VitalisRadius.md,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: VitalisSpacing.lg,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: VitalisColors.surfaceAlt,
    borderRadius: VitalisRadius.md,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: VitalisSpacing.lg,
  },
  dangerButton: {
    alignItems: 'center',
    backgroundColor: VitalisColors.danger,
    borderRadius: VitalisRadius.md,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: VitalisSpacing.lg,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButtonText: {
    color: VitalisColors.primaryText,
    fontSize: 15,
    fontWeight: '800',
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.88,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: VitalisColors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: VitalisColors.surface,
    borderColor: '#C8D6EA',
    borderRadius: VitalisRadius.sm,
    borderWidth: 1,
    color: VitalisColors.text,
    fontSize: 14,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputMultiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  smallMuted: {
    color: VitalisColors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
});
