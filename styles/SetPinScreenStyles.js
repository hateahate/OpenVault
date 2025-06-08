import { StyleSheet } from 'react-native';

export const getSetPinScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
    },
    input: {
        marginBottom: 16,
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 16,
        height: 56,
        fontSize: 16,
        color: theme.colors.onSurface,
    },
    button: {
        marginTop: 12,
        borderRadius: 12,
        paddingVertical: 10,
    },
});
