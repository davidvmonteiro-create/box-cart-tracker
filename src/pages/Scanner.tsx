import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScanBarcode, Package, Check, Camera, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Scanner = () => {
  const [boxCode, setBoxCode] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCart, setSelectedCart] = useState('');
  const [carts, setCarts] = useState<any[]>([]);
  const [scanHistory, setScanHistory] = useState<{ code: string; cart: string; time: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    api.getCarts().then(setCarts).catch(() => {});
  }, []);

  const handleScan = async () => {
    if (!boxCode.trim() || !selectedCart) {
      toast({ title: 'Erro', description: 'Preencha o código e selecione um carrinho', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await api.createBox(boxCode, description, parseInt(selectedCart));
      const cart = carts.find((c: any) => String(c.Id) === selectedCart);
      setScanHistory(prev => [
        { code: boxCode, cart: cart?.Code || '', time: new Date().toLocaleTimeString('pt-PT') },
        ...prev,
      ]);
      toast({ title: 'Caixa registada', description: `${boxCode} → ${cart?.Code}` });
      setBoxCode('');
      setDescription('');
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Scanner de Caixas</h1>
        <p className="text-muted-foreground text-sm">Leia ou insira o código da caixa</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-dashed border-primary/30">
          <CardHeader>
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <ScanBarcode className="h-5 w-5 text-primary" />
              Leitura de Caixa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <div className="aspect-video rounded-xl bg-muted flex flex-col items-center justify-center gap-3 scanner-pulse border-2 border-primary/20">
                <Camera className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground font-medium">Câmara de scanner</p>
                <p className="text-xs text-muted-foreground">Aponte para o código de barras / QR</p>
              </div>
            </div>

            <div>
              <Label htmlFor="boxCode">Código da caixa</Label>
              <Input
                id="boxCode"
                placeholder="Ex: CX-007"
                value={boxCode}
                onChange={e => setBoxCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleScan()}
                className="font-mono text-lg"
              />
            </div>

            <div>
              <Label htmlFor="desc">Descrição</Label>
              <Input
                id="desc"
                placeholder="Ex: Peças Motor B"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div>
              <Label>Carrinho destino</Label>
              <Select value={selectedCart} onValueChange={setSelectedCart}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o carrinho" />
                </SelectTrigger>
                <SelectContent>
                  {carts.map((cart: any) => (
                    <SelectItem key={cart.Id} value={String(cart.Id)}>{cart.Code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleScan} className="w-full" size="lg" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Package className="mr-2 h-4 w-4" />}
              Registar Caixa
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Histórico de Sessão</CardTitle>
          </CardHeader>
          <CardContent>
            {scanHistory.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ScanBarcode className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Nenhuma leitura nesta sessão</p>
              </div>
            ) : (
              <div className="space-y-2">
                {scanHistory.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
                    <Check className="h-4 w-4 text-success" />
                    <div className="flex-1">
                      <span className="font-mono text-sm font-medium">{item.code}</span>
                      <span className="text-muted-foreground text-sm"> → {item.cart}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Scanner;
