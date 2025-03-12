import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const setAuthToken = async (token: string) => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = async () => {
    try {
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        console.log('Current auth token:', token);
        return token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

export const clearAuth = async () => {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_KEY]);
};
