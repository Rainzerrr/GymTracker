export const formatProgressValue = (value: number, unit: string): string => {
  const formattedNumber = value.toLocaleString('fr-FR', { maximumFractionDigits: 1 })

  return `${formattedNumber} ${unit}`
}
