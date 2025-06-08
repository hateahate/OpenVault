import { StyleSheet } from 'react-native';

export const getAuthenticatorScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
        color: theme.colors.onSurfaceVariant,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: theme.colors.primary
    },
});
