import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import CategoryChart from '@/components/CategoryChart';
import CategoryTransactionsModal from '@/components/CategoryTransactionsModal';
import AuthModal from '@/components/AuthModal';
import BottomNavigation from '@/components/BottomNavigation';

interface CategoryData {
  cat_id: number;
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

const Index = () => {
  const { user } = useAuth();
  const { categories, transactions, loading } = useTransactions();
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleCategoryClick = (category: CategoryData) => {
    setSelectedCategory(category);
  };

  const handleTransactionClick = (transaction: any) => {
    // Handle transaction click if needed
    console.log('Transaction clicked:', transaction);
  };

  useEffect(() => {
    console.log('Categories data:', categories);
  }, [categories]);

  if (!user) {
    return <AuthModal isOpen={true} onClose={() => setShowAuth(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">
            Gastos por Categoria
          </h1>
          
          <div className="h-96">
            <CategoryChart 
              data={categories || []} 
              onCategoryClick={handleCategoryClick}
            />
          </div>
        </div>
      </main>

      <BottomNavigation />

      {selectedCategory && (
        <CategoryTransactionsModal
          category={selectedCategory}
          transactions={transactions || []}
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onTransactionClick={handleTransactionClick}
        />
      )}
    </div>
  );
};

export default Index;
