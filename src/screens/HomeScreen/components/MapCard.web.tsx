import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Coordinates } from '../../../types';
import { OfficeCoordinates } from '../../../constants/office';

interface MapCardProps {
  userLocation: Coordinates | null;
  officeLocation: OfficeCoordinates;
  geofenceRadius: number;
  isInsideGeofence: boolean;
  distanceToOffice: number | null;
}

export const MapCard: React.FC<MapCardProps> = ({
  userLocation,
  officeLocation,
  geofenceRadius,
  isInsideGeofence,
  distanceToOffice,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.radarContainer}>
        {/* Radar concentric circular guides */}
        <View style={styles.outerRing} />
        <View style={styles.midRing} />

        {/* 100m Geofence Perimeter */}
        <View
          style={[
            styles.geofenceCircle,
            isInsideGeofence ? styles.geofenceInside : styles.geofenceOutside,
          ]}
        >
          {/* Office Marker */}
          <View style={styles.officePin}>
            <Text style={styles.officeIcon}>🏢</Text>
            <View style={styles.officePill}>
              <Text style={styles.officeNameText}>{officeLocation.name}</Text>
              <Text style={styles.officeRadiusText}>{geofenceRadius}m Perimeter</Text>
            </View>
          </View>

          {/* User Location Marker */}
          {userLocation ? (
            <View
              style={[
                styles.userPin,
                isInsideGeofence ? styles.userInsidePos : styles.userOutsidePos,
              ]}
            >
              <Text style={styles.userDotIcon}>
                {isInsideGeofence ? '🟢' : '🟠'}
              </Text>
              <View style={styles.userPill}>
                <Text style={styles.userNameText}>
                  {isInsideGeofence ? 'You (Inside)' : 'You (Outside)'}
                </Text>
                {distanceToOffice !== null && (
                  <Text style={styles.userDistanceText}>{distanceToOffice}m away</Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.waitingGpsPill}>
              <Text style={styles.waitingGpsText}>Acquiring GPS...</Text>
            </View>
          )}
        </View>

        {/* Radar crosshairs */}
        <View style={styles.radarLineH} />
        <View style={styles.radarLineV} />
      </View>

      {/* Geofence Status Badge */}
      <View style={styles.badgeContainer}>
        <View
          style={[
            styles.statusPill,
            isInsideGeofence ? styles.pillInside : styles.pillOutside,
          ]}
        >
          <View
            style={[
              styles.pillDot,
              isInsideGeofence ? styles.dotInside : styles.dotOutside,
            ]}
          />
          <Text
            style={[
              styles.pillText,
              isInsideGeofence ? styles.textInside : styles.textOutside,
            ]}
          >
            {isInsideGeofence ? 'Inside Office Zone (Eligible)' : 'Outside Office Zone'}
          </Text>
        </View>
      </View>

      {/* Web Simulation Tag */}
      <View style={styles.webTag}>
        <Text style={styles.webTagText}>🌐 Web Live Geofence Radar</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 320,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  radarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#090D16',
  },
  outerRing: {
    position: 'absolute',
    width: 290,
    height: 290,
    borderRadius: 145,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
  },
  midRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
  },
  radarLineH: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
  },
  radarLineV: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
  },
  geofenceCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  geofenceInside: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
  },
  geofenceOutside: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  officePin: {
    alignItems: 'center',
    zIndex: 2,
  },
  officeIcon: {
    fontSize: 26,
  },
  officePill: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  officeNameText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  officeRadiusText: {
    fontSize: 9,
    color: '#94A3B8',
  },
  userPin: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 3,
  },
  userInsidePos: {
    top: 25,
    left: 20,
  },
  userOutsidePos: {
    top: -55,
    right: -45,
  },
  userDotIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  userPill: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  userNameText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  userDistanceText: {
    fontSize: 9,
    color: '#CBD5E1',
  },
  waitingGpsPill: {
    position: 'absolute',
    bottom: -30,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  waitingGpsText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  badgeContainer: {
    position: 'absolute',
    top: 14,
    left: 14,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pillInside: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pillOutside: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dotInside: {
    backgroundColor: '#10B981',
  },
  dotOutside: {
    backgroundColor: '#F59E0B',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  textInside: {
    color: '#065F46',
  },
  textOutside: {
    color: '#92400E',
  },
  webTag: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  webTagText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
