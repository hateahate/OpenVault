import { StyleSheet } from 'react-native';

export const ScanQRScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    maskRow: {
        width: '100%',
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    maskCenter: {
        flexDirection: 'row',
    },
    maskSide: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    frame: {
        width: 250,
        height: 250,
        borderColor: '#03DAC5',
        borderWidth: 4,
        borderRadius: 16,
    },
});
