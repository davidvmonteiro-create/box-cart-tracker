import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ShoppingCart, Package, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

const Corredores = () => {
  const [corridors, setCorridors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCorridors().then(setCorridors).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Corredores</h1>
        <p className="text-muted-foreground text-sm">Localização de carrinhos por corredor</p>
      </div>

      <div className="space-y-5">
        {corridors.map((corridor: any) => {
          const carts = corridor.carts || [];
          const totalBoxes = carts.reduce((sum: number, c: any) => sum + (c.boxes?.length || 0), 0);

          return (
            <Card key={corridor.Id} className="warehouse-card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-info" />
                    {corridor.Name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{corridor.Zone}</Badge>
                    <Badge variant="outline">{carts.length} carrinhos</Badge>
                    <Badge variant="outline">{totalBoxes} caixas</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {carts.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">Corredor vazio</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {carts.map((cart: any) => (
                      <div key={cart.Id} className="p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <ShoppingCart className="h-4 w-4 text-primary" />
                          <span className="font-heading font-semibold text-sm">{cart.Code}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{cart.boxes?.length || 0} caixas</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(cart.boxes || []).map((box: any) => (
                            <span key={box.Id} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-card border">
                              <Package className="h-3 w-3" />
                              {box.Code}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Corredores;
