import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, MapPin } from 'lucide-react';
import { mockCarts, mockCorridors } from '@/data/mockData';

const Carrinhos = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold">Carrinhos</h1>
      <p className="text-muted-foreground text-sm">Gestão de carrinhos e respetivas caixas</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {mockCarts.map(cart => {
        const corridor = mockCorridors.find(c => c.id === cart.corridorId);
        return (
          <Card key={cart.id} className="warehouse-card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  {cart.code}
                </CardTitle>
                <Badge variant={corridor ? 'default' : 'secondary'} className={corridor ? 'bg-success text-success-foreground' : ''}>
                  {corridor ? corridor.name : 'Não alocado'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {corridor && (
                <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {corridor.zone} — {corridor.name}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Caixas ({cart.boxes.length})
                </p>
                {cart.boxes.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">Carrinho vazio</p>
                ) : (
                  cart.boxes.map(box => (
                    <div key={box.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-mono text-sm">{box.code}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{box.description}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

export default Carrinhos;
