import { StyleSheet } from 'react-native';

export const mdStyles = StyleSheet.create({
    body: { color: '#222', fontSize: 16, lineHeight: 24 },
    heading1: { fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
    heading2: { fontSize: 20, fontWeight: 'bold', marginVertical: 6 },
    strong: { fontWeight: 'bold' },
    em: { fontStyle: 'italic' },
    bullet_list: { marginVertical: 6, paddingLeft: 16 },
    list_item: { flexDirection: 'row', marginVertical: 4 },
    code_inline: {
        backgroundColor: '#f6f8fa',
        fontFamily: 'monospace',
        paddingHorizontal: 4,
        borderRadius: 4
    },
    fence: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 6,
        fontFamily: 'monospace',
        color: '#333'
    },
    blockquote: {
        borderLeftWidth: 4,
        borderLeftColor: '#ccc',
        paddingLeft: 12,
        marginVertical: 8,
        color: '#555'
    }
});
