import { DEFAULT_USER, MockUser } from '@/data/mockData';

interface AuthResult {
  success: boolean;
  error?: string;
  user?: MockUser;
}

interface MockSession {
  user: MockUser;
  access_token: string;
  expires_at: number;
}

class MockAuthService {
  private currentUser: MockUser | null = null;
  private session: MockSession | null = null;
  private listeners: ((user: MockUser | null) => void)[] = [];

  constructor() {
    // Check for existing session in localStorage
    this.initializeSession();
  }

  private initializeSession() {
    const savedSession = localStorage.getItem('mock_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.expires_at > Date.now()) {
          this.session = session;
          this.currentUser = session.user;
        } else {
          localStorage.removeItem('mock_session');
        }
      } catch (error) {
        localStorage.removeItem('mock_session');
      }
    }
  }

  private createSession(user: MockUser): MockSession {
    const session: MockSession = {
      user,
      access_token: `mock_token_${Date.now()}`,
      expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    
    localStorage.setItem('mock_session', JSON.stringify(session));
    return session;
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === DEFAULT_USER.email && password === DEFAULT_USER.password) {
      this.currentUser = DEFAULT_USER;
      this.session = this.createSession(DEFAULT_USER);
      this.notifyListeners();
      return { success: true, user: DEFAULT_USER };
    }

    return { success: false, error: 'Email ou senha incorretos' };
  }

  async signUp(email: string, password: string, fullName: string): Promise<AuthResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For demo purposes, we'll only allow the default user
    if (email === DEFAULT_USER.email) {
      return { success: false, error: 'Este email já está em uso' };
    }

    return { success: false, error: 'Cadastro não disponível no modo demo. Use: teste@email.com / 123456' };
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.session = null;
    localStorage.removeItem('mock_session');
    this.notifyListeners();
  }

  getCurrentUser(): MockUser | null {
    return this.currentUser;
  }

  getSession(): MockSession | null {
    return this.session;
  }

  onAuthStateChange(callback: (user: MockUser | null) => void): () => void {
    this.listeners.push(callback);
    
    // Call immediately with current state
    setTimeout(() => callback(this.currentUser), 0);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export const mockAuth = new MockAuthService();