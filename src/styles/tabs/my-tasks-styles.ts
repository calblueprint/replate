import { Dimensions, StyleSheet } from 'react-native';
import Colors from '@/styles/colors';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
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
    height: 200,
  },

  /** PROFILE ICON **/
  profileCircle: {
    position: 'absolute',
    top: 71,
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

  /** WELCOME SECTION **/
  welcomeSection: {
    paddingHorizontal: 21,
    paddingTop: 70,
    marginBottom: 12,
    zIndex: 1,
  },
  date: {
    fontSize: 15,
    color: Colors.dateGray,
    fontFamily: 'Lato',
    marginBottom: 7,
  },
  greeting: {
    fontSize: 27,
    color: Colors.secondaryGreen,
    fontFamily: 'LatoBold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 15,
    color: Colors.cardTitle,
    fontFamily: 'Lato',
    fontWeight: '600',
    lineHeight: 21,
  },
  subtextBold: {
    fontSize: 16,
    fontFamily: 'LatoBold',
    fontWeight: '800',
    color: Colors.secondaryGreen,
  },

  /** FILTER ROW **/
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 16,
    gap: 8,
  },
  filterIcon: {
    width: 12,
    height: 12,
    tintColor: Colors.filterGray,
  },
  filterText: {
    fontSize: 13,
    fontFamily: 'LatoBold',
    color: Colors.filterGray,
    textTransform: 'uppercase',
  },

  /** TASK CARDS CONTAINER **/
  taskListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  /** EMPTY STATE **/
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    marginTop: 40,
  },
  emptyIcon: {
    width: 115,
    height: 115,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'LatoLight',
    color: '#8F8F8F',
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyButton: {
    height: 41,
    paddingHorizontal: 32,
    borderRadius: 10,
    backgroundColor: Colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#1C252C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'LatoBold',
    textAlign: 'center',
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
  },
});

export default styles;
