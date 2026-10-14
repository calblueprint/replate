import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  stateContainer: {
    backgroundColor: '#FFFFFF',
  },

  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontFamily: 'Lato',
  },

  errorText: {
    color: '#991b1b',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'LatoBold',
  },

  emptyText: {
    color: '#6b7280',
    fontFamily: 'Lato',
  },

  retryButton: {
    backgroundColor: '#58ad85',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#fff',
    fontFamily: 'LatoBold',
  },

  retryTextButton: {
    marginTop: 12,
  },

  retryTextButtonText: {
    color: '#58ad85',
    fontFamily: 'LatoBold',
  },

  partnerErrorCard: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ffd8a8',
    backgroundColor: '#fff8ee',
    borderRadius: 8,
    padding: 10,
  },

  partnerErrorText: {
    color: '#92400e',
    marginBottom: 8,
    fontFamily: 'Lato',
  },

  partnerRetryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffd8a8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  partnerRetryButtonText: {
    color: '#92400e',
    fontFamily: 'LatoBold',
  },

  section: {
    borderColor: '#A9A9A980',
    borderWidth: 0.8,
    borderRadius: 10,
    borderStyle: 'solid',
    justifyContent: 'center',
    paddingHorizontal: 1,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
    fontFamily: 'LatoBold',
    marginTop: 8,
  },

  pickupSummaryCard: {
    marginBottom: 24,
  },
  pickupSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupSummaryDateText: {
    fontSize: 16,
    color: colors.slateGray,
    fontFamily: 'Lato',
    fontWeight: '400',
    lineHeight: 22,
  },
  pickupSummaryAddressText: {
    fontSize: 16,
    fontWeight: '100',
    color: colors.jasmine,
    fontFamily: 'LatoBold',
    lineHeight: 22,
    marginTop: 4,
  },
  pickupSummaryIcon: {
    marginLeft: 8,
  },

  dueDateContainer: {
    marginBottom: 20,
  },
  dueDateLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#696969',
    marginBottom: 12,
    fontFamily: 'LatoBold',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  dueDateText: {
    fontSize: 15,
    color: '#888888',
    fontFamily: 'LatoBold',
    textAlign: 'center',
    lineHeight: 15,
    fontWeight: '400',
  },
  icon: {
    height: 21,
    width: 21,
    marginRight: 3,
  },
  viewButton: {
    backgroundColor: colors.jasmine,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 141,
    marginBottom: 24,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: 'LatoBold',
    fontSize: 12,
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Lato',
    color: '#000000',
    marginBottom: 10,
  },
  photoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    marginBottom: 24,
  },
  photoDescriptionInput: {
    flex: 1,
    marginLeft: 24,
    fontSize: 14,
    fontFamily: 'Lato',
    color: '#000000',
  },
  notesInput: {
    backgroundColor: colors.white,
    borderRadius: 8,
    minHeight: 110,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 14,
    fontFamily: 'Lato',
    color: '#000000',
    textAlignVertical: 'top',
  },

  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.lightBg,
  },

  missedButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  missedText: {
    color: colors.slateGray,
    fontSize: 16,
    fontFamily: 'LatoBold',
  },
  missedButtonDisabled: {
    opacity: 0.6,
  },
  missedTextDisabled: {
    color: colors.navInactive,
    fontSize: 16,
    fontFamily: 'LatoBold',
  },

  completeButton: {
    flex: 1,
    backgroundColor: colors.jasmine,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  completeButtonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  completeText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'LatoBold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: colors.lightBg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'LatoBold',
  },
});
