import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { InputField, PrimaryButton, ScreenContainer, SectionCard } from '@/components/vitalis-ui';
import { VitalisColors } from '@/constants/vitalis-theme';

const intervals = [6, 8, 12, 24];

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function formatTime(hour: number, minute: number) {
  return `${pad(hour)}:${pad(minute)}`;
}

function shiftTime(hour: number, minute: number, intervalHours: number) {
  const totalMinutes = hour * 60 + minute + intervalHours * 60;
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;

  return {
    hour: Math.floor(normalized / 60),
    minute: normalized % 60,
  };
}

type StepperProps = {
  label: string;
  value: string;
  onDecrease: () => void;
  onIncrease: () => void;
};

function TimeStepper({ label, value, onDecrease, onIncrease }: StepperProps) {
  return (
    <View style={styles.stepper}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable onPress={onDecrease} style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}>
          <Text style={styles.stepperButtonText}>-</Text>
        </Pressable>
        <View style={styles.stepperValueBox}>
          <Text style={styles.stepperValue}>{value}</Text>
        </View>
        <Pressable onPress={onIncrease} style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}>
          <Text style={styles.stepperButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function MedicationScreen() {
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [interval, setInterval] = useState(8);

  const nextDoses = useMemo(() => {
    const second = shiftTime(hour, minute, interval);
    const third = shiftTime(second.hour, second.minute, interval);

    return [
      formatTime(hour, minute),
      formatTime(second.hour, second.minute),
      formatTime(third.hour, third.minute),
    ];
  }, [hour, minute, interval]);

  return (
    <ScreenContainer scroll contentContainerStyle={styles.content}>
      <Text style={styles.title}>Novo medicamento</Text>

      <InputField label="Medicamento" placeholder="Ex: Losartana" />
      <InputField label="Dosagem" placeholder="Ex: 50 mg" />

      <View style={styles.group}>
        <Text style={styles.label}>Horarios</Text>
        <SectionCard style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleTitle}>Horario de inicio</Text>
            <Text style={styles.scheduleTime}>{formatTime(hour, minute)}</Text>
          </View>

          <View style={styles.steppersRow}>
            <TimeStepper
              label="Hora"
              value={pad(hour)}
              onDecrease={() => setHour((current) => (current + 23) % 24)}
              onIncrease={() => setHour((current) => (current + 1) % 24)}
            />
            <TimeStepper
              label="Min"
              value={pad(minute)}
              onDecrease={() => setMinute((current) => (current + 55) % 60)}
              onIncrease={() => setMinute((current) => (current + 5) % 60)}
            />
          </View>

          <View style={styles.periodicityBlock}>
            <Text style={styles.scheduleTitle}>Periodicidade</Text>
            <View style={styles.intervalRow}>
              {intervals.map((option) => {
                const selected = option === interval;

                return (
                  <Pressable
                    key={option}
                    onPress={() => setInterval(option)}
                    style={({ pressed }) => [
                      styles.intervalChip,
                      selected && styles.intervalChipSelected,
                      pressed && styles.pressed,
                    ]}>
                    <Text style={[styles.intervalChipText, selected && styles.intervalChipTextSelected]}>
                      A cada {option}h
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Proximas tomas</Text>
            <Text style={styles.previewTimes}>{nextDoses.join('  •  ')}</Text>
          </View>
        </SectionCard>
      </View>

      <InputField label="Observacoes" multiline placeholder="Ex: tomar apos o almoco" />

      <PrimaryButton label="Salvar medicamento" />

      <SectionCard>
        <Text style={styles.tipTitle}>Resumo</Text>
        <Text style={styles.tipText}>
          Defina a primeira dose e a frequencia para gerar lembretes recorrentes sem precisar
          preencher todos os horarios manualmente.
        </Text>
      </SectionCard>
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
  group: {
    gap: 10,
  },
  label: {
    color: VitalisColors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  scheduleCard: {
    gap: 18,
  },
  scheduleHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleTitle: {
    color: VitalisColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  scheduleTime: {
    color: VitalisColors.primaryText,
    fontSize: 24,
    fontWeight: '800',
  },
  steppersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stepper: {
    flex: 1,
    gap: 8,
  },
  stepperLabel: {
    color: VitalisColors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  stepperControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  stepperButton: {
    alignItems: 'center',
    backgroundColor: VitalisColors.surfaceAlt,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  stepperButtonText: {
    color: VitalisColors.primaryText,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
  },
  stepperValueBox: {
    alignItems: 'center',
    backgroundColor: VitalisColors.surface,
    borderColor: '#C8D6EA',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 52,
  },
  stepperValue: {
    color: VitalisColors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  periodicityBlock: {
    gap: 10,
  },
  intervalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  intervalChip: {
    backgroundColor: VitalisColors.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  intervalChipSelected: {
    backgroundColor: VitalisColors.primary,
  },
  intervalChipText: {
    color: VitalisColors.primaryText,
    fontSize: 13,
    fontWeight: '800',
  },
  intervalChipTextSelected: {
    color: '#FFFFFF',
  },
  previewBox: {
    backgroundColor: '#EAF3FF',
    borderRadius: 14,
    gap: 6,
    padding: 14,
  },
  previewLabel: {
    color: VitalisColors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  previewTimes: {
    color: VitalisColors.text,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  tipTitle: {
    color: VitalisColors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  tipText: {
    color: VitalisColors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  pressed: {
    opacity: 0.88,
  },
});
