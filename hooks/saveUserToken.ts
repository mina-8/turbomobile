import * as SecureStore from 'expo-secure-store';

// Save a token
export const saveToken = async (token: any) => {
    try {
        await SecureStore.setItemAsync('auth_token', token);
    } catch (e) {
        console.error("Error saving token", e);
    }
};
// get a token
export const getToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('auth_token');
        return token;
    } catch (e) {
        console.error("Error retrieving token", e);
    }
};
// delete a token
export const deleteToken = async () => {
    try {
        await SecureStore.deleteItemAsync('auth_token');
        console.log("Token deleted successfully");
    } catch (e) {
        console.error("Error deleting token", e);
    }
};