
-- Primeiro, vamos verificar e corrigir a estrutura das categorias
-- Verificar se a tabela categories existe e tem a estrutura correta
DO $$
BEGIN
    -- Verificar se a coluna cat_id existe, se não existir, criar
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'categories' 
        AND column_name = 'cat_id'
    ) THEN
        -- Se não existe cat_id, mas existe id, renomear
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'categories' 
            AND column_name = 'id'
        ) THEN
            ALTER TABLE public.categories RENAME COLUMN id TO cat_id;
        ELSE
            -- Se não existe nem id nem cat_id, adicionar cat_id
            ALTER TABLE public.categories ADD COLUMN cat_id INTEGER;
        END IF;
    END IF;
    
    -- Garantir que cat_id seja a chave primária
    BEGIN
        ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
        ALTER TABLE public.categories ADD PRIMARY KEY (cat_id);
    EXCEPTION
        WHEN OTHERS THEN
            -- Ignorar erro se já existir
            NULL;
    END;
END $$;

-- Limpar dados existentes e inserir categorias com IDs específicos
DELETE FROM public.categories;

-- Inserir categorias com IDs específicos
INSERT INTO public.categories (cat_id, name, color, icon, user_id) VALUES
  (1, 'Alimentação', '#FF6B35', 'utensils', NULL),
  (2, 'Saúde', '#F7DC6F', 'heart', NULL),
  (3, 'Aluguel', '#E74C3C', 'home', NULL),
  (4, 'Supermercado', '#3498DB', 'shopping-cart', NULL),
  (5, 'Transporte', '#9B59B6', 'car', NULL),
  (6, 'Lazer', '#1ABC9C', 'gamepad-2', NULL);

-- Recriar a foreign key constraint se necessário
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_category_id_fkey;
ALTER TABLE public.transactions 
ADD CONSTRAINT transactions_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES public.categories(cat_id);

-- Atualizar transações órfãs para usar categoria válida
UPDATE public.transactions 
SET category_id = 1 
WHERE category_id IS NULL OR category_id NOT IN (1,2,3,4,5,6);
