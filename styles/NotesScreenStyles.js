import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const NotesScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#f5f5f5',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
        color: 'gray',
    },
    card: {
        marginVertical: 8,
        borderRadius: 16,
        elevation: 4,
        backgroundColor: 'white',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: theme.colors.primary
    },
});
