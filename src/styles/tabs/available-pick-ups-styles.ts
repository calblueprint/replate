import { Dimensions, StyleSheet } from 'react-native';
import Colors from '@/styles/colors';

const { width: screenWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  /** HEADER WAVE **/
  headerWave: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: 160,
  },

  /** PROFILE ICON **/
  profileCircle: {
    position: 'absolute',
    top: 77,
    right: 22,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.profileBg,
    borderWidth: 2,
    borderColor: Colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  profileLetter: {
    fontSize: 12,
    color: Colors.primaryGreen,
    fontFamily: 'Lato',
  },

  /** PAGE TITLE **/
  pageTitle: {
    fontSize: 24,
    fontFamily: 'LatoBold',
    color: Colors.secondaryGreen,
    lineHeight: 36,
    paddingHorizontal: 15,
    paddingTop: 73,
    marginBottom: 16,
    zIndex: 1,
  },

  /** SECTION TITLE **/
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'LatoBold',
    color: Colors.secondaryGreen,
    paddingHorizontal: 21,
    marginTop: 16,
    marginBottom: 12,
  },

  /** TASK LIST **/
  taskList: {
    paddingHorizontal: 10,
    gap: 14,
  },

  /** ERROR **/
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#991b1b',
  },
  errorHint: {
    color: '#6b7280',
    marginTop: 4,
    fontSize: 12,
  },

  /** EMPTY STATE **/
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'LatoLight',
    color: '#8F8F8F',
    textAlign: 'center',
  },

  /** LOADING **/
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
});
