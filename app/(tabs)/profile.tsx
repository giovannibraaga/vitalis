import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PrimaryButton, ScreenContainer, SectionCard, SmallMuted } from '@/components/vitalis-ui';
import { VitalisColors } from '@/constants/vitalis-theme';

const options = [
  'Dados pessoais',
  'Medicamentos e horarios',
  'Notificacoes de lembrete',
  'Privacidade e seguranca',
  'Suporte',
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scroll contentContainerStyle={styles.content}>
      <SectionCard style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>MB</Text>
        </View>
        <View>
          <Text style={styles.name}>Marina B.</Text>
          <SmallMuted>Plano Cuidado</SmallMuted>
        </View>
      </SectionCard>

      <View style={styles.list}>
        {options.map((item) => (
          <Pressable key={item} style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
            <Text style={styles.optionText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <PrimaryButton label="Ver analise de adesao" tone="secondary" onPress={() => router.push('/analysis')} />
      <PrimaryButton label="Sair da conta" tone="secondary" onPress={() => router.replace('/welcome')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingTop: 18,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#EAF3FF',
    borderColor: '#C4DCFF',
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: VitalisColors.primary,
    borderRadius: 999,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  name: {
    color: VitalisColors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  list: {
    gap: 10,
  },
  option: {
    backgroundColor: VitalisColors.surface,
    borderColor: VitalisColors.border,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionText: {
    color: VitalisColors.text,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.88,
  },
});
