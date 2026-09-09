import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { useHijriDate } from '@/hooks/useHijriDate';

interface CalendarWidgetProps {
  language?: 'en' | 'ur';
  compact?: boolean;
}

function CalendarWidget({ language = 'en', compact = false }: CalendarWidgetProps) {
  const { timeStr, gregorianStr, hijriStr, hijriUrdu } = useHijriDate();

  const hijriDisplay = (language === 'ur' ? hijriUrdu : hijriStr) || '';

  if (compact) {
    return (
      <View style={styles.compact}>
        <Text style={styles.compactTime}>{timeStr || ''}</Text>
        <Text style={styles.compactDate}>{hijriDisplay}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.9)" />
        <Text style={styles.time}>{timeStr || ''}</Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={11} color={Colors.textSecondary} />
        <Text style={styles.gregorian}>{gregorianStr || ''}</Text>
      </View>
      <View style={[styles.row, styles.hijriRow]}>
        <Text style={styles.hijriIcon}>☪</Text>
        <Text style={styles.hijri}>{hijriDisplay}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  hijriRow: {
    marginTop: 1,
  },
  time: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
  },
  gregorian: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  hijri: {
    fontSize: 10,
    color: 'rgba(255,220,100,0.95)',
    fontWeight: '600',
  },
  hijriIcon: {
    fontSize: 10,
    color: 'rgba(255,220,100,0.95)',
  },
  compact: {
    alignItems: 'flex-end',
  },
  compactTime: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
  },
  compactDate: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
});

export default memo(CalendarWidget);
