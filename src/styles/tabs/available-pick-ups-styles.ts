import { Platform, StyleSheet } from 'react-native';
import Colors from '@/styles/colors';

export const styles = StyleSheet.create({
  error: {
    padding: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    marginTop: 16,
  },
  // header
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingTop: 58,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#D8E0E9',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
    fontFamily: 'Lato',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 15,
    color: '#525454',
    fontFamily: 'Lato',
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#aeddc4',
    borderWidth: 2,
    borderColor: '#3ea377',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 16,
    color: '#3EA377',
    fontWeight: '600',
    fontFamily: 'LatoBold',
  },
  greeting: {
    color: '#427B60',
    textAlign: 'left',
    fontFamily: 'LatoBold',
    fontSize: 27,
    height: 32,
  },
  subtext: {
    textAlign: 'left',
    color: '#2D8A60',
    fontSize: 15,
    marginTop: 12,
    fontFamily: 'Lato',
  },
  segmentWrap: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 26,
    marginBottom: 23,
    borderWidth: 1,
    borderColor: '#E4EDFF',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: Colors.jasmine,
    borderRadius: 10,
  },
  segmentBtnInactive: {
    backgroundColor: Colors.white,
  },
  segmentText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Lato',
  },
  segmentTextActive: {
    color: Colors.white,
  },
  segmentTextInactive: {
    color: Colors.black,
  },
  //cards
  pickupCard: {
    marginHorizontal: 16,
    minHeight: 120,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E6EDF7',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 4 },
    }),
  },

  pickupCardTop: {
    height: 39,
    backgroundColor: '#CFF2E199',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9.5,
  },

  clockIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },

  timeText: {
    fontSize: 14,
    fontFamily: 'LatoBold',
    fontWeight: '700',
    color: Colors.black,
  },

  pickupCardBottom: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  pickupLeft: { flex: 1, minWidth: 0 },

  locationText: {
    fontSize: 16,
    fontFamily: 'LatoBold',
    fontWeight: '700',
    color: '#0E0E0E',
  },

  addressText: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'Lato',
    color: '#939393',
  },

  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.jasmine,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  detailsButtonPressed: {
    opacity: 0.8,
  },

  detailsButtonText: {
    color: '#FFFFFF',
    fontFamily: 'LatoBold',
    fontWeight: '700',
    fontSize: 14,
  },

  chevron: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 10,
    marginTop: -1,
  },
  dateHeaderText: {
    marginTop: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    fontSize: 20,
    fontFamily: 'LatoBold',
    fontWeight: '700',
    color: '#427B60',
  },
  contentContainer: {
    paddingBottom: 140,
  },
  claimPickupText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Lato',
    fontWeight: '600',
    color: '#58ad85',
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#EAEEF2',
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontFamily: 'Lato',
  },
  itemSeparator: {
    height: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1F7',
    marginHorizontal: 16,
  },
  //[id] styles
  detailsSections: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f7f7f7',
  },
  view: {
    flex: 1,
    padding: 16,
  },
});
