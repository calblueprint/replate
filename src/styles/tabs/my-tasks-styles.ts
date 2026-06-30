import { StyleSheet } from 'react-native';
import Colors from '@/styles/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  /** WHITE HEADER (fixed) **/
  header: {
    backgroundColor: Colors.white,
    paddingTop: 56,
    paddingBottom: 0,
  },
  date: {
    fontSize: 15,
    color: Colors.dateGray,
    fontFamily: 'Lato',
    marginBottom: 7,
    marginHorizontal: 21,
  },
  greeting: {
    fontSize: 27,
    color: Colors.secondaryGreen,
    fontFamily: 'LatoBold',
    marginBottom: 10,
    marginHorizontal: 21,
  },
  subtext: {
    fontSize: 15,
    color: Colors.cardTitle,
    fontFamily: 'Lato',
    fontWeight: '600',
    lineHeight: 21,
    marginHorizontal: 21,
    marginBottom: 4,
  },
  subtextBold: {
    fontSize: 16,
    fontFamily: 'LatoBlack',
    color: Colors.secondaryGreen,
  },

  /** SCROLLABLE CONTENT **/
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  /** FILTER ROW **/
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
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
  },

  /** EMPTY STATE **/
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    marginTop: 20,
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
    marginTop: 16,
    marginBottom: 8,
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
});

export default styles;
