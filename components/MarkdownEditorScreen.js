// components/MarkdownNoteEditor.js
import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    Platform,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from 'react-native-paper';

const ToolbarButton = ({ label, onPress }) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity onPress={onPress} style={[styles.btn, { borderColor: colors.primary }]}>
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{label}</Text>
        </TouchableOpacity>
    );
};

export default function MarkdownNoteEditor({
    initialContent = '',
    onSave,
    initialTitle = '',
    onTitleChange = () => { },
    title
}) {
    const [text, setText] = useState(initialContent);
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [preview, setPreview] = useState(false);

    const wrap = (marker, suffix = marker) => {
        const { start, end } = selection;
        const before = text.slice(0, start);
        const middle = text.slice(start, end);
        const after = text.slice(end);
        const newText = before + marker + middle + suffix + after;
        const cursor = end + marker.length + suffix.length;
        setText(newText);
        setSelection({ start: cursor, end: cursor });
    };

    const insertAtLine = (prefix) => {
        const { start } = selection;
        const lines = text.split('\n');
        let count = 0, idx = 0;
        for (let i = 0; i < lines.length; i++) {
            if (count + lines[i].length >= start) { idx = i; break; }
            count += lines[i].length + 1;
        }
        lines[idx] = prefix + lines[idx];
        setText(lines.join('\n'));
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={title}
                onChangeText={onTitleChange}
                placeholder="Заголовок"
                style={[styles.input, styles.title]}
                mode="outlined"
            />

            <View style={styles.toolbar}>
                <ToolbarButton label="B" onPress={() => wrap('**')} />
                <ToolbarButton label="I" onPress={() => wrap('_')} />
                <ToolbarButton label="H1" onPress={() => insertAtLine('# ')} />
                <ToolbarButton label="•" onPress={() => insertAtLine('- ')} />
                <ToolbarButton label={preview ? '✎' : '👁'} onPress={() => setPreview(!preview)} />
            </View>

            {preview ? (
                <View style={styles.preview}>
                    <Markdown>{text || '_Нет содержимого_'}</Markdown>
                </View>
            ) : (
                <TextInput
                    style={[styles.input, styles.editor]}
                    multiline
                    value={text}
                    onChangeText={setText}
                    placeholder="Введите текст заметки..."
                    textAlignVertical="top"
                    selection={selection}
                    onSelectionChange={({ nativeEvent: { selection } }) => setSelection(selection)}
                />
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={() => onSave(text)}>
                <Text style={styles.saveText}>Сохранить</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        marginBottom: 12,
    },
    title: { fontSize: 18, fontWeight: 'bold' },
    editor: { flex: 1, minHeight: 200 },
    toolbar: {
        flexDirection: 'row',
        marginBottom: 8,
        justifyContent: 'space-around',
    },
    btn: {
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    preview: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        padding: 8,
        backgroundColor: '#FAFAFA',
    },
    saveBtn: {
        backgroundColor: '#6200ee',
        borderRadius: 4,
        padding: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    saveText: { color: 'white', fontWeight: 'bold' },
});
