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

  async getCategories(token: string): Promise<OTPResponse & { categories?: any[] }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, categories: data.data };
      } else {
        return { success: false, error: 'Erro ao buscar categorias' };
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  }

  async createExpense(token: string, expenseData: {
    description: string;
    amount: number;
    due_at: string;
    expense_category_id: number;
    expenseable_type: string;
    expenseable_id: number;
  }): Promise<OTPResponse & { expense?: any }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, expense: data };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Erro ao criar despesa' };
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  }

  async getExpense(token: string, id: number): Promise<OTPResponse & { expense?: any }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/expenses/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, expense: data };
      } else {
        return { success: false, error: 'Erro ao buscar despesa' };
      }
    } catch (error) {
      console.error('Error fetching expense:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  }

  async updateExpense(token: string, id: number, expenseData: {
    description: string;
    amount: number;
    due_at: string;
    expense_category_id: number;
    expenseable_type: string;
    expenseable_id: number;
  }): Promise<OTPResponse & { expense?: any }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });

      console.log('URL da requisição:', `${this.apiBaseUrl}/expenses/${id}`);
      console.log('Dados JSON enviados:', JSON.stringify(expenseData, null, 2));
      console.log('Status da resposta:', response.status);

      if (response.ok) {
        // Check if there's a response body
        const text = await response.text();
        let data = null;
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (e) {
            // Response was successful but no JSON content
            data = { message: 'Despesa atualizada com sucesso' };
          }
        }
        return { success: true, expense: data };
      } else {
        // Handle error responses
        let errorMessage = 'Erro ao atualizar despesa';
        try {
          const errorText = await response.text();
          if (errorText) {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          }
        } catch (e) {
          if (response.status === 404) {
            errorMessage = 'Transação não encontrada ou endpoint não disponível';
          } else {
            errorMessage = `Erro ${response.status}: ${response.statusText}`;
          }
        }
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  }

  async deleteExpense(token: string, id: number): Promise<OTPResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Erro ao deletar despesa' };
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  }
}

export const otpService = new OTPService();