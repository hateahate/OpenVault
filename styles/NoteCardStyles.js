import { StyleSheet } from 'react-native';

export const NoteCardStyles = StyleSheet.create({
    card: {
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 16,
        elevation: 2,
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    preview: {
        maxHeight: 60,
        overflow: 'hidden',
    }
});