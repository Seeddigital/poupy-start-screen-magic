
-- Primeiro, vamos verificar e limpar dados problemáticos
-- Deletar registros com id NULL na tabela accounts
DELETE FROM public.accounts WHERE id IS NULL;

-- Remover as referências existentes para poder alterar o tipo
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_account_id_fkey;

-- Alterar o tipo da coluna id na tabela accounts de UUID para INTEGER
-- Primeiro, vamos adicionar uma nova coluna temporária
ALTER TABLE public.accounts ADD COLUMN new_id INTEGER;

-- Criar uma sequência para os novos IDs
CREATE SEQUENCE IF NOT EXISTS accounts_id_seq;

-- Atualizar os registros existentes com novos IDs sequenciais
UPDATE public.accounts SET new_id = nextval('accounts_id_seq');

-- Remover a coluna antiga e renomear a nova
ALTER TABLE public.accounts DROP COLUMN id;
ALTER TABLE public.accounts RENAME COLUMN new_id TO id;

-- Definir a nova coluna como chave primária
ALTER TABLE public.accounts ALTER COLUMN id SET NOT NULL;
ALTER TABLE public.accounts ALTER COLUMN id SET DEFAULT nextval('accounts_id_seq');
ALTER TABLE public.accounts ADD PRIMARY KEY (id);

-- Fazer a sequência ser propriedade da coluna
ALTER SEQUENCE accounts_id_seq OWNED BY public.accounts.id;

-- Alterar o tipo da coluna account_id na tabela transactions para INTEGER
-- Primeiro, limpar referências órfãs
UPDATE public.transactions SET account_id = NULL WHERE account_id IS NOT NULL;

-- Alterar o tipo da coluna account_id para INTEGER
ALTER TABLE public.transactions ALTER COLUMN account_id TYPE INTEGER USING account_id::text::integer;

-- Recriar a foreign key constraint
ALTER TABLE public.transactions 
ADD CONSTRAINT transactions_account_id_fkey 
FOREIGN KEY (account_id) REFERENCES public.accounts(id);

-- Ajustar a sequência para começar corretamente
SELECT setval('accounts_id_seq', COALESCE((SELECT MAX(id) FROM public.accounts), 0) + 1, false);
