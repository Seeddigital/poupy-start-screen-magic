
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { otpService } from '../services/otpService';

interface Goal {
  id: number;
  category_id: number;
  amount: number;
  period: 'monthly' | 'yearly';
  created_at: string;
  updated_at: string;
}

interface CreateGoalData {
  category_id: number;
  amount: number;
  period: 'monthly' | 'yearly';
}

interface UpdateGoalData {
  amount: number;
  period: 'monthly' | 'yearly';
}

const API_BASE_URL = 'https://api.poupy.ai';

const maskToken = (token?: string | null) =>
  token ? `${String(token).slice(0, 6)}...` : 'none';

const assertJsonOrThrow = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.toLowerCase().includes('application/json');
  if (!isJson) {
    const text = await response.text();
    console.error('Goals API responded with non-JSON', {
      status: response.status,
      contentType,
      snippet: text.slice(0, 500),
    });
    throw new Error(`Goals API non-JSON response (${response.status})`);
  }
  try {
    return await response.json();
  } catch (e) {
    console.error('Goals API JSON parse error', e);
    throw e;
  }
};

const tryParseJson = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.toLowerCase().includes('application/json');
  if (!isJson) {
    let text = '';
    try { text = await response.text(); } catch {}
    console.warn('Goals API success with non-JSON', {
      status: response.status,
      contentType,
      snippet: text.slice(0, 500),
    });
    return null;
  }
  try {
    return await response.json();
  } catch (e) {
    console.error('Goals API JSON parse error on success', e);
    return null;
  }
};

// Função para mapear a resposta da API para o formato esperado pelo frontend
const mapApiGoalToFrontend = (apiGoal: any): Goal => {
  return {
    id: apiGoal.id,
    category_id: apiGoal.measurable_id,
    amount: apiGoal.value,
    period: 'monthly', // A API não retorna período, assumindo monthly por padrão
    created_at: apiGoal.created_at,
    updated_at: apiGoal.updated_at
  };
};

export const useGoals = () => {
  const { user, session } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      if (!session?.access_token) {
        console.warn('Goals: no access token available');
        setGoals([]);
        setLoading(false);
        return;
      }

      const url = `${API_BASE_URL}/api/goals`;
      console.info('Goals: GET', { url, token: maskToken(session.access_token) });

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      console.info('Goals: GET response', {
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type'),
      });

      if (!response.ok) {
        let body = '';
        try { body = await response.text(); } catch {}
        console.error('Goals: GET failed', { status: response.status, bodySnippet: body.slice(0, 500) });
        throw new Error(`Failed to fetch goals (${response.status})`);
      }

      const data = await assertJsonOrThrow(response);
      const items = (data && (data.data || data.goals || data)) ?? [];
      console.info('Goals: parsed items', { count: Array.isArray(items) ? items.length : 1 });

      // Mapear os dados da API para o formato esperado pelo frontend
      const mappedGoals = Array.isArray(items) ? items.map(mapApiGoalToFrontend) : [];
      setGoals(mappedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Erro ao carregar metas');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  const createGoal = useCallback(async (goalData: CreateGoalData) => {
    try {
      if (!session?.access_token) {
        throw new Error('No access token found');
      }

      const url = `${API_BASE_URL}/api/goals`;
      console.info('Goals: POST', {
        url,
        token: maskToken(session.access_token),
        body: goalData,
      });

      const payload = {
        measurable_type: 'App\\Models\\ExpenseCategory',
        measurable_id: goalData.category_id,
        type: 'fixed',
        value: goalData.amount,
      };
      console.info('Goals: POST payload', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.info('Goals: POST response', {
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type'),
      });

      if (!response.ok) {
        let body = '';
        try { body = await response.text(); } catch {}
        console.error('Goals: POST failed', { status: response.status, bodySnippet: body.slice(0, 500) });
        throw new Error(`Failed to create goal (${response.status})`);
      }

      const data = await tryParseJson(response);
      console.info('Goals: POST response data', data);

      if (data) {
        // Mapear a resposta da API para o formato esperado
        const created = mapApiGoalToFrontend(data);
        setGoals((prev) => [...prev, created]);
        toast.success('Meta criada com sucesso!');
        return created;
      } else {
        // Se não temos dados, recarregar as metas
        console.info('Goals: POST no JSON body, refetching goals');
        await fetchGoals();
        toast.success('Meta criada com sucesso!');
        return null;
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Erro ao criar meta');
      throw error;
    }
  }, [session?.access_token, fetchGoals]);

  const updateGoal = useCallback(async (goalId: number, goalData: UpdateGoalData) => {
    try {
      if (!session?.access_token) {
        throw new Error('No access token found');
      }

      const url = `${API_BASE_URL}/api/goals/${goalId}`;
      console.info('Goals: PUT', { url, token: maskToken(session.access_token), body: goalData });

      const payload = {
        type: 'fixed',
        value: goalData.amount,
      };
      console.info('Goals: PUT payload', payload);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.info('Goals: PUT response', {
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type'),
      });

      if (!response.ok) {
        let body = '';
        try { body = await response.text(); } catch {}
        console.error('Goals: PUT failed', { status: response.status, bodySnippet: body.slice(0, 500) });
        throw new Error(`Failed to update goal (${response.status})`);
      }

      const data = await tryParseJson(response);

      if (data) {
        const updated = mapApiGoalToFrontend(data);
        setGoals((prev) => prev.map((goal) => (goal.id === goalId ? updated : goal)));
        toast.success('Meta atualizada com sucesso!');
        return updated;
      } else {
        console.info('Goals: PUT no JSON body, refetching goals');
        await fetchGoals();
        toast.success('Meta atualizada com sucesso!');
        return null;
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Erro ao atualizar meta');
      throw error;
    }
  }, [session?.access_token, fetchGoals]);

  const deleteGoal = useCallback(async (goalId: number) => {
    try {
      if (!session?.access_token) {
        throw new Error('No access token found');
      }

      const url = `${API_BASE_URL}/api/goals/${goalId}`;
      console.info('Goals: DELETE', { url, token: maskToken(session.access_token) });

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      console.info('Goals: DELETE response', {
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type'),
      });

      if (!response.ok) {
        let body = '';
        try { body = await response.text(); } catch {}
        console.error('Goals: DELETE failed', { status: response.status, bodySnippet: body.slice(0, 500) });
        throw new Error(`Failed to delete goal (${response.status})`);
      }

      setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
      toast.success('Meta excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Erro ao excluir meta');
      throw error;
    }
  }, [session?.access_token]);

  const getGoalByCategory = useCallback((categoryId: number) => {
    return goals.find(goal => goal.category_id === categoryId);
  }, [goals]);

  return {
    goals,
    loading,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    getGoalByCategory
  };
};
