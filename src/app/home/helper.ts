export function createRouteFromString(input: string): string {
  input = input.toLowerCase().replace(/\s+/g, "-")
  return input
}
