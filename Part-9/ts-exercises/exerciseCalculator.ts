interface Result {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

export const calculateExercises = (hours: number[], target: number): Result => {
  const periodLength = hours.length
  const trainingDays = hours.filter(h => h > 0).length
  const average = hours.reduce((a, b) => a + b, 0) / periodLength
  const success = average >= target

  let rating: number
  let ratingDescription: string
  if (average >= target) {
    rating = 3
    ratingDescription = 'great job, target reached!'
  } else if (average >= target * 0.75) {
    rating = 2
    ratingDescription = 'not too bad but could be better'
  } else {
    rating = 1
    ratingDescription = 'you need to work harder'
  }

  return { periodLength, trainingDays, success, rating, ratingDescription, target, average }
}

const args = process.argv.slice(2)
if (args.length >= 2) {
  const target = Number(args[0])
  const hours = args.slice(1).map(Number)
  if (isNaN(target) || hours.some(isNaN)) {
    console.error('Please provide numeric values only')
    process.exit(1)
  }
  console.log(calculateExercises(hours, target))
} else {
  console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))
}
