import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';
import { PermissionStatus } from '../types';

export interface LocationPermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
}

/**
 * Check existing foreground location permissions across iOS and Android
 */
export const checkLocationPermission = async (): Promise<LocationPermissionResult> => {
  try {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

    if (status === Location.PermissionStatus.GRANTED) {
      return { status: 'granted', canAskAgain };
    } else if (status === Location.PermissionStatus.DENIED) {
      return { status: 'denied', canAskAgain };
    }
    return { status: 'undetermined', canAskAgain };
  } catch (error) {
    console.error('Failed to check location permissions:', error);
    return { status: 'undetermined', canAskAgain: true };
  }
};

/**
 * Request foreground location permission with platform awareness
 */
export const requestLocationPermission = async (): Promise<LocationPermissionResult> => {
  try {
    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

    if (status === Location.PermissionStatus.GRANTED) {
      return { status: 'granted', canAskAgain };
    } else if (status === Location.PermissionStatus.DENIED) {
      return { status: 'denied', canAskAgain };
    }
    return { status: 'undetermined', canAskAgain };
  } catch (error) {
    console.error('Failed to request location permissions:', error);
    return { status: 'denied', canAskAgain: false };
  }
};

/**
 * Verify whether GPS / Location Provider is enabled at the OS hardware level
 */
export const isGpsEnabled = async (): Promise<boolean> => {
  try {
    return await Location.hasServicesEnabledAsync();
  } catch (error) {
    console.error('Failed to verify GPS status:', error);
    return false;
  }
};

/**
 * Direct user to device settings if permission was permanently denied
 */
export const openAppSettings = async (): Promise<void> => {
  try {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else {
      await Linking.openSettings();
    }
  } catch (error) {
    console.error('Failed to open app settings:', error);
    // Fallback
    await Linking.openSettings();
  }
};
