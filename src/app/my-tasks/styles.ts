import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },

  /** HEADER **/
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E7EFE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#427B60',
    fontWeight: '600',
  },
  greeting: {
    color: '#427B60',
    textAlign: 'left',
    fontFamily: 'Lato',
    fontSize: 27,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 32,
    marginTop: 0,
  },
  subtext: {
    textAlign: 'left',
    color: '#206c48',
    fontSize: 15,
    marginTop: 18,
  },
  bold: {
    fontWeight: '600',
  },

  /** TASK SECTION **/
  taskSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#939393',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  cardAccent: {
    width: 4,
    backgroundColor: '#AEDDC4',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  cardAddress: {
    color: '#555555',
    fontSize: 14,
  },
  cardTime: {
    color: '#000000',
    fontSize: 12,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#A8CBB4',
  },
  buttonOutlineText: {
    color: '#4B6253',
  },
  buttonFilled: {
    backgroundColor: '#77C29F',
    borderRadius: 8,
  },
  buttonFilledText: {
    color: '#FFFFFF',
  },
});

export default styles;
