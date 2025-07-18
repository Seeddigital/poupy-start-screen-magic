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

  async verifyOTP(phoneNumber: string, code: string): Promise<OTPResponse> {
    try {
      // Aqui você pode adicionar a verificação do código
      // Por enquanto, vamos simular que qualquer código de 6 dígitos é válido
      if (code.length === 6 && /^\d+$/.test(code)) {
        return { success: true };
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