
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
              Poupy
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-pink-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
