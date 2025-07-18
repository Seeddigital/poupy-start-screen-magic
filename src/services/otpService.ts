interface OTPResponse {
  success: boolean;
  error?: string;
}

class OTPService {
  private baseUrl = 'https://api.poupy.ai/api/otp';
  private apiBaseUrl = 'https://api.poupy.ai/api';

  async sendOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: phoneNumber
        }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'Erro ao enviar código' };
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  }

  async verifyOTP(phoneNumber: string, code: string): Promise<OTPResponse & { token?: string }> {
    try {
      const response = await fetch('https://api.poupy.ai/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: phoneNumber,
          otp: code
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, token: data.access_token };
      } else {
        return { success: false, error: 'Código inválido' };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  }

  async getUserInfo(token: string): Promise<OTPResponse & { user?: any }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        return { success: true, user };
      } else {
        return { success: false, error: 'Erro ao buscar dados do usuário' };
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  }

  async getExpenses(token: string): Promise<OTPResponse & { expenses?: any[] }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/expenses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, expenses: data.data };
      } else {
        return { success: false, error: 'Erro ao buscar despesas' };
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  }
}

export const otpService = new OTPService();