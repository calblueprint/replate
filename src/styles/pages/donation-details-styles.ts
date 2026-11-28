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
    color: colors.primaryGreen,
    fontFamily: 'LatoBold',
    lineHeight: 22,
    marginTop: 4,
  },
  pickupSummaryIcon: {
    marginLeft: 8,
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
    backgroundColor: colors.primaryGreen,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  completeButtonDisabled: {
    backgroundColor: colors.fillInactive,
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
