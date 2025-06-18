
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, Coffee, Gas, ShoppingBag, Wifi } from "lucide-react";

const transactions = [
  { id: 1, description: "Café da manhã", amount: -15.50, type: "expense", icon: Coffee, date: "Hoje" },
  { id: 2, description: "Salário", amount: 3500.00, type: "income", icon: ArrowDownLeft, date: "Ontem" },
  { id: 3, description: "Supermercado", amount: -125.30, type: "expense", icon: ShoppingBag, date: "Ontem" },
  { id: 4, description: "Combustível", amount: -80.00, type: "expense", icon: Gas, date: "2 dias atrás" },
  { id: 5, description: "Internet", amount: -89.90, type: "expense", icon: Wifi, date: "3 dias atrás" }
];

export function RecentTransactions() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <transaction.icon className={`h-4 w-4 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : ''}R$ {Math.abs(transaction.amount).toFixed(2)}
                </p>
                {transaction.type === 'expense' && (
                  <ArrowUpRight className="h-3 w-3 text-red-500 ml-auto" />
                )}
                {transaction.type === 'income' && (
                  <ArrowDownLeft className="h-3 w-3 text-green-500 ml-auto" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
