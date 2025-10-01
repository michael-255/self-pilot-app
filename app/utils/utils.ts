/**
 * Returns a formatted local display date string from a UTC date string.
 * @param utcDate UTC date string in ISO format
 * @returns `2024 Sep 1st, Sun 12:17 PM`
 */
export function localDisplayDate(utcDate: string): string {
  if (!utcDate) return 'No Date'

  const dateObj = new Date(utcDate)

  if (isNaN(dateObj.getTime())) return 'Invalid Date'

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const dayName = days[dateObj.getDay()]
  const year = dateObj.getFullYear()
  const monthName = months[dateObj.getMonth()]
  const day = dateObj.getDate()

  // Get ordinal suffix
  function ordinal(n: number) {
    if (n > 3 && n < 21) return 'th'
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
  const dayWithSuffix = `${day}${ordinal(day)}`

  let hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  if (hours === 0) hours = 12
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`

  return `${year} ${monthName} ${dayWithSuffix}, ${dayName} ${hours}:${minutesStr} ${ampm}`
}
