import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OfflineBannerProps {
  visible: boolean;
}

/**
 * Non-blocking Offline Banner
 * Informs the user that the app is operating offline, while clarifying that
 * attendance check-in remains fully operational due to local persistence.
 */
export const OfflineBanner: React.FC<OfflineBannerProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.statusDot} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Offline Mode</Text>
          <Text style={styles.subtitle}>
            Local GPS tracking & check-ins work without internet.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF4E5',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE2B8',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ED6C02',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A3B00',
  },
  subtitle: {
    fontSize: 11,
    color: '#8A3B00',
    marginTop: 1,
  },
});
