/**
 * Extract all class or className attribute values from HTML/JSX-like content.
 * Returns an array of raw class strings (each one from a `class` or `className`).
 */
export function extractClasses(content: string): string[] {
  const matches = [...content.matchAll(/class(?:Name)?=["']([^"']+)["']/g)]
  return matches.map(([, classValue]) => classValue.trim()).filter(Boolean)
}
