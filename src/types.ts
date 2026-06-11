export type SareeType = 'Kalyani Cotton' | 'Soft Silk';

export interface Product {
  id: string;          // inventory variant uuid in the shared POS database
  name: string;        // full variant name e.g. "Raja Rani Saree - Red"
  group: string;       // style/group name e.g. "Raja Rani Saree"
  color: string | null;
  type: SareeType;
  price: number;
  mrp: number | null;
  isNew: boolean;
  image: string;
  stock: number;       // live quantity, shared with the in-store POS
}

export interface CartItem extends Product {
  qty: number;
}
