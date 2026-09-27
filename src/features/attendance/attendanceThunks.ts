import { createAsyncThunk } from '@reduxjs/toolkit';
import { APP_CONFIG } from '../../constants/config';
import { calculateHaversineDistance } from '../geofence/geofenceUtils';
import { locationService } from '../../services/locationService';
import { storageService } from '../../services/storageService';
import { AttendanceRecord } from '../../types';
import { isSameDay } from '../../utils/dateFormatter';
import type { GeofenceState } from '../geofence/geofenceSlice';
import type { AttendanceState } from './attendanceTypes';

interface ThunkApiState {
  geofence: GeofenceState;
  attendance: AttendanceState;
}

/**
 * Async Thunk: Load attendance history from local persistent storage
 */
export const loadAttendanceRecordsThunk = createAsyncThunk<
  AttendanceRecord[],
  void,
  { rejectValue: string }
>('attendance/loadRecords', async (_, { rejectWithValue }) => {
  try {
    const records = await storageService.getAttendanceRecords();
    return records;
  } catch (error: any) {
    const msg = error?.message || 'Failed to load attendance records';
    return rejectWithValue(msg);
  }
});

/**
 * Async Thunk: Perform Attendance Check-In with real-time coordinate re-validation
 */
export const checkInThunk = createAsyncThunk<
  AttendanceRecord,
  void,
  { state: ThunkApiState; rejectValue: string }
>('attendance/checkIn', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const office = state.geofence.officeLocation;
    const radius = state.geofence.radiusMeters;
    const records = state.attendance.records;

    // 1. Prevent duplicate check-in for the current day if configured
    if (APP_CONFIG.PREVENT_DUPLICATE_DAILY_CHECKIN) {
      const todayIso = new Date().toISOString();
      const alreadyCheckedInToday = records.some((r: AttendanceRecord) => isSameDay(r.timestamp, todayIso));

      if (alreadyCheckedInToday) {
        return rejectWithValue('You have already checked in for today.');
      }
    }

    // 2. Fetch fresh, high-accuracy GPS position at time of press (do NOT trust stale state)
    let freshCoords;
    try {
      freshCoords = await locationService.getCurrentPosition();
    } catch {
      return rejectWithValue('Unable to acquire current GPS location. Please check your GPS.');
    }

    // 3. Re-calculate exact distance using Haversine formula
    const distanceMeters = calculateHaversineDistance(
      { latitude: freshCoords.latitude, longitude: freshCoords.longitude },
      { latitude: office.latitude, longitude: office.longitude }
    );

    // 4. Strict geofence perimeter check
    if (distanceMeters > radius) {
      return rejectWithValue(
        `Outside geofence: You are ${distanceMeters}m away from ${office.name}. Required: within ${radius}m.`
      );
    }

    // 5. Construct valid attendance record
    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      latitude: freshCoords.latitude,
      longitude: freshCoords.longitude,
      accuracy: freshCoords.accuracy ?? null,
      distanceFromOfficeMeters: distanceMeters,
      status: 'success',
      officeName: office.name,
    };

    // 6. Persist to AsyncStorage
    await storageService.appendAttendanceRecord(newRecord);

    return newRecord;
  } catch (error: any) {
    const message = error?.message || 'Check-in failed unexpectedly';
    return rejectWithValue(message);
  }
});

/**
 * Async Thunk: Clear attendance history (for debug / reset)
 */
export const clearAttendanceHistoryThunk = createAsyncThunk(
  'attendance/clearHistory',
  async () => {
    await storageService.clearAttendanceRecords();
    return [];
  }
);
