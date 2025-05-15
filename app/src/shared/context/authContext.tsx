import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
  useCallback
} from 'react';
import {
  login as apiLogin,
  getUser as apiGetUser,
  logout as apiLogout
} from 'shared/api/authApi';
import { type User } from 'pages/profile/types';
import axios from 'axios';

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  setUser: (user: User | null) => void // Добавляем setUser
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('access_token')
  );

  useEffect(() => {
    if (token) {
      apiGetUser(token)
        .then(setUser)
        .catch(() => {
          setToken(null);
          localStorage.removeItem('access_token');
        });
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setToken(data.access);
    localStorage.setItem('access_token', data.access);
    const userData = await apiGetUser(data.access);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await apiLogout(token);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // eslint-disable-next-line no-console
          console.error('Ошибка при выходе:', error.response?.data || error.message);
        } else {
          // eslint-disable-next-line no-console
          console.error('Неизвестная ошибка при выходе:', error);
        }
      }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
  }, [token]);

  const value = useMemo(() => ({ user, login, setUser, logout }), [user, login, setUser, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
