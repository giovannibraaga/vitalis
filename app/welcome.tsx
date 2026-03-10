import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PrimaryButton, ScreenContainer, SectionCard } from '@/components/vitalis-ui';
import { VitalisColors } from '@/constants/vitalis-theme';

const highlights = [
  'Proximo horario sempre visivel',
  'Alertas claros de dose e intervalo',
  'Historico para paciente e cuidador',
];

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scroll contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroEyebrow}>Rotina de hoje</Text>
          <Text style={styles.heroTime}>14:00</Text>
        </View>

        <View style={styles.heroMainCard}>
          <Text style={styles.heroMedication}>Losartana 50mg</Text>
          <Text style={styles.heroInstruction}>Tomar apos o almoco com agua.</Text>
        </View>

        <View style={styles.heroFooter}>
          <View style={styles.heroChip}>
            <Text style={styles.heroChipText}>2 lembretes restantes</Text>
          </View>
          <View style={styles.heroChip}>
            <Text style={styles.heroChipText}>6 medicamentos ativos</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>Seu tratamento sem confusao</Text>
      <Text style={styles.description}>
        Cadastre medicamentos, receba lembretes e acompanhe a adesao diaria sem depender de
        planilhas ou memoria.
      </Text>

      <SectionCard style={styles.bulletsCard}>
        {highlights.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </SectionCard>

      <View style={styles.actions}>
        <PrimaryButton label="Criar conta" onPress={() => router.push('/signup')} />
        <PrimaryButton
          label="Entrar"
          onPress={() => router.push('/login')}
          style={styles.secondaryAction}
          tone="secondary"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    paddingTop: 8,
  },
  hero: {
    backgroundColor: '#DCEBFF',
    borderColor: '#C2D9F7',
    borderRadius: 18,
    borderWidth: 1,
    height: 286,
    padding: 20,
    gap: 16,
  },
  heroHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroEyebrow: {
    color: VitalisColors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  heroTime: {
    color: VitalisColors.primaryText,
    fontSize: 22,
    fontWeight: '800',
  },
  heroMainCard: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderColor: '#C2D9F7',
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  heroMedication: {
    color: VitalisColors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  heroInstruction: {
    color: VitalisColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  heroFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
  },
  heroChip: {
    backgroundColor: '#F8FBFF',
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  heroChipText: {
    color: VitalisColors.primaryText,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: VitalisColors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
  },
  description: {
    color: VitalisColors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  bulletsCard: {
    gap: 12,
  },
  bulletRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  bulletDot: {
    backgroundColor: VitalisColors.primary,
    borderRadius: 999,
    height: 8,
    marginTop: 6,
    width: 8,
  },
  bulletText: {
    color: VitalisColors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  actions: {
    gap: 12,
    marginTop: 4,
  },
  secondaryAction: {
    borderWidth: 0,
  },
});
