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
    paddingBottom: 38,
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
    paddingHorizontal: 27,
    paddingTop: 28,
    paddingBottom: 50 + 47,
    flex: 1,
    justifyContent: 'space-between',
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
    marginBottom: 6,
  },
  fieldText: {
    fontSize: 17,
    fontFamily: REGULAR,
    color: Colors.black,
    lineHeight: 16,
  },
  fieldTextCapitalize: {
    textTransform: 'capitalize',
  },

  /** LOGOUT BUTTON **/
  logoutButton: {
    backgroundColor: Colors.primaryGreen,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'AvenirBold',
    lineHeight: 30,
  },
});
