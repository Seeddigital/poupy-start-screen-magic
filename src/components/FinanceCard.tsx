
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FinanceCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning";
}

export function FinanceCard({ title, value, subtitle, icon: Icon, variant = "default" }: FinanceCardProps) {
  const iconStyles = {
    default: "text-blue-400",
    success: "text-green-400",
    warning: "text-orange-400"
  };

  return (
    <Card className="bg-transparent border-none shadow-none hover:scale-105 transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white/80">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconStyles[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {subtitle && <p className="text-xs text-white/60 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
