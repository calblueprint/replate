import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFBFB' },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  pickupTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#000',
  },

  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#427B60',
    marginBottom: 16,
  },

  dueDateContainer: {
    marginBottom: 20,
  },
  dueDateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6E6E6E',
    marginBottom: 4,
  },
  dueDateText: {
    fontSize: 14,
    color: '#525454',
    marginBottom: 8,
  },
  viewButton: {
    backgroundColor: '#77C29F',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    width: 180,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  imageBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    color: '#9A9A9A',
    fontSize: 15,
  },

  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6E6E6E',
    marginBottom: 6,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    padding: 14,
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  missedButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#77C29F',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  missedText: {
    color: '#427B60',
    fontWeight: '600',
    fontSize: 16,
  },

  completeButton: {
    flex: 1,
    backgroundColor: '#77C29F',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  completeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
