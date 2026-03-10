import { StyleSheet, Switch, Text, View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { InputField, PrimaryButton, ScreenContainer, SmallMuted } from '@/components/vitalis-ui';
import { VitalisColors } from '@/constants/vitalis-theme';

export default function SignupScreen() {
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  return (
    <ScreenContainer scroll contentContainerStyle={styles.content}>
      <Text style={styles.title}>Criar sua conta</Text>

      <InputField label="Nome completo" placeholder="Seu nome" />
      <InputField label="E-mail" keyboardType="email-address" placeholder="voce@email.com" />
      <InputField label="Senha" placeholder="••••••••" secureTextEntry />
      <InputField label="Confirmar senha" placeholder="••••••••" secureTextEntry />

      <View style={styles.termsRow}>
        <Switch
          onValueChange={setAcceptedTerms}
          thumbColor="#FFFFFF"
          trackColor={{ false: '#C8D6EA', true: VitalisColors.primary }}
          value={acceptedTerms}
        />
        <SmallMuted>Aceito os termos de uso e a politica de privacidade.</SmallMuted>
      </View>

      <PrimaryButton label="Cadastrar" onPress={() => router.replace('/home')} />
      <PrimaryButton label="Continuar com Google" tone="secondary" />
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
  termsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginVertical: 4,
  },
});
