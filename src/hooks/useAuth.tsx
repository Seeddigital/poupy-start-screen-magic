
import { useState, useEffect, createContext, useContext } from 'react';
import { mockAuth } from '@/services/mockAuth';
import { otpService } from '@/services/otpService';
import { MockUser } from '@/data/mockData';

interface AuthContextType {
  user: MockUser | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithOTP: (phoneNumber: string, code: string) => Promise<{ success: boolean; error?: string }>;
  sendOTP: (phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há sessão OTP salva
    const otpSession = localStorage.getItem('otp_session');
    if (otpSession) {
      try {
        const sessionData = JSON.parse(otpSession);
        if (sessionData.expires_at > Date.now()) {
          setUser(sessionData.user);
          setSession(sessionData);
          setLoading(false);
          return;
        } else {
          localStorage.removeItem('otp_session');
        }
      } catch (error) {
        localStorage.removeItem('otp_session');
      }
    }

    // Set up auth state listener para mockAuth
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

  const sendOTP = async (phoneNumber: string) => {
    console.log('Sending OTP to:', phoneNumber);
    
    try {
      const result = await otpService.sendOTP(phoneNumber);
      
      if (result.success) {
        console.log('OTP sent successfully');
        return { success: true };
      } else {
        console.log('OTP send error:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      console.error('OTP send exception:', error);
      return { success: false, error: 'Erro ao enviar código' };
    }
  };

  const signInWithOTP = async (phoneNumber: string, code: string) => {
    console.log('Attempting OTP login with:', phoneNumber);
    
    try {
      const result = await otpService.verifyOTP(phoneNumber, code);
      
      if (result.success && result.token) {
        console.log('OTP verification successful, fetching user info...');
        
        // Buscar informações do usuário usando o token
        const userResult = await otpService.getUserInfo(result.token);
        
        if (userResult.success && userResult.user) {
          const mockUser: MockUser = {
            id: userResult.user.user_id?.toString() || phoneNumber,
            email: userResult.user.email || `${phoneNumber}@phone.user`,
            password: '', // Não usado no OTP
            full_name: userResult.user.name || phoneNumber,
            created_at: userResult.user.created_at || new Date().toISOString()
          };
          
          // Criar sessão OTP com expiração de 7 dias
          const otpSession = {
            user: mockUser,
            access_token: result.token,
            expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000)
          };
          
          // Salvar no localStorage
          localStorage.setItem('otp_session', JSON.stringify(otpSession));
          
          // Login bem-sucedido com dados reais do usuário
          setUser(mockUser);
          setSession(otpSession);
          
          console.log('OTP login successful with user:', mockUser.full_name);
          return { success: true };
        } else {
          console.log('Failed to fetch user info:', userResult.error);
          return { success: false, error: 'Erro ao buscar informações do usuário' };
        }
      } else {
        console.log('OTP verification error:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      console.error('OTP login exception:', error);
      return { success: false, error: 'Erro ao verificar código' };
    }
  };

  const signOut = async () => {
    try {
      await mockAuth.signOut();
      localStorage.removeItem('otp_session'); // Limpar sessão OTP também
      setUser(null);
      setSession(null);
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
      signInWithOTP,
      sendOTP,
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
