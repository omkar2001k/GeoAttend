# GeoAttend 📍🏢

**GeoAttend** is a production-ready React Native (Expo) mobile application (cross-platform for **iOS** & **Android**) that implements real-time GPS tracking and a 100-meter geofenced attendance system.

---

## 🚀 Key Features

1. **Real-Time GPS Tracking**:
   - Continuous location tracking using `watchPosition` with distance filtering (5 meters) and throttling to preserve battery life and eliminate redundant re-renders.
   - Graceful pause/resume during app foregrounding and backgrounding.

2. **Interactive Map Interface (`react-native-maps`)**:
   - Centered on the user's current GPS position with smooth camera animations.
   - Visual distinction between user's live position marker and the designated Office marker.
   - 100-meter circular geofence boundary overlay around the office with real-time color transitions (Emerald green inside zone, Amber outside).

3. **Geofence Calculation (Haversine Formula)**:
   - Strict spherical distance computation using the Haversine formula (`geofenceUtils.ts`).
   - Automatically derives proximity and determines eligibility (`isInsideGeofence`).

4. **Reliable Attendance Check-In**:
   - Check-in button is strictly enabled only when inside the 100m boundary.
   - **Zero-Trust Validation**: Instantaneously queries fresh GPS coordinates at the exact moment of pressing the check-in button to prevent stale-state race conditions.
   - Prevents duplicate check-ins on the same calendar day.

5. **Local Persistence & Offline First**:
   - Redux state rehydration via `redux-persist` and `@react-native-async-storage/async-storage`.
   - Records survive app restarts and reloads.
   - Non-blocking `OfflineBanner` keeps users informed without preventing attendance logging when network is disconnected.

6. **Attendance History**:
   - FlatList view displaying verified check-ins with formatted dates, times, coordinates, and accuracy indicators.
   - Pull-to-refresh and empty-state placeholders.

7. **Error & Edge Case Handling**:
   - Dedicated `PermissionModal` linking directly to device Settings (`Linking.openSettings()`).
   - Dedicated `GpsDisabledModal` for system-level location service toggle detection.
   - Developer Simulation Mode: One-tap button to set current GPS as office location for instant local testing.

---

## 🏗️ Architecture & Folder Structure

```
src/
├── app/
│   ├── store.ts                # configureStore, redux-persist setup, typed hooks
│   └── rootReducer.ts          # root reducer combining slices
├── features/
│   ├── location/
│   │   ├── locationSlice.ts    # currentLocation, tracking & permission states
│   │   ├── locationThunks.ts   # async thunks: requestPermission, start/stop watching
│   │   └── locationTypes.ts
│   ├── geofence/
│   │   ├── geofenceSlice.ts    # office coordinates, radius, proximity evaluation
│   │   └── geofenceUtils.ts    # Haversine distance formula & radius check
│   └── attendance/
│       ├── attendanceSlice.ts  # records list, check-in flow, error & loading states
│       ├── attendanceThunks.ts # checkInThunk (with fresh re-validation), storage persistence
│       └── attendanceTypes.ts
├── navigation/
│   ├── AppNavigator.tsx        # React Navigation Native Stack (Home & History)
│   └── types.ts                # RootStackParamList types
├── screens/
│   ├── HomeScreen/
│   │   ├── HomeScreen.tsx
│   │   ├── components/
│   │   │   ├── MapCard.tsx     # MapView, Circle overlay, custom Markers
│   │   │   ├── CheckInButton.tsx
│   │   │   └── StatusBanner.tsx
│   │   └── styles.ts
│   └── HistoryScreen/
│       ├── HistoryScreen.tsx
│       ├── components/
│       │   └── AttendanceListItem.tsx
│       └── styles.ts
├── components/                 # Shared UI modals & banners
│   ├── PermissionModal.tsx     # Direct link to app settings
│   ├── GpsDisabledModal.tsx    # Prompts user to toggle OS location services
│   └── OfflineBanner.tsx       # Non-blocking connection status
├── services/
│   ├── locationService.ts      # Wraps expo-location watchPositionAsync & getCurrentPositionAsync
│   ├── storageService.ts       # Typed AsyncStorage helpers (get, set, append, clear)
│   └── networkService.ts       # NetInfo subscription and snapshot helpers
├── constants/
│   ├── office.ts               # Hardcoded office coordinates & 100m radius
│   └── config.ts               # App configuration & distance filters
├── hooks/
│   ├── useLocationTracking.ts  # Lifecycle tracking hook
│   ├── useGeofenceStatus.ts    # Proximity & boundary derivation hook
│   └── useNetworkStatus.ts     # Offline detection hook
├── utils/
│   ├── dateFormatter.ts        # Date, time, and same-day formatting helpers
│   └── permissions.ts          # Platform permission requests & settings triggers
└── types/
    └── index.ts                # Shared domain models
```

---

## 🛠️ Setup & Running

### 1. Prerequisites
- Node.js (v18+)
- npm or bun
- Expo Go on physical device OR iOS Simulator / Android Emulator

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
# Start for Mobile (iOS / Android with Expo Go)
npm run start

# Or start directly for Web browser
npm run web
```
- Press `a` for Android Emulator / connected USB device
- Press `i` for iOS Simulator
- Press `w` to open in browser (interactive Geofence radar view)
- Scan QR code with the **Expo Go** app on your physical iPhone or Android device.

### 4. Running Quality Checks
```bash
# Typecheck
npx tsc --noEmit

# Lint
npm run lint
```

---

## 📱 Platform Configuration & Native Permissions

### iOS (`app.json` / `Info.plist`)
The required permission descriptions are pre-configured in `app.json`:
- `NSLocationWhenInUseUsageDescription`: "GeoAttend uses your location to verify your presence at the office for attendance check-in."
- `NSLocationAlwaysAndWhenInUseUsageDescription`: "GeoAttend uses your location to verify geofence entry and automated office attendance."

> **Maps on iOS**: Defaults to Apple Maps via `PROVIDER_DEFAULT` (no API key required).

### Android (`app.json` / `AndroidManifest.xml`)
The required permissions are configured in `app.json`:
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`

> **Google Maps API Key (Optional for production standalone builds)**:
> In `app.json`, add your Google Maps API key under `android.config.googleMaps.apiKey`:
> ```json
> "android": {
>   "config": {
>     "googleMaps": {
>       "apiKey": "YOUR_GOOGLE_MAPS_API_KEY_HERE"
>     }
>   }
> }
> ```

---

## 🧪 Testing Geofence Check-In

Since the default office coordinates are at `(37.78825, -122.4324)`:
1. Open the app on your device or emulator.
2. In the **Developer Testing Mode** panel on the Home Screen, tap **"Set My Location as Office"**.
3. The office will immediately move to your current GPS position, placing you safely inside the 100m geofence!
4. Notice the status change to **"Inside Office Zone"** (green badge).
5. The **"Mark Attendance"** button will now activate. Tap it to record your attendance.
6. Navigate to the **History** screen to inspect your persisted record.
