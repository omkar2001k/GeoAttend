import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { openAppSettings } from '../utils/permissions';

interface GpsDisabledModalProps {
  visible: boolean;
  onRetry: () => void;
  onDismiss?: () => void;
}

export const GpsDisabledModal: React.FC<GpsDisabledModalProps> = ({
  visible,
  onRetry,
  onDismiss,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🛰️</Text>
          </View>

          <Text style={styles.title}>Device GPS is Turned Off</Text>

          <Text style={styles.description}>
            {"Your device's location services are disabled at the system level. GeoAttend needs active GPS hardware to verify your attendance within the office geofence."}
          </Text>

          <Text style={styles.instruction}>
            {Platform.OS === 'ios'
              ? 'Swipe down to Control Center or open Settings -> Privacy -> Location Services and turn it ON.'
              : 'Pull down the Quick Settings panel from the top of your screen and turn on Location / GPS.'}
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={openAppSettings}
            >
              <Text style={styles.primaryButtonText}>Open System Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.7}
              onPress={onRetry}
            >
              <Text style={styles.secondaryButtonText}>I Turned It On (Retry)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  instruction: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  buttonGroup: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#D97706',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 14,
  },
});
