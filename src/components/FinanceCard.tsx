
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
  const variantStyles = {
    default: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
    success: "bg-gradient-to-br from-green-50 to-green-100 border-green-200", 
    warning: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
  };

  const iconStyles = {
    default: "text-blue-600",
    success: "text-green-600",
    warning: "text-orange-600"
  };

  return (
    <Card className={`${variantStyles[variant]} hover:shadow-lg transition-all duration-200 hover:scale-105`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconStyles[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
