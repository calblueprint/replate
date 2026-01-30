import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF0',
  },

  /** HEADER **/
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
    color: '#3EA377',
    fontWeight: '600',
  },
  greeting: {
    color: '#427B60',
    textAlign: 'left',
    fontFamily: 'LatoBold',
    fontSize: 27,
    height: 32,
  },
  subtext: {
    textAlign: 'left',
    color: '#2D8A60',
    fontSize: 15,
    marginTop: 12,
    fontFamily: 'Lato',
  },
  bold: {
    fontWeight: '600',
  },

  /** TASK SECTION **/
  taskSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#939393',
    marginBottom: 10,
    fontFamily: 'Lato',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  cardAccent: {
    width: 5,
    backgroundColor: '#71C79F',
    height: 82,
    marginTop: 30,
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151515',
    marginBottom: 6,
    fontFamily: 'Lato',
  },
  cardAddress: {
    color: '#969696',
    fontSize: 15,
    marginBottom: 8,
    fontFamily: 'Lato',
  },
  cardTime: {
    color: '#000000',
    fontSize: 13,
    marginBottom: 16,
    fontFamily: 'Lato',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'LatoBold',
    textAlign: 'center',
    color: '#58AD85',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#59AF84',
    backgroundColor: '#FFFFFF',
  },
  buttonOutlineText: {
    color: '#3C7A59',
  },
  buttonFilled: {
    backgroundColor: '#71C79F',
    borderRadius: 12,
  },
  buttonFilledText: {
    color: '#FFFFFF',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    marginTop: 70,
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
    backgroundColor: '#58AD85',
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
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'LatoBold',
    textAlign: 'center',
  },
});

export default styles;
