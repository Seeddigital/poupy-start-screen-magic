
import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  phone: string;
  authenticated: boolean;
  loginTime: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se existe uma sessão salva
    const checkSession = () => {
      try {
        const savedSession = localStorage.getItem('user_session');
        if (savedSession) {
          const session = JSON.parse(savedSession);
          
          // Verificar se a sessão ainda é válida (por exemplo, menos de 24 horas)
          const loginTime = new Date(session.loginTime);
          const now = new Date();
          const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 3600);
          
          if (hoursDiff < 24 && session.authenticated) {
            setUser(session);
          } else {
            // Sessão expirada
            localStorage.removeItem('user_session');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        localStorage.removeItem('user_session');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (phone: string, password: string) => {
    // Validar credenciais
    const validCredentials = [
      { phone: '11999999999', password: 'poupy123' },
      { phone: '11888888888', password: 'cliente456' },
      // Adicione mais credenciais conforme necessário
    ];

    const isValid = validCredentials.some(
      cred => cred.phone === phone && cred.password === password
    );

    if (!isValid) {
      throw new Error('Telefone ou senha incorretos');
    }

    // Criar sessão
    const userSession = {
      phone,
      authenticated: true,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('user_session', JSON.stringify(userSession));
    setUser(userSession);
  };

  const signOut = async () => {
    localStorage.removeItem('user_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
