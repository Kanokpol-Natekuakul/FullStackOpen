export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / ((height / 100) ** 2)
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal range'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

if (require.main === module) {
  const args = process.argv.slice(2)
  if (args.length === 2) {
    const height = Number(args[0])
    const weight = Number(args[1])
    if (isNaN(height) || isNaN(weight)) {
      console.error('Please provide numeric values for height and weight')
      process.exit(1)
    }
    console.log(calculateBmi(height, weight))
  } else {
    console.log(calculateBmi(180, 74))
  }
}
