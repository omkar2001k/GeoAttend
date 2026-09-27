import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { Coordinates } from '../../../types';
import { OfficeCoordinates } from '../../../constants/office';

// Safely require react-native-maps only on native platforms (iOS / Android)
// This prevents Web from attempting to load native Fabric codegen components
let MapView: any = null;
let Marker: any = null;
let Circle: any = null;
let PROVIDER_DEFAULT: any = null;

if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Maps = require('react-native-maps');
    MapView = Maps.default ?? Maps;
    Marker = Maps.Marker;
    Circle = Maps.Circle;
    PROVIDER_DEFAULT = Maps.PROVIDER_DEFAULT;
  } catch (err) {
    console.warn('[MapCard] Could not load native react-native-maps:', err);
  }
}

interface MapCardProps {
  userLocation: Coordinates | null;
  officeLocation: OfficeCoordinates;
  geofenceRadius: number;
  isInsideGeofence: boolean;
  distanceToOffice: number | null;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class MapErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('[MapCard] Map error caught, using radar view fallback:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const NativeMapViewComponent: React.FC<MapCardProps> = ({
  userLocation,
  officeLocation,
  geofenceRadius,
  isInsideGeofence,
  distanceToOffice,
}) => {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (userLocation && mapRef.current?.animateToRegion) {
      try {
        mapRef.current.animateToRegion(
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          800
        );
      } catch (e) {
        console.warn('animateToRegion warning:', e);
      }
    }
  }, [userLocation]);

  const recenterMap = () => {
    if (!mapRef.current?.animateToRegion) return;
    try {
      if (userLocation) {
        mapRef.current.animateToRegion(
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.004,
            longitudeDelta: 0.004,
          },
          600
        );
      } else {
        mapRef.current.animateToRegion(
          {
            latitude: officeLocation.latitude,
            longitude: officeLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          600
        );
      }
    } catch (e) {
      console.warn('recenterMap warning:', e);
    }
  };

  const initialRegion = {
    latitude: userLocation?.latitude ?? officeLocation.latitude,
    longitude: userLocation?.longitude ?? officeLocation.longitude,
    latitudeDelta: 0.006,
    longitudeDelta: 0.006,
  };

  // If MapView failed to load or on Web, fallback
  if (!MapView || Platform.OS === 'web') {
    return (
      <RadarFallbackView
        userLocation={userLocation}
        officeLocation={officeLocation}
        geofenceRadius={geofenceRadius}
        isInsideGeofence={isInsideGeofence}
        distanceToOffice={distanceToOffice}
      />
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsCompass={true}
        loadingEnabled={true}
      >
        <Circle
          center={{
            latitude: officeLocation.latitude,
            longitude: officeLocation.longitude,
          }}
          radius={geofenceRadius}
          strokeWidth={2}
          strokeColor={isInsideGeofence ? 'rgba(16, 185, 129, 0.9)' : 'rgba(37, 99, 235, 0.8)'}
          fillColor={
            isInsideGeofence
              ? 'rgba(16, 185, 129, 0.18)'
              : 'rgba(37, 99, 235, 0.15)'
          }
        />

        <Marker
          coordinate={{
            latitude: officeLocation.latitude,
            longitude: officeLocation.longitude,
          }}
          title={officeLocation.name}
          description={`Office Geofence (${geofenceRadius}m radius)`}
          pinColor="#2563EB"
        />

        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Position"
            description={
              distanceToOffice !== null
                ? `${distanceToOffice}m from office (${isInsideGeofence ? 'Inside' : 'Outside'})`
                : 'Current GPS'
            }
            pinColor={isInsideGeofence ? '#10B981' : '#F59E0B'}
          />
        )}
      </MapView>

      <TouchableOpacity
        style={styles.recenterButton}
        activeOpacity={0.8}
        onPress={recenterMap}
      >
        <Text style={styles.recenterText}>🎯</Text>
      </TouchableOpacity>

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
            {isInsideGeofence ? 'Inside Office Zone' : 'Outside Office Zone'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const RadarFallbackView: React.FC<MapCardProps> = ({
  userLocation,
  officeLocation,
  geofenceRadius,
  isInsideGeofence,
  distanceToOffice,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.radarContainer}>
        <View style={styles.outerRing} />
        <View style={styles.midRing} />

        <View
          style={[
            styles.geofenceCircle,
            isInsideGeofence ? styles.geofenceInside : styles.geofenceOutside,
          ]}
        >
          <View style={styles.officePin}>
            <Text style={{ fontSize: 26 }}>🏢</Text>
            <View style={styles.officePill}>
              <Text style={styles.officeNameText}>{officeLocation.name}</Text>
              <Text style={styles.officeRadiusText}>{geofenceRadius}m Perimeter</Text>
            </View>
          </View>

          {userLocation ? (
            <View
              style={[
                styles.userPin,
                isInsideGeofence ? styles.userInsidePos : styles.userOutsidePos,
              ]}
            >
              <Text style={{ fontSize: 18, marginBottom: 2 }}>
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

        <View style={styles.radarLineH} />
        <View style={styles.radarLineV} />
      </View>

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
            {isInsideGeofence ? 'Inside Office Zone' : 'Outside Office Zone'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const MapCard: React.FC<MapCardProps> = (props) => {
  return (
    <MapErrorBoundary fallback={<RadarFallbackView {...props} />}>
      <NativeMapViewComponent {...props} />
    </MapErrorBoundary>
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
  map: {
    ...StyleSheet.absoluteFill,
  },
  recenterButton: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  recenterText: {
    fontSize: 18,
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
    shadowOpacity: 0.1,
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
});
