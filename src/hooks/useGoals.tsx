import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

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

export const useGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  // Cache keys
  const GOALS_CACHE_KEY = `goals_${user?.id}`;
  const CACHE_TIMESTAMP_KEY = `goals_cache_timestamp_${user?.id}`;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Helper to save goals to localStorage
  const saveToCache = (goalsData: Goal[]) => {
    if (user?.id) {
      localStorage.setItem(GOALS_CACHE_KEY, JSON.stringify(goalsData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    }
  };

  // Helper to load goals from localStorage
  const loadFromCache = (): Goal[] | null => {
    if (!user?.id) return null;
    
    try {
      const cachedGoals = localStorage.getItem(GOALS_CACHE_KEY);
      const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (!cachedGoals || !cacheTimestamp) return null;
      
      const now = Date.now();
      const isExpired = (now - parseInt(cacheTimestamp)) > CACHE_DURATION;
      
      if (isExpired) return null;
      
      return JSON.parse(cachedGoals);
    } catch (error) {
      console.error('Error loading goals from cache:', error);
      return null;
    }
  };

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        setGoals([]);
        setLoading(false);
        return;
      }

      // First try to load from cache
      const cachedGoals = loadFromCache();
      if (cachedGoals) {
        console.log('Loading goals from cache');
        setGoals(cachedGoals);
        setLoading(false);
        return;
      }

      // In a real app, this would be an API call
      // For now, we'll use localStorage to persist goals
      console.log('Loading goals from localStorage');
      const storedGoals = localStorage.getItem(GOALS_CACHE_KEY) || '[]';
      const goals = JSON.parse(storedGoals);
      setGoals(goals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Erro ao carregar metas');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createGoal = useCallback(async (goalData: CreateGoalData) => {
    try {
      if (!user?.id) {
        throw new Error('Usuário não logado');
      }

      // Create new goal with mock data
      const newGoal: Goal = {
        id: Date.now(), // Use timestamp as ID for simplicity
        category_id: goalData.category_id,
        amount: goalData.amount,
        period: goalData.period,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      saveToCache(updatedGoals);
      
      toast.success('Meta criada com sucesso!');
      return newGoal;
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Erro ao criar meta');
      throw error;
    }
  }, [goals, user?.id]);

  const updateGoal = useCallback(async (goalId: number, goalData: UpdateGoalData) => {
    try {
      if (!user?.id) {
        throw new Error('Usuário não logado');
      }

      const updatedGoals = goals.map(goal => 
        goal.id === goalId 
          ? { 
              ...goal, 
              amount: goalData.amount,
              period: goalData.period,
              updated_at: new Date().toISOString()
            }
          : goal
      );
      
      setGoals(updatedGoals);
      saveToCache(updatedGoals);
      
      toast.success('Meta atualizada com sucesso!');
      
      const updatedGoal = updatedGoals.find(goal => goal.id === goalId);
      return updatedGoal;
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Erro ao atualizar meta');
      throw error;
    }
  }, [goals, user?.id]);

  const deleteGoal = useCallback(async (goalId: number) => {
    try {
      if (!user?.id) {
        throw new Error('Usuário não logado');
      }

      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
      saveToCache(updatedGoals);
      
      toast.success('Meta excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Erro ao excluir meta');
      throw error;
    }
  }, [goals, user?.id]);

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