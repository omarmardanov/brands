export const MODELS = {
  'franchise': { slug: 'franshiza', label: 'Франшиза' },
  'master-franchise': { slug: 'master-franshiza', label: 'Мастер-франшиза' },
  'distribution': { slug: 'distribuciya', label: 'Дистрибуция' },
  'licensing': { slug: 'licenzirovanie', label: 'Лицензирование' },
  'dealership': { slug: 'dilerstvo', label: 'Дилерство' },
} as const;

export type ModelKey = keyof typeof MODELS;

/** Модели в порядке объявления, а не в порядке появления в данных */
export function orderModels(keys: Iterable<string>): ModelKey[] {
  const present = new Set(keys);
  return (Object.keys(MODELS) as ModelKey[]).filter((k) => present.has(k));
}

export const INDUSTRIES: Record<string, string> = {
  food: 'Еда',
  retail: 'Розница',
  services: 'Услуги',
  beauty: 'Красота',
  education: 'Образование',
  auto: 'Авто',
  health: 'Здоровье',
};

/* Курсы для пересчёта в доллары — приблизительные, обновлять вручную.
   Проверены 17 августа 2026 года. */
const TO_USD = { RUB: 1 / 80, USD: 1, EUR: 1.08 };

const SIGN = { RUB: '₽', USD: '$', EUR: '€' };

type Money = { amount: number; currency: keyof typeof SIGN };

/** Число крупными единицами: 20000000 → 20 «млн», 9500000 → 9,5 «млн».
    Больше десяти дробную часть не показываем — точность здесь мнимая. */
function split(amount: number): { value: string; unit: string } {
  const num = (n: number) =>
    String(n >= 10 ? Math.round(n) : Math.round(n * 10) / 10).replace('.', ',');
  if (amount >= 1_000_000) return { value: num(amount / 1_000_000), unit: 'млн' };
  if (amount >= 1_000) return { value: num(amount / 1_000), unit: 'тыс.' };
  return { value: num(amount), unit: '' };
}

function join({ value, unit }: { value: string; unit: string }, sign: string): string {
  return [value, unit, sign].filter(Boolean).join(' ');
}

export function money(m: Money): string {
  return join(split(m.amount), SIGN[m.currency]);
}

export function usd(m: Money): string {
  const { value, unit } = split(m.amount * TO_USD[m.currency]);
  return [`$${value}`, unit].filter(Boolean).join(' ');
}

/** «от 20 млн ₽», «1,5–8 млн ₽» — единица не повторяется, если она общая */
export function range(from: Money, to: Money | null): string {
  if (!to) return `от ${money(from)}`;
  if (from.currency !== to.currency) return `${money(from)} – ${money(to)}`;
  const a = split(from.amount);
  const b = split(to.amount);
  if (a.unit === b.unit) return join({ value: `${a.value}–${b.value}`, unit: b.unit }, SIGN[to.currency]);
  return `${money(from)} – ${money(to)}`;
}

export function months(from: number | null, to: number | null): string | null {
  if (!from && !to) return null;
  if (from && to) return `${from}–${to} мес.`;
  if (from) return `от ${from} мес.`;
  return `до ${to} мес.`;
}
