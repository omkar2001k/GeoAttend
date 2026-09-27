import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface StatusBannerProps {
  status: 'success' | 'failed' | null;
  message: string | null;
  onDismiss: () => void;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  status,
  message,
  onDismiss,
}) => {
  if (!message || !status) return null;

  const isSuccess = status === 'success';

  return (
    <View
      style={[
        styles.container,
        isSuccess ? styles.successContainer : styles.errorContainer,
      ]}
    >
      <View style={styles.textRow}>
        <Text style={styles.icon}>{isSuccess ? '🎉' : '⚠️'}</Text>
        <Text
          style={[
            styles.messageText,
            isSuccess ? styles.successText : styles.errorText,
          ]}
        >
          {message}
        </Text>
      </View>
      <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={styles.dismissText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  successContainer: {
    backgroundColor: '#ECFDF5',
    borderColor: '#6EE7B7',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  messageText: {
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
  successText: {
    color: '#065F46',
  },
  errorText: {
    color: '#991B1B',
  },
  dismissText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700',
    paddingLeft: 6,
  },
});
