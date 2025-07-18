interface OTPResponse {
  success: boolean;
  error?: string;
}

class OTPService {
  private baseUrl = 'https://api.poupy.ai/api/otp';

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
}

export const otpService = new OTPService();