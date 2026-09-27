import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  historyHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  historyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
    marginLeft: 4,
  },
  mapSection: {
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  distanceHighlight: {
    color: '#2563EB',
  },
  insideHighlight: {
    color: '#10B981',
  },
  outsideHighlight: {
    color: '#EF4444',
  },
  officeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  officeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  officeName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  officeAddress: {
    fontSize: 11,
    color: '#94A3B8',
  },
  actionSection: {
    marginBottom: 16,
  },
  devHelperBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  devHelperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  devHelperTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  devButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  devButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  devButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
});
