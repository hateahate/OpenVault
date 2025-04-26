import { StyleSheet } from 'react-native';

export const AuthenticatorScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
        color: 'gray',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#03DAC5',
    },
});
