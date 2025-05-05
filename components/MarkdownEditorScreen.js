import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from 'react-native-paper';
import { theme } from '../styles/theme';
import { mdStyles } from '../styles/MarkdownStyles';

const ToolbarButton = ({ label, onPress }) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity style={[styles.btn, { borderColor: colors.primary }]} onPress={onPress}>
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{label}</Text>
        </TouchableOpacity>
    );
};

export default function MarkdownEditorScreen({ initialContent = '', onSave }) {
    const [text, setText] = useState(initialContent);
    const [sel, setSel] = useState({ start: 0, end: 0 });
    const [preview, setPreview] = useState(false);

    useEffect(() => {
        setText(initialContent);
    }, [initialContent]);

    const wrap = (marker) => {
        const { start, end } = sel;
        const before = text.slice(0, start);
        const mid = text.slice(start, end);
        const after = text.slice(end);
        const nt = before + marker + mid + marker + after;
        setText(nt);
        setSel({ start: end + marker.length * 2, end: end + marker.length * 2 });
    };

    const insertLine = (prefix) => {
        const { start } = sel;
        const lines = text.split('\n');
        let cnt = 0, idx = 0;
        for (let i = 0; i < lines.length; i++) {
            if (cnt + lines[i].length >= start) { idx = i; break; }
            cnt += lines[i].length + 1;
        }
        lines[idx] = prefix + lines[idx];
        setText(lines.join('\n'));
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.toolbar}>
                <ToolbarButton label="B" onPress={() => wrap('**')} />
                <ToolbarButton label="I" onPress={() => wrap('_')} />
                <ToolbarButton label="H1" onPress={() => insertLine('# ')} />
                <ToolbarButton label="•" onPress={() => insertLine('- ')} />
                <ToolbarButton label={preview ? '✎' : '👁'} onPress={() => setPreview(!preview)} />
            </View>

            {preview ? (
                <View style={styles.preview}>
                    <Markdown style={mdStyles}>{text || '_Нет содержимого_'}</Markdown>
                </View>
            ) : (
                <TextInput
                    style={[styles.input, styles.editor]}
                    multiline
                    scrollEnabled
                    value={text}
                    onChangeText={setText}
                    placeholder="Введите текст заметки..."
                    textAlignVertical="top"
                    selection={sel}
                    onSelectionChange={e => setSel(e.nativeEvent.selection)}
                />
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={() => onSave(text)}>
                <Text style={styles.saveText}>Сохранить</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: 'white' },
    toolbar: {
        flexDirection: 'row',
        marginBottom: 8,
        justifyContent: 'space-around',
        backgroundColor: 'white',
        zIndex: 10
    },
    btn: {
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        padding: 12,
        backgroundColor: 'white',
        color: '#222'
    },
    editor: { flex: 1, minHeight: 200, marginBottom: 12 },
    preview: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        padding: 8,
        backgroundColor: '#FAFAFA',
        marginBottom: 12
    },
    saveBtn: {
        backgroundColor: theme.colors.primary,
        borderRadius: 4,
        padding: 12,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 30
    },
    saveText: { color: theme.colors.onPrimary, fontWeight: 'bold' }
});
