import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer, SectionCard, SmallMuted } from '@/components/vitalis-ui';
import { VitalisColors } from '@/constants/vitalis-theme';

const stats = [
  { label: 'Proximo', value: '14:00' },
  { label: 'Ativos', value: '6 ativos' },
  { label: 'Confirmados', value: '5 doses' },
  { label: 'Atrasos', value: '1 dose' },
];

const shortcuts = [
  { label: '+ Medicamento', route: '/medication' },
  { label: 'Historico', route: '/history' },
  { label: 'Lembretes', route: '/monitoring' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <Text style={styles.title}>Agenda de hoje</Text>

      <SectionCard style={styles.heroCard}>
        <Text style={styles.eyebrow}>Adesao semanal</Text>
        <Text style={styles.heroTitle}>Bom progresso</Text>
        <SmallMuted>Faltam 2 confirmacoes de toma ate 22h.</SmallMuted>
      </SectionCard>

      <View style={styles.statsGrid}>
        {stats.map((item) => (
          <SectionCard key={item.label} style={styles.statCard}>
            <Text style={styles.statLabel}>{item.label}</Text>
            <Text style={styles.statValue}>{item.value}</Text>
          </SectionCard>
        ))}
      </View>

      <View style={styles.shortcutRow}>
        {shortcuts.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => router.push(item.route as '/medication' | '/history' | '/monitoring')}
            style={({ pressed }) => [styles.shortcut, pressed && styles.pressed]}>
            <Text style={styles.shortcutText}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  title: {
    color: VitalisColors.text,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  heroCard: {
    backgroundColor: '#EEF4FF',
    gap: 6,
  },
  eyebrow: {
    color: VitalisColors.muted,
    fontSize: 13,
  },
  heroTitle: {
    color: VitalisColors.primaryText,
    fontSize: 24,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    minWidth: '47%',
    paddingVertical: 14,
  },
  statLabel: {
    color: VitalisColors.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: VitalisColors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  shortcutRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 'auto',
    paddingBottom: 12,
  },
  shortcut: {
    alignItems: 'center',
    backgroundColor: VitalisColors.surfaceAlt,
    borderRadius: 12,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  shortcutText: {
    color: VitalisColors.primaryText,
    fontSize: 13,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.88,
  },
});
