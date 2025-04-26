import { loadAccounts, saveAccounts } from '../storage/secureStorage';

export async function fetchAccounts() {
    const data = await loadAccounts();
    return data;
}

export async function deleteAccount(index, accounts) {
    const newAccounts = accounts.filter((_, i) => i !== index);
    await saveAccounts(newAccounts);
    return newAccounts;
}

export async function saveEditedLabel(index, newLabel, accounts) {
    const newAccounts = [...accounts];
    newAccounts[index] = {
        ...newAccounts[index],
        label: newLabel,
    };
    await saveAccounts(newAccounts);
    return newAccounts;
}
