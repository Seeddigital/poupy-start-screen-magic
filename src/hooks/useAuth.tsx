
import { useState, useEffect, createContext, useContext } from 'react';
import { mockAuth } from '@/services/mockAuth';
import { MockUser } from '@/data/mockData';

interface AuthContextType {
  user: MockUser | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = mockAuth.onAuthStateChange((user) => {
      console.log('Auth state changed:', user?.email);
      setUser(user);
      setSession(user ? mockAuth.getSession() : null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting login with:', email);
    
    try {
      const result = await mockAuth.signIn(email, password);
      
      if (result.success) {
        console.log('Login successful:', result.user?.email);
        return { success: true };
      } else {
        console.log('Login error:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      console.error('Login exception:', error);
      return { success: false, error: 'Erro ao conectar com o servidor' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('Attempting signup with:', email);
    
    try {
      const result = await mockAuth.signUp(email, password, fullName);
      
      if (result.success) {
        console.log('Signup successful:', result.user?.email);
        return { success: true };
      } else {
        console.log('Signup error:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      console.error('Signup exception:', error);
      return { success: false, error: 'Erro ao conectar com o servidor' };
    }
  };

  const signOut = async () => {
    try {
      await mockAuth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
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
