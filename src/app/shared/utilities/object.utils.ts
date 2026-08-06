export function getNestedProperty(value: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((currentValue, key) => {
    if (typeof currentValue !== 'object' || currentValue === null) return undefined
    return (currentValue as Record<string, unknown>)[key]
  }, value)
}
