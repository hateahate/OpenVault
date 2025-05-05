import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'authenticator_accounts';

export async function saveAccounts(accounts) {
    try {
        const jsonValue = JSON.stringify(accounts);
        await SecureStore.setItemAsync(STORAGE_KEY, jsonValue);
    } catch (error) {
        console.error('Ошибка сохранения аккаунтов', error);
    }
}

export async function loadAccounts() {
    try {
        const jsonValue = await SecureStore.getItemAsync(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error('Ошибка загрузки аккаунтов', error);
        return [];
    }
}

const NOTES_KEY = 'notes_storage';

export async function saveNotes(notes) {
    try {
        const jsonValue = JSON.stringify(notes);
        await SecureStore.setItemAsync(NOTES_KEY, jsonValue);
    } catch (error) {
        console.error('Ошибка сохранения заметок', error);
    }
}

export async function loadNotes() {
    try {
        const jsonValue = await SecureStore.getItemAsync(NOTES_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error('Ошибка загрузки заметок', error);
        return [];
    }
}

