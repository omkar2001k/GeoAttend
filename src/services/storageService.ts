import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../constants/config';
import { AttendanceRecord } from '../types';

/**
 * Storage Service
 * Provides typed AsyncStorage helpers for persisting and retrieving app data.
 */
export const storageService = {
  /**
   * Generic get item with JSON deserialization
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
    } catch (error) {
      console.error(`[StorageService] Failed to read key: ${key}`, error);
      return null;
    }
  },

  /**
   * Generic set item with JSON serialization
   */
  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error(`[StorageService] Failed to set key: ${key}`, error);
      return false;
    }
  },

  /**
   * Remove item by key
   */
  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[StorageService] Failed to remove key: ${key}`, error);
      return false;
    }
  },

  /**
   * Specialized helper to fetch attendance records sorted newest-first
   */
  async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    try {
      const records = await this.getItem<AttendanceRecord[]>(
        APP_CONFIG.STORAGE_KEYS.ATTENDANCE_RECORDS
      );

      if (!records || !Array.isArray(records)) {
        return [];
      }

      // Sort newest-first (descending timestamp)
      return records.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('[StorageService] Failed to load attendance records:', error);
      return [];
    }
  },

  /**
   * Save complete list of attendance records
   */
  async saveAttendanceRecords(records: AttendanceRecord[]): Promise<boolean> {
    return this.setItem(APP_CONFIG.STORAGE_KEYS.ATTENDANCE_RECORDS, records);
  },

  /**
   * Append a single attendance record to local storage (prepends to stay newest-first)
   */
  async appendAttendanceRecord(record: AttendanceRecord): Promise<AttendanceRecord[]> {
    try {
      const existing = await this.getAttendanceRecords();
      const updated = [record, ...existing];
      await this.saveAttendanceRecords(updated);
      return updated;
    } catch (error) {
      console.error('[StorageService] Failed to append attendance record:', error);
      throw error;
    }
  },

  /**
   * Clear all attendance records (useful for testing & resets)
   */
  async clearAttendanceRecords(): Promise<void> {
    await this.removeItem(APP_CONFIG.STORAGE_KEYS.ATTENDANCE_RECORDS);
  },
};
