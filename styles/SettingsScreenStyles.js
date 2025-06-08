import { StyleSheet } from 'react-native';

export const getSettingsScreenStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: theme.colors.background,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.colors.onSurface,
        marginTop: 24,
        marginBottom: 12,
    },
    button: {
        marginTop: 12,
        paddingVertical: 10,
        borderRadius: 12,
    },
    divider: {
        marginVertical: 20,
        height: 1,
        backgroundColor: theme.colors.outlineVariant,
    },
    listItemTitle: {
        fontSize: 16,
        color: theme.colors.onSurfaceVariant,
    },
    radioTitle: {
        fontSize: 16,
        color: theme.colors.onSurfaceVariant,
    },
    footerContainer: {
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        lineHeight: 18,
    },
});
