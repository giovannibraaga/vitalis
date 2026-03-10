import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PrimaryButton, ScreenContainer, SectionCard } from '@/components/vitalis-ui';
import { VitalisColors } from '@/constants/vitalis-theme';

const bars = [42, 54, 50, 61, 57, 53, 49];
const checkpoints = ['Acima de 80%', 'Atencao em 2 horarios', 'Rotina estavel'];

export default function MonitoringScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scroll contentContainerStyle={styles.content}>
      <Text style={styles.title}>Adesao de medicamentos</Text>

      <SectionCard>
        <Text style={styles.sectionLabel}>Confirmacoes por dia</Text>
        <View style={styles.chart}>
          {bars.map((height, index) => (
            <View key={index} style={[styles.bar, { height }]} />
          ))}
        </View>
      </SectionCard>

      <View style={styles.tags}>
        {checkpoints.map((item) => (
          <View key={item} style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        ))}
      </View>

      <PrimaryButton label="Adicionar medicamento" onPress={() => router.push('/medication')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingTop: 18,
  },
  title: {
    color: VitalisColors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  sectionLabel: {
    color: VitalisColors.muted,
    fontSize: 13,
    marginBottom: 14,
  },
  chart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 10,
    height: 88,
  },
  bar: {
    backgroundColor: '#66A4FF',
    borderRadius: 6,
    flex: 1,
  },
  tags: {
    gap: 10,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF3FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagText: {
    color: VitalisColors.primaryText,
    fontSize: 13,
    fontWeight: '700',
  },
});
