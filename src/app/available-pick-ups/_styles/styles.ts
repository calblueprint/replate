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
  availableTasksTitle: {
    fontSize: 28,
    fontFamily: 'LatoMedium',
    fontWeight: '500',
    color: '#2C805B',
    marginLeft: 26,
    marginTop: 27,
    marginBottom: 14,
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
  header: {
    backgroundColor: '#FFFFFF',
    // creates the “header container” separation
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 6,
      },
    }),

    // keeps the shadow from being clipped by the next content
    marginBottom: 14,
  },
  replateTitle: {
    fontSize: 18,
    fontFamily: 'Lato',
    color: '#3EA377',
    fontWeight: '400',
  },
  logo: {
    height: 30,
    width: 30,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center', // vertical centering
    justifyContent: 'center', // horizontal centering
    gap: 5, // space between text & logo
    marginTop: 12,
  },
  //cards
  pickupCard: {
    marginHorizontal: 16,
    height: 106,
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
    fontFamily: 'LatoSemiBold',
    fontWeight: '600',
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
    fontFamily: 'LatoMedium',
    fontWeight: '500',
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
    fontFamily: 'LatoMedium',
    fontWeight: '500',
    color: '#427B60',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  claimPickupText: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Lato',
    fontWeight: '500',
    color: '#8F8F8F',
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
