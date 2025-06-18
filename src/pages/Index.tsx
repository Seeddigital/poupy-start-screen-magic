
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url('/lovable-uploads/7320bbd4-91c7-4d8b-8616-25048e90f69b.png')`
        }}
      />
      
      {/* Neon glow effects */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400 rounded-full blur-2xl opacity-25"></div>

      <Header />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Saudação com visual neon */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Bem-vindo ao Poupy! 🐷✨
          </h2>
          <p className="text-purple-200 text-lg">Sua jornada financeira começa aqui</p>
        </div>

        {/* Cards de resumo financeiro com fundo semi-transparente */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <FinanceCard
              title="Saldo Total"
              value="R$ 2.485,30"
              subtitle="+2.5% este mês"
              icon={Wallet}
              variant="success"
            />
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <FinanceCard
              title="Gastos do Mês"
              value="R$ 1.238,90"
              subtitle="68% do orçamento"
              icon={TrendingUp}
              variant="warning"
            />
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <FinanceCard
              title="Economia do Mês"
              value="R$ 580,00"
              subtitle="Meta: R$ 800,00"
              icon={PiggyBank}
              variant="success"
            />
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <FinanceCard
              title="Investimentos"
              value="R$ 4.250,00"
              subtitle="+12.3% este ano"
              icon={Target}
              variant="default"
            />
          </div>
        </div>

        {/* Ações rápidas com efeito neon */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-white mb-4 text-center">Ações Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-1 rounded-xl backdrop-blur-sm border border-pink-300/30">
              <QuickActionButton
                label="Nova Receita"
                icon={Plus}
                onClick={() => handleQuickAction("receita")}
              />
            </div>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-1 rounded-xl backdrop-blur-sm border border-blue-300/30">
              <QuickActionButton
                label="Nova Despesa"
                icon={Plus}
                onClick={() => handleQuickAction("despesa")}
              />
            </div>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-1 rounded-xl backdrop-blur-sm border border-purple-300/30">
              <QuickActionButton
                label="Transferir"
                icon={ArrowUpDown}
                onClick={() => handleQuickAction("transferir")}
              />
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-1 rounded-xl backdrop-blur-sm border border-green-300/30">
              <QuickActionButton
                label="Relatórios"
                icon={BarChart3}
                onClick={() => handleQuickAction("relatorios")}
              />
            </div>
          </div>
        </div>

        {/* Transações recentes com fundo neon */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-1">
            <RecentTransactions />
          </div>
          
          {/* Cards laterais com efeito neon */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-purple-600/80 to-pink-600/80 backdrop-blur-md text-white p-6 rounded-xl shadow-2xl border border-purple-300/30">
              <h3 className="text-lg font-semibold mb-2">Meta do Mês 🎯</h3>
              <p className="text-purple-100 mb-4">Economizar R$ 800,00</p>
              <div className="bg-white/20 rounded-full h-3 mb-2">
                <div className="bg-gradient-to-r from-pink-300 to-yellow-300 rounded-full h-3 w-3/4 shadow-lg"></div>
              </div>
              <p className="text-sm text-purple-100">R$ 580,00 de R$ 800,00 (72%)</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 backdrop-blur-md border border-yellow-300/30 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-yellow-100 mb-2">💡 Dica do Dia</h3>
              <p className="text-yellow-200 text-sm">
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
