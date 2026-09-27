import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AttendanceRecord } from '../../types';
import { AttendanceState } from './attendanceTypes';
import {
  checkInThunk,
  clearAttendanceHistoryThunk,
  loadAttendanceRecordsThunk,
} from './attendanceThunks';

const initialState: AttendanceState = {
  records: [],
  isLoading: false,
  isCheckingIn: false,
  error: null,
  lastCheckInStatus: null,
  feedbackMessage: null,
};

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearFeedback: (state) => {
      state.feedbackMessage = null;
      state.lastCheckInStatus = null;
      state.error = null;
    },
    setRecords: (state, action: PayloadAction<AttendanceRecord[]>) => {
      state.records = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Check-In Thunk Lifecycle
    builder
      .addCase(checkInThunk.pending, (state) => {
        state.isCheckingIn = true;
        state.error = null;
        state.feedbackMessage = null;
      })
      .addCase(checkInThunk.fulfilled, (state, action) => {
        state.isCheckingIn = false;
        // Prepend to maintain newest-first order
        state.records = [action.payload, ...state.records];
        state.lastCheckInStatus = 'success';
        state.feedbackMessage = `Checked in successfully at ${action.payload.officeName}!`;
      })
      .addCase(checkInThunk.rejected, (state, action) => {
        state.isCheckingIn = false;
        state.lastCheckInStatus = 'failed';
        state.error = (action.payload as string) || 'Check-in failed';
        state.feedbackMessage = (action.payload as string) || 'Check-in failed';
      });

    // Load History Lifecycle
    builder
      .addCase(loadAttendanceRecordsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadAttendanceRecordsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(loadAttendanceRecordsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to load records';
      });

    // Clear History Lifecycle
    builder.addCase(clearAttendanceHistoryThunk.fulfilled, (state) => {
      state.records = [];
    });
  },
});

export const { clearFeedback, setRecords } = attendanceSlice.actions;

export default attendanceSlice.reducer;
