
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface QuickActionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "secondary";
}

export function QuickActionButton({ label, icon: Icon, onClick, variant = "default" }: QuickActionButtonProps) {
  return (
    <Button 
      variant={variant}
      className="h-20 w-full flex-col gap-2 bg-white/10 hover:bg-white/20 text-white shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20 backdrop-blur-sm"
      onClick={onClick}
    >
      <Icon className="h-6 w-6" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}
