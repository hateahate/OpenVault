import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'authenticator_accounts';

// Сохранить аккаунты
export async function saveAccounts(accounts) {
    try {
        const jsonValue = JSON.stringify(accounts);
        await SecureStore.setItemAsync(STORAGE_KEY, jsonValue);
    } catch (error) {
        console.error('Ошибка сохранения аккаунтов', error);
    }
}

// Загрузить аккаунты
export async function loadAccounts() {
    try {
        const jsonValue = await SecureStore.getItemAsync(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error('Ошибка загрузки аккаунтов', error);
        return [];
    }
}
