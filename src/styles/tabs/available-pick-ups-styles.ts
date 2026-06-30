import { StyleSheet } from 'react-native';
import Colors from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  /** WHITE HEADER (fixed) **/
  header: {
    backgroundColor: Colors.white,
    paddingTop: 56,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'LatoBold',
    color: Colors.secondaryGreen,
    paddingHorizontal: 21,
    marginBottom: 8,
  },

  /** SCROLLABLE CONTENT **/
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  /** SECTION TITLE **/
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'LatoBold',
    color: Colors.black,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 115,
    height: 115,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'LatoLight',
    color: '#8F8F8F',
    textAlign: 'center',
  },
});
