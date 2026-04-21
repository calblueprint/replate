import { StyleSheet } from 'react-native';
import Colors from '@/styles/colors';

const REGULAR = 'Lato';
const BOLD = 'LatoBold';

export const myAccountStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  /** PROFILE HEADER **/
  profileHeader: {
    alignItems: 'center',
    paddingTop: 38,
    paddingBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.profileBg,
    borderWidth: 2.5,
    borderColor: Colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 30,
    fontFamily: REGULAR,
    color: Colors.primaryGreen,
  },
  nameDisplay: {
    fontSize: 24,
    fontFamily: REGULAR,
    textAlign: 'center',
    color: Colors.black,
    marginTop: 10,
  },

  /** WHITE CARD AREA **/
  formCard: {
    backgroundColor: Colors.white,
    marginTop: 20,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    flex: 1,
  },

  /** FORM FIELDS **/
  fieldContainer: {
    marginBottom: 24,
  },
  fieldContainerLast: {
    marginBottom: 0,
  },
  fieldLabel: {
    fontSize: 15,
    fontFamily: BOLD,
    color: Colors.secondaryGreen,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 19,
  },
  nameFieldBox: {
    flex: 1,
    borderWidth: 0.7,
    borderColor: Colors.black,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  fieldBox: {
    borderWidth: 0.7,
    borderColor: Colors.black,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  fieldText: {
    fontSize: 17,
    fontFamily: REGULAR,
    fontWeight: '500',
    color: Colors.black,
    lineHeight: 16,
  },
  npoText: {
    fontSize: 17,
    fontFamily: REGULAR,
    fontWeight: '500',
    color: Colors.black,
    lineHeight: 20,
  },

  /** LOGOUT BUTTON **/
  logoutButton: {
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 40,
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 30,
  },
});
