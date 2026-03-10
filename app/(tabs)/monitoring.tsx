import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PrimaryButton, ScreenContainer, SectionCard } from '@/components/vitalis-ui';
import { VitalisColors } from '@/constants/vitalis-theme';

const periods = ['Hoje', '7 dias', '30 dias'] as const;

const weeklyBars = [
  { day: 'Seg', value: 72 },
  { day: 'Ter', value: 84 },
  { day: 'Qua', value: 78 },
  { day: 'Qui', value: 91 },
  { day: 'Sex', value: 68 },
  { day: 'Sab', value: 75 },
  { day: 'Dom', value: 88 },
];

const metrics = [
  { label: 'Adesao media', value: '82%', tone: 'primary' },
  { label: 'Em atraso', value: '2 doses', tone: 'warning' },
  { label: 'Melhor horario', value: '08:00', tone: 'neutral' },
  { label: 'Horario critico', value: '22:00', tone: 'danger' },
];

const medications = [
  { name: 'Losartana 50mg', adherence: '92%', status: 'Estavel', accent: '#1F9D67' },
  { name: 'Metformina 850mg', adherence: '68%', status: 'Atenção a noite', accent: '#CC4E4E' },
  { name: 'Sinvastatina 20mg', adherence: '81%', status: 'Bom progresso', accent: '#1565D8' },
];

export default function MonitoringScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<(typeof periods)[number]>('7 dias');

  return (
    <ScreenContainer scroll contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Monitoramento</Text>
        <Text style={styles.subtitle}>Acompanhe adesao, atrasos e pontos de ajuste da rotina.</Text>
      </View>

      <View style={styles.periodRow}>
        {periods.map((period) => {
          const selected = period === selectedPeriod;

          return (
            <Pressable
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={({ pressed }) => [
                styles.periodChip,
                selected && styles.periodChipSelected,
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.periodText, selected && styles.periodTextSelected]}>{period}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionCard style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Resumo do periodo</Text>
        <Text style={styles.summaryValue}>Bom progresso geral</Text>
        <Text style={styles.summaryDescription}>
          A adesao subiu 8% em relacao aos 7 dias anteriores, mas o periodo noturno ainda concentra
          a maior parte dos esquecimentos.
        </Text>
      </SectionCard>

      <View style={styles.metricsGrid}>
        {metrics.map((metric) => (
          <SectionCard key={metric.label} style={styles.metricCard}>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text
              style={[
                styles.metricValue,
                metric.tone === 'warning' && styles.metricWarning,
                metric.tone === 'danger' && styles.metricDanger,
                metric.tone === 'neutral' && styles.metricNeutral,
              ]}>
              {metric.value}
            </Text>
          </SectionCard>
        ))}
      </View>

      <SectionCard style={styles.chartCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Confirmacoes por dia</Text>
          <Text style={styles.cardMeta}>{selectedPeriod}</Text>
        </View>

        <View style={styles.chart}>
          {weeklyBars.map((bar) => {
            const isCritical = bar.value < 72;

            return (
              <View key={bar.day} style={styles.barGroup}>
                <Text style={[styles.barValue, isCritical && styles.barValueCritical]}>{bar.value}%</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${bar.value}%` },
                      isCritical && styles.barFillCritical,
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{bar.day}</Text>
              </View>
            );
          })}
        </View>
      </SectionCard>

      <SectionCard style={styles.alertCard}>
        <Text style={styles.alertEyebrow}>Alerta prioritario</Text>
        <Text style={styles.alertTitle}>2 doses perdidas as 22h nesta semana</Text>
        <Text style={styles.alertBody}>
          Vale reforcar o lembrete noturno ou revisar a periodicidade com base na rotina real do
          paciente.
        </Text>
      </SectionCard>

      <SectionCard style={styles.listCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Por medicamento</Text>
          <Text style={styles.cardMeta}>3 ativos monitorados</Text>
        </View>

        <View style={styles.list}>
          {medications.map((item) => (
            <View key={item.name} style={styles.listItem}>
              <View style={[styles.listAccent, { backgroundColor: item.accent }]} />
              <View style={styles.listContent}>
                <View style={styles.listTopRow}>
                  <Text style={styles.listTitle}>{item.name}</Text>
                  <Text style={styles.listValue}>{item.adherence}</Text>
                </View>
                <Text style={styles.listStatus}>{item.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </SectionCard>

      <View style={styles.actions}>
        <PrimaryButton label="Ajustar lembretes" onPress={() => router.push('/analysis')} />
        <PrimaryButton label="Adicionar medicamento" tone="secondary" onPress={() => router.push('/medication')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingTop: 18,
  },
  header: {
    gap: 6,
  },
  title: {
    color: VitalisColors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    color: VitalisColors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  periodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  periodChip: {
    backgroundColor: VitalisColors.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  periodChipSelected: {
    backgroundColor: VitalisColors.primary,
  },
  periodText: {
    color: VitalisColors.primaryText,
    fontSize: 13,
    fontWeight: '800',
  },
  periodTextSelected: {
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#EEF4FF',
    gap: 6,
  },
  summaryLabel: {
    color: VitalisColors.muted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: VitalisColors.primaryText,
    fontSize: 25,
    fontWeight: '800',
  },
  summaryDescription: {
    color: VitalisColors.text,
    fontSize: 14,
    lineHeight: 21,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    gap: 6,
    minWidth: '47%',
    paddingVertical: 14,
  },
  metricLabel: {
    color: VitalisColors.muted,
    fontSize: 12,
  },
  metricValue: {
    color: VitalisColors.primaryText,
    fontSize: 22,
    fontWeight: '800',
  },
  metricWarning: {
    color: '#B97500',
  },
  metricDanger: {
    color: VitalisColors.danger,
  },
  metricNeutral: {
    color: VitalisColors.text,
  },
  chartCard: {
    gap: 16,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: VitalisColors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  cardMeta: {
    color: VitalisColors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  chart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 10,
    height: 164,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  barValue: {
    color: VitalisColors.primaryText,
    fontSize: 11,
    fontWeight: '800',
  },
  barValueCritical: {
    color: VitalisColors.danger,
  },
  barTrack: {
    alignItems: 'center',
    backgroundColor: '#E7EEF8',
    borderRadius: 999,
    height: 110,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: 20,
  },
  barFill: {
    backgroundColor: VitalisColors.primary,
    borderRadius: 999,
    minHeight: 12,
    width: 20,
  },
  barFillCritical: {
    backgroundColor: VitalisColors.danger,
  },
  barLabel: {
    color: VitalisColors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  alertCard: {
    backgroundColor: '#FFF8E8',
    borderColor: '#F0D48B',
    gap: 6,
  },
  alertEyebrow: {
    color: '#8F6812',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  alertTitle: {
    color: VitalisColors.text,
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 26,
  },
  alertBody: {
    color: '#7A7364',
    fontSize: 14,
    lineHeight: 21,
  },
  listCard: {
    gap: 14,
  },
  list: {
    gap: 12,
  },
  listItem: {
    alignItems: 'stretch',
    backgroundColor: VitalisColors.surface,
    borderColor: '#D6E1F1',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  listAccent: {
    width: 6,
  },
  listContent: {
    flex: 1,
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  listTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listTitle: {
    color: VitalisColors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    marginRight: 10,
  },
  listValue: {
    color: VitalisColors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  listStatus: {
    color: VitalisColors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    gap: 12,
    paddingBottom: 12,
  },
  pressed: {
    opacity: 0.88,
  },
});
