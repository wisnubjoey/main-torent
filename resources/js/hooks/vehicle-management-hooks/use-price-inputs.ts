// Minimal helpers for price inputs (IDR)
export type PriceFields = 'price_daily_idr' | 'price_weekly_idr' | 'price_monthly_idr';

export type PriceFormData = {
  price_daily_idr: number | null;
  price_weekly_idr: number | null;
  price_monthly_idr: number | null;
};

// Create a handler bound to setData. Keeps values non-negative and supports blank (null).
export const createHandlePriceInputChange = (
  setData: (key: string, value: unknown) => void
) => {
  return (name: PriceFields, raw: string) => {
    const value = raw === '' ? null : Math.max(0, Math.floor(Number(raw)) || 0);
    setData(name, value);
  };
};

// Typed views of data/errors to avoid direct any casts in components
export const getPriceData = <T extends object>(data: T) => {
  return (data as unknown) as T & PriceFormData;
};

export const getPriceErrors = <E extends object>(errors: E) => {
  return (errors as unknown) as Record<PriceFields, string | undefined> & E;
};