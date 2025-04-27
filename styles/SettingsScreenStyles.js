import { StyleSheet } from 'react-native';

export const SettingsScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000', // Все заголовки теперь черные
        marginVertical: 20,
    },
    input: {
        marginVertical: 12,
        backgroundColor: '#f1f1f1',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        marginVertical: 16,
        backgroundColor: '#6200ee',
        borderRadius: 8,
        paddingVertical: 12,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        marginVertical: 16,
        backgroundColor: '#e0e0e0',
        height: 1,
    },
    listItemTitle: {
        fontSize: 16,
        color: '#000', // Все тексты списка теперь черные
        fontWeight: '500',
    },
    disabledText: {
        color: '#999',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    switchLabel: {
        fontSize: 16,
        color: '#000', // Текст переключателей черный
        marginRight: 8,
    },
    sectionContent: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    disabledButton: {
        backgroundColor: '#d1d1d1',
    },
    radioTitle: {
        color: '#000', // Цвет текста радио-кнопок черный
        fontSize: 16,
        fontWeight: '600',
    }
});