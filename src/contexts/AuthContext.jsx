import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';

import api from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'helpflow_token';
const USER_KEY = 'helpflow_user';

function getStoredUser() {
    try {
        const token = sessionStorage.getItem(TOKEN_KEY);
        const storedUser = sessionStorage.getItem(USER_KEY);

        if (!token || !storedUser) {
            return null;
        }

        return JSON.parse(storedUser);
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredUser);
    const [token, setToken] = useState(
        () => sessionStorage.getItem(TOKEN_KEY) || null
    );

    const login = useCallback(async (email, senha) => {
        const response = await api.post('/api/auth/login', {
            email,
            senha,
        });

        const data = response.data;

        const receivedToken = data.token || data.accessToken;

        if (!receivedToken) {
            throw new Error('O servidor não retornou um token JWT.');
        }

        const authenticatedUser = data.usuario || data.user || null;

        sessionStorage.setItem(TOKEN_KEY, receivedToken);

        if (authenticatedUser) {
            sessionStorage.setItem(
                USER_KEY,
                JSON.stringify(authenticatedUser)
            );
        } else {
            sessionStorage.removeItem(USER_KEY);
        }

        setToken(receivedToken);
        setUser(authenticatedUser);

        return data;
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);

        setToken(null);
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(token),
            login,
            logout,
        }),
        [user, token, login, logout]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser utilizado dentro de AuthProvider.');
    }

    return context;
}