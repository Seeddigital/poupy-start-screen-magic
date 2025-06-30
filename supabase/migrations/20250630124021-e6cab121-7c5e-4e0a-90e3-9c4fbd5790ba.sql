
-- Corrigir problema de foreign key com categories
-- Primeiro, vamos verificar se existem categorias
DO $$
BEGIN
  -- Se não existem categorias, inserir algumas padrão
  IF NOT EXISTS (SELECT 1 FROM public.categories LIMIT 1) THEN
    INSERT INTO public.categories (cat_id, name, color, icon, user_id) VALUES
      (1, 'Alimentação', '#FF6B35', 'utensils', NULL),
      (2, 'Saúde', '#F7DC6F', 'heart', NULL),
      (3, 'Aluguel', '#E74C3C', 'home', NULL),
      (4, 'Supermercado', '#3498DB', 'shopping-cart', NULL),
      (5, 'Transporte', '#9B59B6', 'car', NULL),
      (6, 'Lazer', '#1ABC9C', 'gamepad-2', NULL);
  END IF;
END $$;

-- Atualizar transações órfãs para usar a primeira categoria disponível
UPDATE public.transactions 
SET category_id = (SELECT cat_id FROM public.categories ORDER BY cat_id LIMIT 1)
WHERE category_id NOT IN (SELECT cat_id FROM public.categories);

-- Garantir que todas as transações tenham category_id válido
UPDATE public.transactions 
SET category_id = 1 
WHERE category_id IS NULL;
