import { useAuth } from '@/contexts/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ScanBarcode, ShoppingCart, MapPin, LogOut, Warehouse } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/scanner', label: 'Scanner', icon: ScanBarcode },
  { to: '/carrinhos', label: 'Carrinhos', icon: ShoppingCart },
  { to: '/corredores', label: 'Corredores', icon: MapPin },
];

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col z-50">
      <div className="p-5 flex items-center gap-3 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
          <Warehouse className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-sm">WMS Armazém</h2>
          <p className="text-xs text-sidebar-foreground/60">Gestão de Stock</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              location.pathname === to
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/50">{user?.role}</p>
          </div>
          <button onClick={logout} className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors" title="Sair">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
