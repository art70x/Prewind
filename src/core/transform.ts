import { extractClasses } from '../utils/extractor.js'
import { expandVariants } from './expand.js'

export const transform = (content: string): string => {
  // Extract all class attributes
  const classes = extractClasses(content)

  let transformed = content

  // Replace each class attribute in the content with the expanded version
  for (const classValue of classes) {
    const expanded = expandVariants(classValue, '')
    // Replace the first occurrence of this exact class string
    transformed = transformed.replace(
      new RegExp(`class(Name)?=["']${escapeRegExp(classValue)}["']`),
      `class="${expanded.join(' ')}"`,
    )
  }

  return transformed
}

/**
 * Escape special regex characters in a string for safe RegExp creation
 */
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
