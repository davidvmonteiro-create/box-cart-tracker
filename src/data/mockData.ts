import type { Box, Cart, Corridor } from '@/types/warehouse';

export const mockBoxes: Box[] = [
  { id: '1', code: 'CX-001', description: 'Peças Motor A', cartId: 'cart-1', scannedAt: '2026-04-08T09:15:00', scannedBy: 'João' },
  { id: '2', code: 'CX-002', description: 'Parafusos M8', cartId: 'cart-1', scannedAt: '2026-04-08T09:20:00', scannedBy: 'João' },
  { id: '3', code: 'CX-003', description: 'Filtros Óleo', cartId: 'cart-2', scannedAt: '2026-04-08T10:00:00', scannedBy: 'Ana' },
  { id: '4', code: 'CX-004', description: 'Correias V', cartId: null, scannedAt: '2026-04-08T10:30:00', scannedBy: 'Ana' },
  { id: '5', code: 'CX-005', description: 'Rolamentos', cartId: 'cart-2', scannedAt: '2026-04-08T11:00:00', scannedBy: 'João' },
  { id: '6', code: 'CX-006', description: 'Cabos Elétricos', cartId: null, scannedAt: '2026-04-08T11:15:00', scannedBy: 'Ana' },
];

export const mockCarts: Cart[] = [
  { id: 'cart-1', code: 'CR-01', corridorId: 'cor-1', boxes: mockBoxes.filter(b => b.cartId === 'cart-1'), createdAt: '2026-04-08T09:00:00' },
  { id: 'cart-2', code: 'CR-02', corridorId: 'cor-2', boxes: mockBoxes.filter(b => b.cartId === 'cart-2'), createdAt: '2026-04-08T09:30:00' },
  { id: 'cart-3', code: 'CR-03', corridorId: null, boxes: [], createdAt: '2026-04-08T10:00:00' },
];

export const mockCorridors: Corridor[] = [
  { id: 'cor-1', name: 'Corredor A1', zone: 'Zona Norte', carts: mockCarts.filter(c => c.corridorId === 'cor-1') },
  { id: 'cor-2', name: 'Corredor B2', zone: 'Zona Sul', carts: mockCarts.filter(c => c.corridorId === 'cor-2') },
  { id: 'cor-3', name: 'Corredor C3', zone: 'Zona Leste', carts: [] },
];
