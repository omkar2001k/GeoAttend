import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../app/store';
import {
  clearAttendanceHistoryThunk,
  loadAttendanceRecordsThunk,
} from '../../features/attendance/attendanceThunks';
import { AttendanceListItem } from './components/AttendanceListItem';
import { AttendanceRecord } from '../../types';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export const HistoryScreen: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const { records, isLoading } = useAppSelector((state) => state.attendance);
  const [refreshing, setRefreshing] = useState(false);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(loadAttendanceRecordsThunk());
    setRefreshing(false);
  }, [dispatch]);

  // Clear history dialog (helpful for testing)
  const handleClearHistory = () => {
    Alert.alert(
      'Clear Attendance History',
      'Are you sure you want to reset all local attendance records?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => dispatch(clearAttendanceHistoryThunk()),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: AttendanceRecord }) => (
    <AttendanceListItem record={item} />
  );

  const renderHeader = () => (
    <View>
      {/* Attendance Stats Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Check-Ins</Text>
        <Text style={styles.summaryNumber}>{records.length}</Text>
        <Text style={styles.summarySubtext}>
          Locally persisted on device • Synchronized with Redux
        </Text>
      </View>

      {records.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={styles.listHeader}>Recent Attendance Logs</Text>
          <TouchableOpacity onPress={handleClearHistory}>
            <Text style={{ fontSize: 12, color: '#EF4444', fontWeight: '600' }}>
              Clear Log
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Text style={styles.emptyIcon}>📅</Text>
      </View>
      <Text style={styles.emptyTitle}>No Attendance Records</Text>
      <Text style={styles.emptySubtitle}>
        {"You haven't checked in yet. Move into the office geofence and tap \"Mark Attendance\" on the Home screen."}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={onRefresh}
            tintColor="#2563EB"
            colors={['#2563EB']}
          />
        }
      />
    </SafeAreaView>
  );
};
