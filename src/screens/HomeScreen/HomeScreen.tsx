import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { useLocationTracking } from '../../hooks/useLocationTracking';
import { useGeofenceStatus } from '../../hooks/useGeofenceStatus';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { checkInThunk } from '../../features/attendance/attendanceThunks';
import { clearFeedback } from '../../features/attendance/attendanceSlice';
import {
  setCustomOfficeLocation,
  resetOfficeLocation,
} from '../../features/geofence/geofenceSlice';
import { isSameDay } from '../../utils/dateFormatter';
import { APP_CONFIG } from '../../constants/config';

// UI Components
import { MapCard } from './components/MapCard';
import { CheckInButton } from './components/CheckInButton';
import { StatusBanner } from './components/StatusBanner';
import { OfflineBanner } from '../../components/OfflineBanner';
import { PermissionModal } from '../../components/PermissionModal';
import { GpsDisabledModal } from '../../components/GpsDisabledModal';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  // Custom Hooks
  const {
    currentLocation,
    permissionStatus,
    isGpsEnabled,
    trackingStatus,
    error: locationError,
    retryTracking,
  } = useLocationTracking();

  const { officeLocation, radiusMeters, distanceToOffice, isInsideGeofence } =
    useGeofenceStatus();

  const { isOffline } = useNetworkStatus();

  // Redux Attendance State
  const { records, isCheckingIn, lastCheckInStatus, feedbackMessage } =
    useAppSelector((state) => state.attendance);

  // Modals visibility state
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showGpsModal, setShowGpsModal] = useState(false);

  // Check if today already has a recorded check-in
  const todayIso = new Date().toISOString();
  const isAlreadyCheckedInToday =
    APP_CONFIG.PREVENT_DUPLICATE_DAILY_CHECKIN &&
    records.some((record) => isSameDay(record.timestamp, todayIso));

  // Handle Attendance Check-In trigger
  const handleCheckIn = async () => {
    dispatch(clearFeedback());
    try {
      await dispatch(checkInThunk()).unwrap();
    } catch (err: any) {
      // Handled via attendance state feedbackMessage and StatusBanner
      console.log('[HomeScreen] Check-in rejected:', err);
    }
  };

  // Developer simulation helper: set office to current position for testing
  const handleSimulateAtOffice = () => {
    if (currentLocation) {
      dispatch(
        setCustomOfficeLocation({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          name: 'Current Spot (Test Office)',
          address: 'Simulated 100m Office Geofence',
        })
      );
      Alert.alert(
        'Test Geofence Set',
        'Office has been relocated to your exact GPS coordinates. You are now inside the 100m geofence!'
      );
    } else {
      Alert.alert('GPS Waiting', 'Waiting for current GPS fix before simulating.');
    }
  };

  const handleResetOffice = () => {
    dispatch(resetOfficeLocation());
  };

  // Evaluate error modal triggers
  const isPermissionDenied =
    permissionStatus === 'denied' || locationError === 'PERMISSION_DENIED';
  const isGpsOff = !isGpsEnabled || locationError === 'GPS_DISABLED';

  return (
    <SafeAreaView style={styles.safeArea}>
      <OfflineBanner visible={isOffline} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>GeoAttend</Text>
            <Text style={styles.subtitle}>Geofence-Based Attendance</Text>
          </View>
          <TouchableOpacity
            style={styles.historyHeaderButton}
            onPress={() => navigation.navigate('History')}
            activeOpacity={0.7}
          >
            <Text>📋</Text>
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Status Feedback Banner */}
        <StatusBanner
          status={lastCheckInStatus}
          message={feedbackMessage}
          onDismiss={() => dispatch(clearFeedback())}
        />

        {/* Real-time Map View Card */}
        <View style={styles.mapSection}>
          <MapCard
            userLocation={currentLocation}
            officeLocation={officeLocation}
            geofenceRadius={radiusMeters}
            isInsideGeofence={isInsideGeofence}
            distanceToOffice={distanceToOffice}
          />
        </View>

        {/* Telemetry and Proximity Info */}
        <View style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Distance to Office</Text>
              <Text style={[styles.statValue, styles.distanceHighlight]}>
                {distanceToOffice !== null ? `${distanceToOffice} m` : 'Calculating...'}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Geofence Status</Text>
              <Text
                style={[
                  styles.statValue,
                  isInsideGeofence ? styles.insideHighlight : styles.outsideHighlight,
                ]}
              >
                {isInsideGeofence ? 'Inside Zone (Eligible)' : 'Outside Zone'}
              </Text>
            </View>
          </View>

          <View style={styles.officeInfoRow}>
            <Text style={styles.officeIcon}>🏢</Text>
            <View>
              <Text style={styles.officeName}>{officeLocation.name}</Text>
              <Text style={styles.officeAddress}>
                {officeLocation.address} • {radiusMeters}m geofence radius
              </Text>
            </View>
          </View>
        </View>

        {/* Check-In Action Section */}
        <View style={styles.actionSection}>
          <CheckInButton
            isInsideGeofence={isInsideGeofence}
            isLoading={isCheckingIn}
            isAlreadyCheckedIn={isAlreadyCheckedInToday}
            onPress={handleCheckIn}
          />

          {/* Developer Testing Controls */}
          <View style={styles.devHelperBox}>
            <View style={styles.devHelperHeader}>
              <Text style={styles.devHelperTitle}>🛠️ Developer Testing Mode</Text>
              <Text style={{ fontSize: 10, color: '#64748B' }}>
                Status: {trackingStatus}
              </Text>
            </View>
            <View style={styles.devButtonsRow}>
              <TouchableOpacity
                style={styles.devButton}
                onPress={handleSimulateAtOffice}
                activeOpacity={0.7}
              >
                <Text style={styles.devButtonText}>Set My Location as Office</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.devButton}
                onPress={handleResetOffice}
                activeOpacity={0.7}
              >
                <Text style={styles.devButtonText}>Reset Default</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Permission Denied Modal */}
      <PermissionModal
        visible={isPermissionDenied || showPermissionModal}
        onRetry={() => {
          setShowPermissionModal(false);
          retryTracking();
        }}
        onDismiss={() => setShowPermissionModal(false)}
      />

      {/* GPS Disabled Modal */}
      <GpsDisabledModal
        visible={isGpsOff || showGpsModal}
        onRetry={() => {
          setShowGpsModal(false);
          retryTracking();
        }}
        onDismiss={() => setShowGpsModal(false)}
      />
    </SafeAreaView>
  );
};
