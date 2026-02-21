import { Home, Activity, TrendingUp, Clock, User } from 'lucide-react';

type NavItem = {
  id: string;
  label: string;
  icon: typeof Home;
};

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'fast-check', label: 'FAST Check', icon: Activity },
  { id: 'risk-score', label: 'Risk Score', icon: TrendingUp },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'profile', label: 'Profile', icon: User }
];

export function BottomNavigation() {
  const activeId = 'home';
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E2E8F0] z-40">
      <div className="h-full flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeId;
          
          return (
            <button
              key={item.id}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-0"
            >
              <div className="relative">
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: isActive ? '#0EA5E9' : '#94A3B8' }}
                />
                {isActive && (
                  <div 
                    className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-[#0EA5E9]"
                  />
                )}
              </div>
              
              <span 
                className="text-[10px] font-medium"
                style={{ 
                  fontFamily: 'DM Sans, sans-serif',
                  color: isActive ? '#0EA5E9' : '#94A3B8'
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
