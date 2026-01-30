import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  pickupTitle: {
    fontFamily: 'LatoBold',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
    marginLeft: 65,
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
    fontSize: 18,
    fontWeight: '500',
    color: '#3F8061',
    marginBottom: 24,
    fontFamily: 'Lato',
    marginTop: 31,
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
  imageText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily: 'Lato',
    color: '#525454',
    textAlign: 'left',
    paddingBottom: 12,
  },
  notesLabel: {
    fontFamily: 'Lato',
    fontSize: 12,
    fontWeight: '400',
    color: '#6E6E6E',
    paddingLeft: 16,
    paddingTop: 25,
  },
  notesInput: {
    marginLeft: 16,
    minHeight: 50,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 1,
  },

  missedButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.jasmine,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 18,
    padding: 10,
  },
  missedText: {
    color: colors.jasmine,
    fontWeight: '700',
    fontSize: 14,
    fontFamily: 'Lato',
  },

  completeButton: {
    flex: 1,
    backgroundColor: colors.jasmine,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 18,
    padding: 10,
  },
  completeButtonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  completeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Lato',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#525454',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -40, // keeps title centered even with the back button
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
});
