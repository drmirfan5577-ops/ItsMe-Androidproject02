import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing, Shadow } from '@/constants/theme';
import { WEATHER_DATA } from '@/services/mockData';

interface WeatherWidgetProps {
  compact?: boolean;
}

function WeatherWidget({ compact = false }: WeatherWidgetProps) {
  const w = WEATHER_DATA;

  if (compact) {
    return (
      <View style={styles.compactRow}>
        <Ionicons name="partly-sunny" size={16} color={Colors.gold} />
        <Text style={styles.compactTemp}>{w.temp}°C</Text>
        <Text style={styles.compactCity}>{w.city.split(',')[0]}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.city}>{w.city}</Text>
          <Text style={styles.condition}>{w.condition}</Text>
        </View>
        <View style={styles.tempBox}>
          <Ionicons name="partly-sunny" size={32} color={Colors.gold} />
          <Text style={styles.temp}>{w.temp}°C</Text>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="water-outline" size={14} color={Colors.primary} />
          <Text style={styles.detailText}>{w.humidity}%</Text>
          <Text style={styles.detailLabel}>Humidity</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.detailItem}>
          <Ionicons name="speedometer-outline" size={14} color={Colors.primary} />
          <Text style={styles.detailText}>{w.wind} km/h</Text>
          <Text style={styles.detailLabel}>Wind</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.detailItem}>
          <Ionicons name="eye-outline" size={14} color={Colors.primary} />
          <Text style={styles.detailText}>Good</Text>
          <Text style={styles.detailLabel}>Visibility</Text>
        </View>
      </View>
      <View style={styles.forecast}>
        {w.forecast.map(day => (
          <View key={day.day} style={styles.forecastDay}>
            <Text style={styles.forecastLabel}>{day.day}</Text>
            <Ionicons name="sunny" size={16} color={Colors.gold} />
            <Text style={styles.forecastHigh}>{day.high}°</Text>
            <Text style={styles.forecastLow}>{day.low}°</Text>
          </View>
        ))}
      </View>
      <Text style={styles.mockBadge}>📡 Live Weather (Mocked)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactTemp: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  compactCity: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  city: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  condition: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tempBox: {
    alignItems: 'center',
  },
  temp: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  detailItem: {
    alignItems: 'center',
    gap: 2,
  },
  detailText: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  detailLabel: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  separator: {
    width: 1,
    backgroundColor: Colors.border,
  },
  forecast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  forecastDay: {
    alignItems: 'center',
    gap: 3,
  },
  forecastLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  forecastHigh: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  forecastLow: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  mockBadge: {
    textAlign: 'center',
    fontSize: 10,
    color: Colors.textMuted,
  },
});

export default memo(WeatherWidget);
