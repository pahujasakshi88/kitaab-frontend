export const discountPercent = (price: number, original?: number) =>
  original && original > price
    ? Math.round(((original - price) / original) * 100)
    : 0;
