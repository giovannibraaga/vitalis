import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer, SectionCard } from '@/components/vitalis-ui';
import { VitalisColors } from '@/constants/vitalis-theme';

const historyItems = [
  { date: '02 Mar', body: '6/6 doses confirmadas no dia' },
  { date: '28 Fev', body: 'Esquecimento registrado na dose das 22h' },
  { date: '24 Fev', body: 'Ajuste de horario da Metformina para 19h' },
];

export default function HistoryScreen() {
  return (
    <ScreenContainer scroll contentContainerStyle={styles.content}>
      <Text style={styles.title}>Historico de tomas</Text>

      <View style={styles.filterRow}>
        <Text style={styles.activeFilter}>Ultimos 30 dias</Text>
        <Text style={styles.activeFilter}>Por data</Text>
      </View>

      <View style={styles.list}>
        {historyItems.map((item) => (
          <SectionCard key={item.date} style={styles.itemCard}>
            <Text style={styles.itemDate}>{item.date}</Text>
            <Text style={styles.itemBody}>{item.body}</Text>
          </SectionCard>
        ))}
      </View>
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
  filterRow: {
    backgroundColor: VitalisColors.surfaceAlt,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  activeFilter: {
    color: VitalisColors.primaryText,
    fontSize: 12,
    fontWeight: '800',
  },
  list: {
    gap: 12,
  },
  itemCard: {
    paddingVertical: 14,
  },
  itemDate: {
    color: VitalisColors.primaryText,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
  },
  itemBody: {
    color: VitalisColors.text,
    fontSize: 14,
    lineHeight: 21,
  },
});
