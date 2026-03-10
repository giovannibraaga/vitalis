import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { LogoMark, ScreenContainer } from '@/components/vitalis-ui';
import { VitalisColors } from '@/constants/vitalis-theme';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.replace('/welcome')} style={styles.center}>
        <LogoMark />
        <Text style={styles.title}>Vitalis</Text>
        <Text style={styles.subtitle}>Organizar remedios e cuidar com seguranca.</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: VitalisColors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: VitalisColors.text,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 220,
    textAlign: 'center',
  },
});
