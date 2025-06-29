
-- Primeiro, vamos verificar e limpar dados problemáticos
-- Deletar registros com id NULL
DELETE FROM public.categories WHERE id IS NULL;

-- Remover as referências existentes para poder alterar o tipo
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_category_id_fkey;

-- Alterar o tipo da coluna id na tabela categories de UUID para INTEGER
-- Primeiro, vamos adicionar uma nova coluna temporária
ALTER TABLE public.categories ADD COLUMN new_id INTEGER;

-- Criar uma sequência para os novos IDs
CREATE SEQUENCE IF NOT EXISTS categories_id_seq;

-- Atualizar os registros existentes com novos IDs sequenciais
UPDATE public.categories SET new_id = nextval('categories_id_seq');

-- Remover a coluna antiga e renomear a nova
ALTER TABLE public.categories DROP COLUMN id;
ALTER TABLE public.categories RENAME COLUMN new_id TO id;

-- Definir a nova coluna como chave primária
ALTER TABLE public.categories ALTER COLUMN id SET NOT NULL;
ALTER TABLE public.categories ALTER COLUMN id SET DEFAULT nextval('categories_id_seq');
ALTER TABLE public.categories ADD PRIMARY KEY (id);

-- Fazer a sequência ser propriedade da coluna
ALTER SEQUENCE categories_id_seq OWNED BY public.categories.id;

-- Alterar o tipo da coluna category_id na tabela transactions para INTEGER
-- Primeiro, limpar referências órfãs
UPDATE public.transactions SET category_id = NULL WHERE category_id IS NOT NULL;

-- Alterar o tipo da coluna
ALTER TABLE public.transactions ALTER COLUMN category_id TYPE INTEGER USING NULL;

-- Recriar a foreign key constraint
ALTER TABLE public.transactions 
ADD CONSTRAINT transactions_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES public.categories(id);

-- Reinserir as categorias padrão com IDs específicos
DELETE FROM public.categories;
INSERT INTO public.categories (id, name, color, icon, user_id) VALUES
  (1, 'Alimentação', '#FF6B35', 'utensils', NULL),
  (2, 'Saúde', '#F7DC6F', 'heart', NULL),
  (3, 'Aluguel', '#E74C3C', 'home', NULL),
  (4, 'Supermercado', '#3498DB', 'shopping-cart', NULL),
  (5, 'Transporte', '#9B59B6', 'car', NULL),
  (6, 'Lazer', '#1ABC9C', 'gamepad-2', NULL);

-- Ajustar a sequência para começar após os valores inseridos
SELECT setval('categories_id_seq', 6);
