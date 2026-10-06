const numberFormat = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 });

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}
