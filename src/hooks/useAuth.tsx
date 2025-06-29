
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS = [
  {
    phone: '11999999999',
    password: 'poupy123',
    userData: {
      id: 'mock-user-1',
      email: 'mock@poupy.com',
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      phone: '11999999999',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {
        provider: 'phone',
        providers: ['phone']
      },
      user_metadata: { 
        full_name: 'Usuário Teste' 
      },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (localStorage)
    const savedUser = localStorage.getItem('poupy-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setSession({ 
        user: userData,
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer'
      } as Session);
    }
    setLoading(false);
  }, []);

  const signIn = async (phone: string, password: string) => {
    console.log('Attempting login with:', phone);
    
    // Remove formatting from phone
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check mock users
    const mockUser = MOCK_USERS.find(u => 
      u.phone === cleanPhone && u.password === password
    );
    
    if (mockUser) {
      console.log('Mock user found, logging in...');
      const userData = mockUser.userData as User;
      
      // Save to localStorage
      localStorage.setItem('poupy-user', JSON.stringify(userData));
      
      // Create mock session
      const mockSession = {
        user: userData,
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer'
      } as Session;
      
      // Update state
      setUser(userData);
      setSession(mockSession);
      
      console.log('Login successful, user set:', userData);
      return { success: true };
    }
    
    console.log('Invalid credentials');
    return { success: false, error: 'Telefone ou senha inválidos' };
  };

  const signOut = async () => {
    localStorage.removeItem('poupy-user');
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
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
