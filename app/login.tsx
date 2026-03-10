import { Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { InputField, PrimaryButton, ScreenContainer, SmallMuted } from '@/components/vitalis-ui';
import { VitalisColors } from '@/constants/vitalis-theme';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scroll contentContainerStyle={styles.content}>
      <Text style={styles.title}>Bem-vindo de volta</Text>

      <InputField label="E-mail" keyboardType="email-address" placeholder="voce@email.com" />
      <InputField label="Senha" placeholder="••••••••" secureTextEntry />

      <PrimaryButton label="Entrar" onPress={() => router.replace('/home')} />

      <Pressable>
        <Text style={styles.link}>Esqueci minha senha</Text>
      </Pressable>

      <SmallMuted>Acesso rapido e seguro em poucos segundos.</SmallMuted>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingTop: 18,
  },
  title: {
    color: VitalisColors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 4,
  },
  link: {
    color: VitalisColors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
