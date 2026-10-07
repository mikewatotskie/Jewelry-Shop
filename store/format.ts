export function peso(n: number): string {
  const v = Math.round(n);
  return `\u20B1${v.toLocaleString('en-US')}`;
}
