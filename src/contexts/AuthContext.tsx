import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type UserRole = 'admin' | 'dentista' | 'paciente' | 'dev';

export interface AuthUser {
  nome: string;
  role: UserRole;
  id: string;
  dentistaCidade?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (user: AuthUser, token?: string) => void;
  logout: () => void;
  dashboardPath: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUserFromSession(): AuthUser | null {
  const nome = sessionStorage.getItem('usuarioLogado');
  const role = sessionStorage.getItem('userRole') as UserRole | null;
  const id   = sessionStorage.getItem('userId');
  if (!nome || !role) return null;
  return {
    nome,
    role,
    id: id ?? '',
    dentistaCidade: sessionStorage.getItem('dentistaCidade') ?? undefined,
  };
}

function roleToPath(role: UserRole): string {
  if (role === 'admin')    return '/dashboard/admin';
  if (role === 'dentista') return '/dashboard/dentista';
  if (role === 'dev')      return '/dashboard/dentista';
  return '/dashboard/paciente';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readUserFromSession);

  const login = useCallback((u: AuthUser, token?: string) => {
    sessionStorage.setItem('usuarioLogado', u.nome);
    sessionStorage.setItem('userRole',      u.role);
    sessionStorage.setItem('userId',        u.id);
    sessionStorage.setItem('jaLogouAntes',  '1');
    if (u.dentistaCidade) sessionStorage.setItem('dentistaCidade', u.dentistaCidade);
    if (token)            sessionStorage.setItem('authToken', token);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setUser(null);
  }, []);

  const dashboardPath = user ? roleToPath(user.role) : '/login';

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, dashboardPath }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
