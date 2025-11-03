/**
 * Expands Tailwind-like shorthand syntax into full class variants.
 * Example:
 * hover(bg-blue-500 text-blue-50)
 * → hover:bg-blue-500 hover:text-blue-50
 *
 * Supports nested and prefixed variants like:
 * dark(hover(bg-blue-400)), group-hover:(...), peer-focus:(...), not-()
 */

/**
 * Recursively expands grouped Tailwind variant syntax.
 * @param input - the class attribute content
 * @param prefix - accumulated variant prefix (e.g. "hover", "dark:hover")
 */
export function expandVariants(input: string, prefix = ''): string[] {
  const tokens: string[] = []
  let i = 0

  while (i < input.length) {
    const char = input[i]

    // Skip whitespace
    if (/\s/.test(char)) {
      i++
      continue
    }

    // Parse a token until space, colon, or parentheses
    const tokenStart = i
    while (i < input.length && /[^\s():]/.test(input[i])) i++
    const token = input.slice(tokenStart, i).trim()

    if (!token) {
      i++
      continue
    }

    // --- CASE 1: Nested group e.g. hover(...)
    if (input[i] === '(') {
      const inner = extractGroup(input, i)
      const newPrefix = prefix ? `${prefix}:${token}` : token
      const nested = expandVariants(inner.content, newPrefix)
      tokens.push(...nested)
      i = inner.nextIndex
      continue
    }

    // --- CASE 2: Prefix-like variants (group-, peer-, not-, etc.)
    if (token.endsWith('-')) {
      const next = readNextToken(input, i)
      if (next) {
        const combined = prefix ? `${prefix}:${token}${next}` : `${token}${next}`
        tokens.push(combined)
        i += next.length
        continue
      }
    }

    // --- CASE 3: Regular class name
    const expanded = prefix ? `${prefix}:${token}` : token
    tokens.push(expanded)
    i++
  }

  return tokens
}

/**
 * Extracts content inside matching parentheses.
 * Example:
 *   extractGroup("hover(bg-blue-500)", 5)
 * → { content: "bg-blue-500", nextIndex: 18 }
 */
function extractGroup(input: string, startIndex: number): { content: string; nextIndex: number } {
  let depth = 0
  let i = startIndex
  let contentStart = -1

  for (; i < input.length; i++) {
    if (input[i] === '(') {
      if (depth === 0) contentStart = i + 1
      depth++
    } else if (input[i] === ')') {
      depth--
      if (depth === 0) {
        const content = input.slice(contentStart, i)
        return { content, nextIndex: i + 1 }
      }
    }
  }

  // Unmatched parentheses — return empty
  return { content: '', nextIndex: input.length }
}

/**
 * Reads the next valid token (class name or word) after a prefix like `group-` or `peer-`.
 * Stops at space, colon, or parentheses.
 */
function readNextToken(input: string, index: number): string {
  let i = index
  while (i < input.length && /[^\s():]/.test(input[i])) i++
  return input.slice(index, i)
}
