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
    paddingBottom: 28,
    backgroundColor: Colors.background,
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
    fontSize: 28,
    fontFamily: REGULAR,
    color: Colors.primaryGreen,
  },
  nameDisplay: {
    fontSize: 22,
    fontFamily: REGULAR,
    textAlign: 'center',
    color: Colors.black,
    marginTop: 12,
    textTransform: 'capitalize',
  },

  /** WHITE CARD AREA **/
  formCard: {
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
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
    fontSize: 12,
    fontFamily: BOLD,
    color: Colors.secondaryGreen,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  fieldText: {
    fontSize: 16,
    fontFamily: REGULAR,
    color: Colors.black,
    lineHeight: 22,
  },
  fieldTextCapitalize: {
    textTransform: 'capitalize',
  },

  /** LOGOUT BUTTON **/
  logoutButton: {
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'LatoBlack',
  },
});
