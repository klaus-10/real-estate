export interface FilterOptions {
  city: string;
  type: string; // affitto, vendita, asta
  property: string; // tipo di costruzione
  isNew: string; // tipo di costruzione
  price: {
    min: Number;
    max: Number;
  };
  rooms: number; // numero stanze da letto o numero locali ?
  autore: string; // privato o agenzia ?
  date: {
    from: string;
    to: string;
  };
  mq: {
    from: string;
    to: string;
  };
  mqPrice: {
    from: string;
    to: string;
  };
}

export interface BoundingBoxRequest {
  west?: number;
  east?: number;
  north?: number;
  south?: number;
  filter?: FilterOptions;
}
