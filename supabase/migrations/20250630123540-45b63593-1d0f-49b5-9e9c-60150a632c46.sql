
-- Inserir contas padrão para resolver o problema de foreign key
-- Primeiro, vamos verificar se já existem contas
DO $$
BEGIN
  -- Se não existem contas, inserir algumas padrão
  IF NOT EXISTS (SELECT 1 FROM public.accounts LIMIT 1) THEN
    INSERT INTO public.accounts (name, type, balance, user_id) VALUES
      ('Conta Corrente', 'checking', 0.00, (SELECT id FROM auth.users LIMIT 1)),
      ('Poupança', 'savings', 0.00, (SELECT id FROM auth.users LIMIT 1)),
      ('Cartão de Crédito', 'credit', 0.00, (SELECT id FROM auth.users LIMIT 1));
  END IF;
END $$;

-- Atualizar transações órfãs para usar a primeira conta disponível
UPDATE public.transactions 
SET account_id = (SELECT id FROM public.accounts ORDER BY id LIMIT 1)
WHERE account_id IS NULL;
