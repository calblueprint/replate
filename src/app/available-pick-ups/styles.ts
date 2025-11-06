import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  headerText: {
    fontSize: 16,
    fontWeight: '700',
  },
  AvailablePickupstext: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 40,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  calendarStripContent: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexGrow: 1,
    justifyContent: 'center', // center children horizontally
    alignItems: 'center',
  },
  contentContainer: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 40,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  claimPickupText: {
    fontWeight: 600,
  },
  detailsSections: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f7f7f7',
  },
  dateCard: {
    width: 56,
    height: 72,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 8,
  },
  dateText: {
    fontSize: 10,
  },
  todayText: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '700',
  },
  view: {
    flex: 1,
    padding: 16,
  },
  selectedCard: { borderColor: '#000', backgroundColor: '#000' },
  unselectedCard: { borderColor: '#d1d5db', backgroundColor: '#f3f4f6' },
  pressedCard: { opacity: 0.7 },
  selectedText: { color: 'white' },
  unselectedText: { color: 'black' },
});
