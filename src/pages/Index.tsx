
import { Header } from "@/components/Header";
import { FinanceCard } from "@/components/FinanceCard";
import { QuickActionButton } from "@/components/QuickActionButton";
import { RecentTransactions } from "@/components/RecentTransactions";
import { Wallet, TrendingUp, Target, Plus, ArrowUpDown, BarChart3, PiggyBank } from "lucide-react";

const Index = () => {
  const handleQuickAction = (action: string) => {
    console.log(`Ação rápida: ${action}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Saudação */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bom dia, João! 👋</h2>
          <p className="text-gray-600">Aqui está um resumo das suas finanças hoje</p>
        </div>

        {/* Cards de resumo financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinanceCard
            title="Saldo Total"
            value="R$ 2.485,30"
            subtitle="+2.5% este mês"
            icon={Wallet}
            variant="success"
          />
          <FinanceCard
            title="Gastos do Mês"
            value="R$ 1.238,90"
            subtitle="68% do orçamento"
            icon={TrendingUp}
            variant="warning"
          />
          <FinanceCard
            title="Economia do Mês"
            value="R$ 580,00"
            subtitle="Meta: R$ 800,00"
            icon={PiggyBank}
            variant="success"
          />
          <FinanceCard
            title="Investimentos"
            value="R$ 4.250,00"
            subtitle="+12.3% este ano"
            icon={Target}
            variant="default"
          />
        </div>

        {/* Ações rápidas */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              label="Nova Receita"
              icon={Plus}
              onClick={() => handleQuickAction("receita")}
            />
            <QuickActionButton
              label="Nova Despesa"
              icon={Plus}
              onClick={() => handleQuickAction("despesa")}
            />
            <QuickActionButton
              label="Transferir"
              icon={ArrowUpDown}
              onClick={() => handleQuickAction("transferir")}
            />
            <QuickActionButton
              label="Relatórios"
              icon={BarChart3}
              onClick={() => handleQuickAction("relatorios")}
            />
          </div>
        </div>

        {/* Transações recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentTransactions />
          
          {/* Card de meta do mês */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Meta do Mês</h3>
              <p className="text-purple-100 mb-4">Economizar R$ 800,00</p>
              <div className="bg-white/20 rounded-full h-2 mb-2">
                <div className="bg-white rounded-full h-2 w-3/4"></div>
              </div>
              <p className="text-sm text-purple-100">R$ 580,00 de R$ 800,00 (72%)</p>
            </div>

            {/* Dica do dia */}
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">💡 Dica do Dia</h3>
              <p className="text-yellow-700 text-sm">
                Que tal revisar seus gastos com entretenimento? Você gastou 15% a mais que o mês passado nesta categoria.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
