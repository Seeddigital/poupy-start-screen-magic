import { useState, useCallback } from 'react';
import { toast } from 'sonner';

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

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem('auth_token');
  };

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/goals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }

      const data = await response.json();
      setGoals(data.data || data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Erro ao carregar metas');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createGoal = useCallback(async (goalData: CreateGoalData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/goals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        throw new Error('Failed to create goal');
      }

      const newGoal = await response.json();
      setGoals(prev => [...prev, newGoal]);
      toast.success('Meta criada com sucesso!');
      return newGoal;
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Erro ao criar meta');
      throw error;
    }
  }, []);

  const updateGoal = useCallback(async (goalId: number, goalData: UpdateGoalData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        throw new Error('Failed to update goal');
      }

      const updatedGoal = await response.json();
      setGoals(prev => prev.map(goal => goal.id === goalId ? updatedGoal : goal));
      toast.success('Meta atualizada com sucesso!');
      return updatedGoal;
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Erro ao atualizar meta');
      throw error;
    }
  }, []);

  const deleteGoal = useCallback(async (goalId: number) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }

      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      toast.success('Meta excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Erro ao excluir meta');
      throw error;
    }
  }, []);

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