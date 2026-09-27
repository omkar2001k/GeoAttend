import { AttendanceRecord } from '../../types';

export interface AttendanceState {
  records: AttendanceRecord[];
  isLoading: boolean;
  isCheckingIn: boolean;
  error: string | null;
  lastCheckInStatus: 'success' | 'failed' | null;
  feedbackMessage: string | null;
}
