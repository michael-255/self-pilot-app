import z from 'zod'

export const appTitle = 'Self Pilot'
export const appDescription = `${appTitle} is a collection of tools and mini-apps for day-to-day life.`

export const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const longDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const shortMonths = [
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

export const longMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const durationNames = z.enum([
  'Now',
  'One Second',
  'One Minute',
  'One Hour',
  'One Day',
  'One Week',
  'One Month',
  'Three Months',
  'Six Months',
  'One Year',
  'Two Years',
  'Three Years',
  'All Time',
  'Forever',
])

export const inspirationalMessages = [
  'Life is a journey, not a destination.',
  "Believe you can and you're halfway there.",
  'The only way to do great work is to love what you do.',
  'You are never too old to set another goal or to dream a new dream.',
  'Success is not final, failure is not fatal: It is the courage to continue that counts.',
  'Happiness is not something ready made. It comes from your own actions.',
  'The best way to predict the future is to create it.',
  'In the middle of every difficulty lies opportunity.',
  'The only limit to our realization of tomorrow will be our doubts of today.',
  'What lies behind us and what lies before us are tiny matters compared to what lies within us.',
  'The future belongs to those who believe in the beauty of their dreams.',
  'It does not matter how slowly you go as long as you do not stop.',
  "You miss 100% of the shots you don't take.",
  'The only person you are destined to become is the person you decide to be.',
  'Go confidently in the direction of your dreams. Live the life you have imagined.',
  "Don't watch the clock; do what it does. Keep going.",
  'Keep your face always toward the sunshine and shadows will fall behind you.',
  'The only way to achieve the impossible is to believe it is possible.',
  'Start where you are. Use what you have. Do what you can.',
  'Dream big and dare to fail.',
  'Act as if what you do makes a difference. It does.',
  'Success usually comes to those who are too busy to be looking for it.',
  "You can't cross the sea merely by standing and staring at the water.",
  'What you get by achieving your goals is not as important as what you become by achieving your goals.',
  'Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.',
]
