import { Platform, StyleSheet } from 'react-native';
import Colors from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 140,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    backgroundColor: '#58ad85',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'LatoBold',
  },

  // Location section
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  locationIcon: {
    width: 24,
    height: 24,
    marginRight: 20,
    tintColor: '#000',
  },
  sectionIcon: {
    marginTop: 4,
    marginRight: 16,
  },
  rowIcon: {
    marginRight: 16,
    marginTop: 1,
  },
  locationContent: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 22,
    fontFamily: 'LatoBold',
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  locationAddress: {
    fontSize: 14,
    fontFamily: 'Lato',
    color: '#525454',
    marginBottom: 16,
  },
  openMapsButton: {
    backgroundColor: Colors.jasmine,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  openMapsButtonText: {
    color: '#FFFFFF',
    fontFamily: 'LatoBold',
    fontSize: 14,
  },

  // Info section
  infoSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 20,
    height: 20,
    marginRight: 20,
    tintColor: '#525454',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'LatoBold',
    color: '#525454',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Lato',
    color: '#000',
    flexWrap: 'wrap',
  },

  // Contact section
  contactSection: {
    marginBottom: 0,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactIcon: {
    width: 20,
    height: 20,
    marginRight: 20,
    tintColor: '#525454',
  },
  contactContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 1,
    marginRight: 12,
  },
  contactLabel: {
    fontSize: 12,
    fontFamily: 'Lato',
    color: '#696969',
  },
  contactValue: {
    fontSize: 14,
    fontFamily: 'LatoBold',
    color: '#000',
  },
  contactName: {
    fontSize: 16,
    fontFamily: 'LatoBold',
    fontWeight: '600',
    color: '#000',
  },
  contactPhone: {
    fontSize: 15,
    fontFamily: 'Lato',
    color: '#525454',
  },
  contactEmail: {
    fontSize: 15,
    fontFamily: 'Lato',
    color: '#58ad85',
    textDecorationLine: 'underline',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 36,
    backgroundColor: Colors.jasmine,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },

  // Description section
  descriptionSection: {
    marginTop: 24,
  },
  descriptionTitle: {
    fontSize: 17,
    fontFamily: 'LatoBold',
    color: '#000',
    marginBottom: 20,
  },
  descriptionRow: {
    marginBottom: 12,
  },
  descriptionLabel: {
    fontSize: 13,
    fontFamily: 'Lato',
    color: '#696969',
    marginBottom: 4,
  },
  descriptionValue: {
    fontSize: 14,
    fontFamily: 'Lato',
    color: '#000',
  },

  // Success banner
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4F4E4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderRadius: 8,
  },
  successIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#059669',
  },
  successText: {
    fontSize: 14,
    fontFamily: 'LatoBold',
    color: '#059669',
  },
  undoButton: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  undoText: {
    fontSize: 12,
    fontFamily: 'Lato',
    color: '#059669',
    textDecorationLine: 'underline',
  },

  // Bottom button
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -4 },
      },
      android: {
        elevation: 10,
      },
    }),
  },
  claimButton: {
    backgroundColor: Colors.jasmine,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  claimButtonText: {
    fontSize: 16,
    fontFamily: 'LatoBold',
    color: '#FFFFFF',
  },
  claimButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  claimButtonTextDisabled: {
    color: '#999',
  },
  progressButton: {
    backgroundColor: '#D4F4E4',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  progressButtonText: {
    fontSize: 16,
    fontFamily: 'LatoBold',
    color: '#059669',
  },

  // Map modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 34,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'LatoBold',
    color: '#000',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalOptionIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
    tintColor: '#525454',
    marginTop: 1,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'Lato',
    color: '#000',
    flex: 1,
  },
  modalCancelButton: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontFamily: 'LatoBold',
    color: '#525454',
  },
});
