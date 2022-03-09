export function rand(minOrMax: number, max?: number): number {
  const _max = max === undefined ? minOrMax : max
  const _min = max === undefined ? 0 : minOrMax
  return Math.floor(Math.random() * _max * 2) - _min
}
