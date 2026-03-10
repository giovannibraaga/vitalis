import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton, ScreenContainer, SectionCard } from '@/components/vitalis-ui';
import { VitalisColors } from '@/constants/vitalis-theme';

const insights = [
  {
    title: 'Ponto critico',
    body: 'Maior indice de esquecimento no periodo da noite.',
  },
  {
    title: 'Proximo passo',
    body: 'Ative lembrete reforcado e revise horarios com seu medico.',
  },
];

export default function AnalysisScreen() {
  return (
    <ScreenContainer scroll contentContainerStyle={styles.content}>
      <Text style={styles.title}>Analise da rotina</Text>

      <View style={styles.levelCard}>
        <Text style={styles.levelLabel}>Nivel de adesao</Text>
        <Text style={styles.levelValue}>Moderado</Text>
        <Text style={styles.levelBody}>A plataforma nao substitui avaliacao medica.</Text>
      </View>

      {insights.map((item) => (
        <SectionCard key={item.title}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemBody}>{item.body}</Text>
        </SectionCard>
      ))}

      <PrimaryButton label="Compartilhar com profissional" tone="danger" />
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
  },
  levelCard: {
    backgroundColor: VitalisColors.warning,
    borderColor: VitalisColors.warningBorder,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  levelLabel: {
    color: VitalisColors.text,
    fontSize: 13,
    marginBottom: 6,
  },
  levelValue: {
    color: VitalisColors.warningText,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  levelBody: {
    color: '#7A7364',
    fontSize: 13,
    lineHeight: 20,
  },
  itemTitle: {
    color: VitalisColors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  itemBody: {
    color: VitalisColors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
