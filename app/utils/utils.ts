/**
 * Utility functions for normalizing route paths.
 * @example
 * normalizePath('/fitness/') // returns '/fitness'
 * normalizePath('/fitness')  // returns '/fitness'
 */
function normalizePath(path: string) {
  return path.replace(/\/+$/, '')
}

/**
 * Gets a random inspirational message from a predefined list in constants.
 * @example
 * "Keep pushing forward, no matter the obstacles."
 */
const getInspirationalMessage = () =>
  inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)]

/**
 * Returns the ordinal string for a given number (e.g., 1st, 2nd, 3rd, 4th, ...)
 * @example
 * "th"
 */
const getOrdinal = (n: number): string => {
  if (n % 100 >= 11 && n % 100 <= 13) return 'th'
  switch (n % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

/**
 * Return a brief display date for page headlines.
 * @example
 * "Friday, October 3rd"
 */
const getBriefDisplayDate = (utcDate: string): string => {
  if (!utcDate) return 'No Date'

  const dateObj = new Date(utcDate)
  if (isNaN(dateObj.getTime())) return 'Invalid Date'

  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' })
  const dayNumber = dateObj.getDate()
  const daySuffix = getOrdinal(dayNumber)

  return `${dayName}, ${monthName} ${dayNumber}${daySuffix}`
}

/**
 * Return a compact display date for tables.
 * @example
 * "2024 Sep 1st, Sun 12:17 PM"
 */
const getCompactDisplayDate = (utcDate: string): string => {
  if (!utcDate) return 'No Date'

  const dateObj = new Date(utcDate)
  if (isNaN(dateObj.getTime())) return 'Invalid Date'

  const year = dateObj.getFullYear()
  const dayName = shortDays[dateObj.getDay()]
  const monthName = shortMonths[dateObj.getMonth()]
  const dayNumber = dateObj.getDate()
  const daySuffix = getOrdinal(dayNumber)

  let hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  if (hours === 0) hours = 12
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`

  return `${year} ${monthName} ${dayNumber}${daySuffix}, ${dayName} ${hours}:${minutesStr} ${ampm}`
}

/**
 * Return a full display date for detailed views.
 * @example
 * "Friday, October 3rd, 2024, 2:15:30 PM"
 */
const getFullDisplayDate = (utcDate: string): string => {
  if (!utcDate) return 'No Date'

  const dateObj = new Date(utcDate)
  if (isNaN(dateObj.getTime())) return 'Invalid Date'

  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
}

/**
 * Utility for characters, word count, and estimated reading time for a given text.
 * @example
 * getWritingMetrics("Hello world!") // returns { characters: 12, words: 2, readingTime: 1 }
 */
const getWritingMetrics = (text: string) => {
  let words = 0
  const characters = text?.length ?? 0

  // Calculate word count
  if (text) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'word' })
    for (const segment of segmenter.segment(text)) {
      if (segment.isWordLike) words++
    }
  }

  // Calculate reading time assuming 200 words per minute
  const readingTime = Math.max(0, Math.ceil(words / 200))
  return { characters, words, readingTime }
}

export {
  getBriefDisplayDate,
  getCompactDisplayDate,
  getFullDisplayDate,
  getInspirationalMessage,
  getOrdinal,
  getWritingMetrics,
  normalizePath,
}
