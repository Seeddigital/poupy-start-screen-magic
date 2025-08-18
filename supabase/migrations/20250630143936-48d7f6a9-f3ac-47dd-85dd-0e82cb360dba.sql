
-- Primeiro, vamos verificar quais accounts existem e criar um account padrão se necessário
INSERT INTO public.accounts (name, type, balance, user_id) 
SELECT 'Conta Padrão', 'checking', 0.00, 'cfa777de-92f6-459d-a88e-17e81ae7be85'
WHERE NOT EXISTS (SELECT 1 FROM public.accounts WHERE id = 3);

-- Atualizar transações órfãs para usar o primeiro account disponível
UPDATE public.transactions 
SET account_id = (SELECT id FROM public.accounts ORDER BY id LIMIT 1)
WHERE account_id NOT IN (SELECT id FROM public.accounts);

-- Ou especificamente para account_id = 3, vamos criar um account com esse ID
INSERT INTO public.accounts (id, name, type, balance, user_id) 
VALUES (3, 'Conta Principal', 'checking', 0.00, 'cfa777de-92f6-459d-a88e-17e81ae7be85')
ON CONFLICT (id) DO NOTHING;
