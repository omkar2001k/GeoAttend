import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

interface CheckInButtonProps {
  isInsideGeofence: boolean;
  isLoading: boolean;
  isAlreadyCheckedIn: boolean;
  onPress: () => void;
}

export const CheckInButton: React.FC<CheckInButtonProps> = ({
  isInsideGeofence,
  isLoading,
  isAlreadyCheckedIn,
  onPress,
}) => {
  const isEnabled = isInsideGeofence && !isLoading && !isAlreadyCheckedIn;

  const getButtonText = () => {
    if (isLoading) return 'Validating GPS & Checking In...';
    if (isAlreadyCheckedIn) return 'Checked In for Today';
    if (isInsideGeofence) return 'Mark Attendance';
    return 'Check-In Disabled (Outside Office)';
  };

  const getSubText = () => {
    if (isAlreadyCheckedIn) {
      return 'You have successfully logged attendance today';
    }
    if (!isInsideGeofence) {
      return 'Move within the 100m office geofence to check in';
    }
    return 'Tap to record verified GPS attendance';
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[
          styles.button,
          isEnabled ? styles.buttonEnabled : styles.buttonDisabled,
        ]}
        onPress={onPress}
        disabled={!isEnabled}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <View style={styles.content}>
            <Text style={styles.icon}>
              {isAlreadyCheckedIn ? '✅' : isInsideGeofence ? '📌' : '🔒'}
            </Text>
            <Text
              style={[
                styles.buttonText,
                isEnabled ? styles.textEnabled : styles.textDisabled,
              ]}
            >
              {getButtonText()}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.subText}>{getSubText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 12,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonEnabled: {
    backgroundColor: '#10B981',
  },
  buttonDisabled: {
    backgroundColor: '#E2E8F0',
    elevation: 0,
    shadowOpacity: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  textEnabled: {
    color: '#FFFFFF',
  },
  textDisabled: {
    color: '#94A3B8',
  },
  subText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
});
