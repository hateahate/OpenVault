import { StyleSheet } from 'react-native';

export const getNotesScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
        color: theme.colors.onSurfaceVariant,
    },
    card: {
        marginVertical: 8,
        borderRadius: 16,
        elevation: 4,
        backgroundColor: theme.colors.surface,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: theme.colors.primary
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    editBtn: { marginTop: 16 },
});
