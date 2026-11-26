// Backend ke rule jaisa hi: DevBox/src/utils/delivery.ts (dono jagah ek saath badlo)
export const FREE_DELIVERY_ABOVE = 499;
export const DELIVERY_CHARGE = 49;

export const deliveryFeeFor = (subtotal: number): number =>
  subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_CHARGE;
