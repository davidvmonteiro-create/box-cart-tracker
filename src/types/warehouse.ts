export interface Box {
  id: string;
  code: string;
  description: string;
  cartId: string | null;
  scannedAt: string;
  scannedBy: string;
}

export interface Cart {
  id: string;
  code: string;
  corridorId: string | null;
  boxes: Box[];
  createdAt: string;
}

export interface Corridor {
  id: string;
  name: string;
  zone: string;
  carts: Cart[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
}
