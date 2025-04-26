import { StyleSheet } from 'react-native';

export const AuthenticatorCardStyles = StyleSheet.create({
    card: {
        marginVertical: 8,
        borderRadius: 16,
        elevation: 4,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    cardContent: {
        alignItems: 'center',
        paddingTop: 16,
    },
    serviceName: {
        fontSize: 18,
        marginBottom: 8,
        textAlign: 'center',
    },
    code: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#6200ee',
    },
});
