import { useEffect, useState } from 'react';
import { Package, ShoppingCart, MapPin, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/services/api';

const Dashboard = () => {
  const [boxes, setBoxes] = useState<any[]>([]);
  const [carts, setCarts] = useState<any[]>([]);
  const [corridors, setCorridors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getBoxes(), api.getCarts(), api.getCorridors()])
      .then(([b, c, cor]) => { setBoxes(b); setCarts(c); setCorridors(cor); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Caixas', value: boxes.length, icon: Package, color: 'bg-primary' },
    { label: 'Carrinhos Ativos', value: carts.filter((c: any) => c.boxes && c.boxes.length > 0).length, icon: ShoppingCart, color: 'bg-accent' },
    { label: 'Corredores', value: corridors.length, icon: MapPin, color: 'bg-info' },
    { label: 'Caixas Soltas', value: boxes.filter((b: any) => !b.CartId).length, icon: AlertTriangle, color: 'bg-warning' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Visão geral do armazém</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="warehouse-card-hover">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`${color} rounded-xl p-3 flex items-center justify-center`}>
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Últimas Leituras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {boxes.slice(0, 5).map((box: any) => (
                <div key={box.Id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                      <Package className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{box.Code}</p>
                      <p className="text-xs text-muted-foreground">{box.Description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{box.ScannedBy}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(box.ScannedAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Carrinhos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {carts.map((cart: any) => {
                const corridor = corridors.find((c: any) => c.Id === cart.CorridorId);
                return (
                  <div key={cart.Id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{cart.Code}</p>
                        <p className="text-xs text-muted-foreground">{cart.boxes?.length || 0} caixas</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${corridor ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      {corridor ? corridor.Name : 'Sem corredor'}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
