import { Platform, StyleSheet } from 'react-native';
import Colors from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  /** LOADING / ERROR **/
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontFamily: 'Lato',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  errorTitle: {
    color: '#991b1b',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'LatoBold',
  },
  errorMessage: {
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Lato',
  },
  retryButton: {
    backgroundColor: Colors.primaryGreen,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontFamily: 'LatoBold',
  },

  /** HEADER **/
  header: {
    backgroundColor: Colors.white,
    paddingTop: 50,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 54,
    padding: 4,
  },
  backArrow: {
    fontSize: 22,
    color: Colors.black,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'LatoBold',
    color: Colors.black,
    lineHeight: 28,
  },

  /** WHITE CONTENT CARD **/
  contentCard: {
    backgroundColor: Colors.white,
    marginTop: 0,
    paddingHorizontal: 19,
    paddingTop: 28,
    paddingBottom: 120,
    flex: 1,
  },

  /** LOCATION SECTION **/
  locationSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 28,
    gap: 14,
  },
  locationIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  locationContent: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 20,
    fontFamily: 'LatoBold',
    color: Colors.black,
    lineHeight: 24,
    marginBottom: 6,
  },
  locationAddress: {
    fontSize: 15,
    fontFamily: 'Lato',
    fontWeight: '600',
    color: Colors.dateGray,
    marginBottom: 12,
  },
  openMapsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  openMapsText: {
    fontSize: 13,
    fontFamily: 'Lato',
    fontWeight: '500',
    color: Colors.black,
    textDecorationLine: 'underline',
  },

  /** SEPARATOR **/
  separator: {
    height: 1,
    backgroundColor: Colors.missedGray,
    marginBottom: 20,
  },

  /** SCHEDULE SECTION **/
  scheduleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 14,
  },
  scheduleIcon: {
    width: 26,
    height: 25,
    tintColor: '#D9D9D9',
    marginTop: 2,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: 15,
    fontFamily: 'LatoBold',
    color: Colors.black,
    marginBottom: 4,
  },
  scheduleValue: {
    fontSize: 13,
    fontFamily: 'Lato',
    fontWeight: '500',
    color: Colors.dateGray,
  },

  /** CONTACT SECTION **/
  contactSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 14,
  },
  contactIcon: {
    fontSize: 22,
    marginTop: 2,
  },
  contactContent: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontFamily: 'LatoBold',
    color: Colors.black,
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 13,
    fontFamily: 'Lato',
    fontWeight: '500',
    color: Colors.dateGray,
    marginBottom: 8,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 36,
    backgroundColor: Colors.primaryGreen,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** EMAIL SECTION **/
  emailSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 14,
  },
  emailIcon: {
    fontSize: 20,
    color: '#4D1B1B',
  },
  emailText: {
    fontSize: 13,
    fontFamily: 'Lato',
    fontWeight: '500',
    color: Colors.dateGray,
  },

  /** DESCRIPTION SECTION **/
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 15,
    fontFamily: 'Lato',
    color: Colors.black,
    marginBottom: 24,
  },
  descriptionRow: {
    marginBottom: 24,
  },
  descriptionLabel: {
    fontSize: 14,
    fontFamily: 'Lato',
    fontWeight: '500',
    color: '#132429',
    lineHeight: 14,
    marginBottom: 6,
  },
  descriptionValue: {
    fontSize: 13,
    fontFamily: 'Lato',
    color: '#4B5558',
  },

  /** BOTTOM BUTTON **/
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 13,
    paddingVertical: 16,
    paddingBottom: 40,
    backgroundColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -4 },
      },
      android: { elevation: 10 },
    }),
  },
  claimButton: {
    backgroundColor: Colors.primaryGreen,
    height: 47,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimButtonText: {
    fontSize: 14,
    fontFamily: 'LatoBold',
    color: Colors.white,
  },
  progressButton: {
    backgroundColor: Colors.filterGray,
    height: 47,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  progressButtonText: {
    fontSize: 14,
    fontFamily: 'LatoBold',
    color: Colors.white,
  },
  progressIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.white,
  },
});
