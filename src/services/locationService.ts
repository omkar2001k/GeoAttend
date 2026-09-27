import * as Location from 'expo-location';
import { APP_CONFIG } from '../constants/config';
import { Coordinates } from '../types';

export type LocationWatcherCallback = (coords: Coordinates) => void;
export type LocationErrorCallback = (error: Error) => void;

/**
 * Location Service
 * Encapsulates GPS hardware calls, watchPosition subscriptions, and one-off GPS queries.
 */
class LocationService {
  private activeSubscription: Location.LocationSubscription | null = null;

  /**
   * Start real-time position watching with distance filtering and throttle interval
   */
  async startWatching(
    onLocation: LocationWatcherCallback,
    onError?: LocationErrorCallback
  ): Promise<Location.LocationSubscription> {
    // If an existing subscription is active, stop it before starting a new one
    await this.stopWatching();

    try {
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        throw new Error('GPS_DISABLED');
      }

      this.activeSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: APP_CONFIG.LOCATION_DISTANCE_FILTER_METERS, // 5m filter
          timeInterval: APP_CONFIG.LOCATION_INTERVAL_MS, // 5000ms throttle
        },
        (location) => {
          const coords: Coordinates = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            altitude: location.coords.altitude,
            heading: location.coords.heading,
            speed: location.coords.speed,
          };
          onLocation(coords);
        }
      );

      return this.activeSubscription;
    } catch (error: any) {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
      throw error;
    }
  }

  /**
   * Stop active GPS position watch subscription
   */
  async stopWatching(): Promise<void> {
    if (this.activeSubscription) {
      this.activeSubscription.remove();
      this.activeSubscription = null;
    }
  }

  /**
   * Fetch instantaneous high-accuracy position (used for instant re-validation on check-in)
   */
  async getCurrentPosition(): Promise<Coordinates> {
    const isEnabled = await Location.hasServicesEnabledAsync();
    if (!isEnabled) {
      throw new Error('GPS_DISABLED');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      altitude: location.coords.altitude,
      heading: location.coords.heading,
      speed: location.coords.speed,
    };
  }

  /**
   * Check if location services (GPS) are globally enabled on device
   */
  async isLocationServicesEnabled(): Promise<boolean> {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch {
      return false;
    }
  }
}

export const locationService = new LocationService();
