import { StyleSheet } from 'react-native';

/** History tab — card layout aligned with my-tasks + mid-fi field rows */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF0',
  },

  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingTop: 58,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
    fontFamily: 'Lato',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 15,
    color: '#525454',
    fontFamily: 'Lato',
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#aeddc4',
    borderWidth: 2,
    borderColor: '#3ea377',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 16,
    color: '#3EA377',
    fontWeight: '600',
    fontFamily: 'LatoBold',
  },
  greeting: {
    color: '#427B60',
    textAlign: 'left',
    fontFamily: 'LatoBold',
    fontSize: 27,
    marginTop: 0,
    minHeight: 32,
  },
  subtext: {
    textAlign: 'left',
    color: '#2D8A60',
    fontSize: 15,
    marginTop: 12,
    fontFamily: 'Lato',
  },

  taskSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  dateGroupHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#151515',
    marginBottom: 14,
    fontFamily: 'LatoBold',
  },

  /** Same row + shadow pattern as my-tasks card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  cardAccent: {
    width: 5,
    alignSelf: 'stretch',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'LatoBold',
  },
  fieldLabel: {
    fontSize: 12,
    color: '#969696',
    marginBottom: 4,
    fontFamily: 'Lato',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#151515',
    marginBottom: 12,
    fontFamily: 'LatoBold',
  },
  buttonFullWidth: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#59AF84',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    paddingVertical: 10,
  },
  buttonFullWidthText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'LatoBold',
    color: '#3C7A59',
  },

  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'LatoLight',
    color: '#8F8F8F',
    textAlign: 'center',
  },
});

export default styles;
